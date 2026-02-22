// Background Service Worker (Manifest V3)
// Handles: settings persistence, message routing, and secure API calls

// Default settings
const DEFAULT_SETTINGS = {
  readingLevel: '8',
  ttsRate: 1.0,
  ttsVoice: null,
  showFloatingButton: true,
  autoSimplify: true,        // Auto-simplify pages on load
  autoFocusMode: false,       // Auto-enable focus mode
  autoTTS: false,             // Auto-start text-to-speech
  autoDetectComplexity: true, // Auto-detect complexity and tone
  apiKey: '',
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
};

// Initialize settings on install
chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.sync.get('settings');
  if (!stored.settings) {
    await chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
    console.log('Cognitive Assistant: Default settings initialized');
  } else {
    // Migrate old settings to use correct model
    const settings = stored.settings;
    if (settings.apiEndpoint && settings.apiEndpoint.includes('gemini-1.5-flash')) {
      settings.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
      await chrome.storage.sync.set({ settings });
      console.log('✅ Migrated to gemini-2.5-flash');
    }
  }
});

// Also check and fix endpoint on every startup
(async () => {
  const stored = await chrome.storage.sync.get('settings');
  if (stored.settings && stored.settings.apiEndpoint && stored.settings.apiEndpoint.includes('gemini-1.5-flash')) {
    stored.settings.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    await chrome.storage.sync.set({ settings: stored.settings });
    console.log('🔄 Fixed endpoint to use gemini-2.5-flash');
  }
})();

// Message handler for communication between popup, content scripts, and options
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  // Get current settings
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get('settings', (result) => {
      sendResponse({ settings: result.settings || DEFAULT_SETTINGS });
    });
    return true; // Keep channel open for async response
  }

  // Update settings
  if (message.type === 'SET_SETTINGS') {
    chrome.storage.sync.set({ settings: message.settings }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  // Handle NLP API requests (text simplification and tone detection)
  // Routes through background to keep API key secure
  if (message.type === 'NLP_REQUEST') {
    // Use promise-based async handling
    handleNLPRequest(message)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message, fallback: true }));
    return true; // Keep channel open for async response
  }

  return false;
});

// Handle NLP API calls with stored API key
async function handleNLPRequest(message) {
  try {
    const { action, payload } = message;
    
    // Get API key from storage
    const stored = await chrome.storage.sync.get('settings');
    const settings = stored.settings || DEFAULT_SETTINGS;
    const apiKey = settings.apiKey;
    
    if (!apiKey) {
      return { 
        error: 'No API key configured. Please add your API key in Settings.',
        fallback: true 
      };
    }

    // Route to appropriate handler
    if (action === 'simplify') {
      const result = await simplifyText(payload.text, payload.readingLevel, apiKey, settings.apiEndpoint);
      return result;
    } else if (action === 'tone') {
      const result = await detectTone(payload.text, apiKey, settings.apiEndpoint);
      return result;
    } else {
      return { error: 'Unknown action' };
    }
  } catch (error) {
    console.error('NLP Request failed:', error);
    return { error: error.message, fallback: true };
  }
}

// Simplify text using Google Gemini API
async function simplifyText(text, readingLevel, apiKey, endpoint) {
  console.log('🔄 Simplify request started:', { textLength: text.length, readingLevel });
  
  const prompt = `You are an expert cognitive accessibility assistant helping people with dyslexia, ADHD, and reading difficulties.

Your task: Rewrite this text to be CRYSTAL CLEAR for someone at a ${readingLevel}th grade reading level.

CRITICAL RULES FOR SIMPLIFIED VERSION:
1. Make it EXTREMELY SHORT - 1-3 sentences max (aim for 20-40 words total)
2. Capture ONLY the main idea - skip all details
3. Use the simplest possible words (like talking to a friend)
4. Keep sentences under 12 words each
5. Get straight to the point - no fluff

For the summary:
- Extract ONLY 3-4 key points (keep it short!)
- Each point must be ONE simple sentence (max 10 words)
- Answer: "What's the main idea?"
- Use simple, everyday words

For action steps:
- List ONLY 2-3 concrete actions (keep it minimal!)
- Each action must be super short (5-8 words max)
- Make them clear and specific

Return VALID JSON only (no markdown, no code blocks):
{
  "simplified": "Super brief version in 1-3 short sentences. Main idea only.",
  "keySentences": ["Short key point 1", "Short key point 2", "Short key point 3"],
  "bullets": ["Brief action 1", "Brief action 2"]
}

Text to simplify:
${text.slice(0, 4000)}`;

  try {
    // FIXED: API key now sent in header instead of query parameter
    // This is required for Google Gemini 2.5-Flash API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey  // API key must be in header, not URL
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    console.log('📡 API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText.slice(0, 200)}`);
    }

    const data = await response.json();
    console.log('📦 API response received:', data);
    
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!resultText) {
      console.error('❌ No result text in response');
      throw new Error('Empty response from API');
    }
    
    // Parse JSON from response
    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed response');
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse API response:', e);
      console.error('Raw response text:', resultText);
    }

    // Fallback response
    console.warn('⚠️ Using fallback response');
    return {
      simplified: resultText || text,
      keySentences: [],
      bullets: []
    };
  } catch (error) {
    console.error('❌ Simplify text error:', error);
    throw error;
  }
}

// Detect tone/emotion using AI
async function detectTone(text, apiKey, endpoint) {
  const prompt = `Analyze the tone and emotion of this text. Return ONLY a JSON object with this format:
{
  "tone": "urgent|neutral|friendly|strict|sarcastic",
  "confidence": 0.0-1.0,
  "explanation": "brief explanation"
}

Text to analyze:
${text.slice(0, 1000)}`;

  // FIXED: API key now sent in header instead of query parameter
  // This is required for Google Gemini 2.5-Flash API
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey  // API key must be in header, not URL
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  try {
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse tone response:', e);
  }

  return {
    tone: 'neutral',
    confidence: 0.5,
    explanation: 'Unable to determine tone'
  };
}

console.log('Cognitive Accessibility Assistant background service worker loaded');
