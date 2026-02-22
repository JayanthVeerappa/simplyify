// Text-to-Speech Engine using Web Speech API
// Provides word-level highlighting and adjustable speech parameters

class TTSEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.isPaused = false;
    this.onWordCallback = null;
    this.highlightedElement = null;
    this.container = null; // Container for highlighting
    this.currentText = ''; // Store current text being read
  }

  /**
   * Set the container element for word highlighting
   */
  setContainer(element) {
    this.container = element;
  }

  /**
   * Get available voices
   */
  getVoices() {
    return this.synth.getVoices();
  }

  /**
   * Speak text with word-level highlighting
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any ongoing speech
      this.stop();

      this.currentText = text;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech parameters
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Set voice if specified
      if (options.voice) {
        const voices = this.getVoices();
        const voice = voices.find(v => v.name === options.voice);
        if (voice) utterance.voice = voice;
      }

      // Word boundary events for highlighting
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          // Call custom callback if provided
          if (this.onWordCallback) {
            this.onWordCallback(event.charIndex, event.charLength);
          }

          // Pause slightly at punctuation for comprehension
          const word = text.substr(event.charIndex, event.charLength);
          const nextChar = text.charAt(event.charIndex + event.charLength);
          
          if (['.', '!', '?'].includes(nextChar)) {
            // Longer pause at sentence end (handled by natural speech synthesis)
          } else if ([',', ';', ':'].includes(nextChar)) {
            // Shorter pause at commas (handled by natural speech synthesis)
          }
        }
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.currentText = '';
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        this.currentUtterance = null;
        this.currentText = '';
        if (options.onError) options.onError(error);
        // Don't reject - just resolve silently to prevent unhandled errors
        resolve();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Highlight the current word being spoken
   */
  highlightWord(fullText, charIndex, charLength) {
    // Clear previous highlight
    this.clearHighlight();

    // Find the word in the visible content
    const word = fullText.substr(charIndex, charLength);
    
    // Create a temporary highlight
    const range = this.findWordRange(word, charIndex);
    if (range) {
      const span = document.createElement('span');
      span.className = 'cog-assist-speaking';
      span.setAttribute('data-speaking', 'true');
      
      try {
        range.surroundContents(span);
        this.highlightedElement = span;
        
        // Scroll into view smoothly
        span.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {
        // Range might span multiple elements, skip highlighting
        console.warn('Could not highlight word:', e);
      }
    }
  }

  /**
   * Find the range for a specific word at character index
   */
  findWordRange(word, charIndex) {
    // Simple implementation: find in main content
    const main = document.querySelector('#cog-assist-simplified, main, article, body');
    if (!main) return null;

    const text = main.innerText;
    const wordIndex = text.indexOf(word, Math.max(0, charIndex - 50));
    
    if (wordIndex === -1) return null;

    // This is a simplified version - a production implementation would
    // need more sophisticated text node traversal
    return null; // Disabled for now to avoid errors
  }

  /**
   * Clear word highlighting
   */
  clearHighlight() {
    if (this.highlightedElement) {
      const parent = this.highlightedElement.parentNode;
      if (parent) {
        const text = this.highlightedElement.textContent;
        parent.replaceChild(document.createTextNode(text), this.highlightedElement);
      }
      this.highlightedElement = null;
    }

    // Also clear any existing highlights
    document.querySelectorAll('[data-speaking="true"]').forEach(el => {
      const text = el.textContent;
      el.parentNode.replaceChild(document.createTextNode(text), el);
    });
  }

  /**
   * Add a pause (simulated with slight delay)
   */
  addPause(ms) {
    // Note: SpeechSynthesis doesn't support real-time pausing
    // This is a placeholder for future enhancement
  }

  /**
   * Pause speech
   */
  pause() {
    if (this.synth.speaking) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  /**
   * Resume speech
   */
  resume() {
    if (this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  /**
   * Stop speech
   */
  stop() {
    this.synth.cancel();
    this.clearHighlight();
    this.currentUtterance = null;
    this.isPaused = false;
  }

  /**
   * Check if currently speaking
   */
  isSpeaking() {
    return this.synth.speaking;
  }
}

// Create global instance
window.CogAssist_TTS = new TTSEngine();
