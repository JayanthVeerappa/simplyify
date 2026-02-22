// NLP Client - Routes requests to background service worker
// Keeps API keys secure by never exposing them to page scripts

/**
 * Request text simplification from AI
 */
async function simplifyText(text, readingLevel = '8') {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        {
          type: 'NLP_REQUEST',
          action: 'simplify',
          payload: { text, readingLevel }
        },
        response => {
          if (chrome.runtime.lastError) {
            const error = chrome.runtime.lastError.message;
            // Provide user-friendly error messages
            if (error.includes('Extension context invalidated')) {
              reject(new Error('Extension context invalidated'));
            } else {
              reject(new Error(error));
            }
            return;
          }
          
          if (!response) {
            reject(new Error('No response from background script'));
            return;
          }
          
          if (response.error) {
            if (response.fallback) {
              // API failed, use fallback
              resolve(createFallbackSimplification(text));
            } else {
              // Pass through API errors (like quota exceeded)
              reject(new Error(response.error));
            }
            return;
          }
          
          resolve(response);
        }
      );
    } catch (e) {
      reject(new Error('Failed to send message: ' + e.message));
    }
  });
}

/**
 * Request tone/emotion detection from AI
 */
async function detectTone(text) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        {
          type: 'NLP_REQUEST',
          action: 'tone',
          payload: { text }
        },
        response => {
          if (chrome.runtime.lastError) {
            const error = chrome.runtime.lastError.message;
            if (error.includes('Extension context invalidated')) {
              // Return neutral tone instead of failing completely
              resolve({ tone: 'neutral', confidence: 0.5, explanation: 'Extension reloaded' });
            } else {
              // Return neutral tone on error
              resolve({ tone: 'neutral', confidence: 0.5, explanation: 'Unable to detect' });
            }
            return;
          }
          
          if (!response || response.error) {
            // Return neutral tone on error
            resolve({ tone: 'neutral', confidence: 0.5, explanation: 'Unable to detect' });
            return;
          }
          
          resolve(response);
        }
      );
    } catch (e) {
      // Return neutral tone on exception
      resolve({ tone: 'neutral', confidence: 0.5, explanation: 'Error: ' + e.message });
    }
  });
}

/**
 * Fallback simplification when API is unavailable
 * Uses basic heuristics to create a simplified version
 */
function createFallbackSimplification(text) {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // Take first 5-7 sentences as simplified version
  const simplified = sentences.slice(0, 7).join(' ').trim();
  
  // Extract first sentence of each paragraph as key sentences
  const paragraphs = text.split(/\n\n+/);
  const keySentences = paragraphs
    .map(p => {
      const firstSentence = p.match(/^[^.!?]+[.!?]+/);
      return firstSentence ? firstSentence[0].trim() : null;
    })
    .filter(Boolean)
    .slice(0, 5);
  
  // Create bullet points from sentences
  const bullets = sentences
    .slice(0, 6)
    .map(s => s.trim().replace(/^[^a-zA-Z0-9]+/, ''))
    .filter(s => s.length > 20 && s.length < 150);
  
  return {
    simplified,
    keySentences,
    bullets,
    fallback: true
  };
}

// Export to global scope
window.CogAssist_NLP = {
  simplifyText,
  detectTone
};
