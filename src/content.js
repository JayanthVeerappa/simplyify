// Main Content Script - Cognitive Accessibility Assistant
// Subtle, intelligent accessibility layer with right-side summary panel

(function() {
  'use strict';

  // State management
  const state = {
    panelVisible: true,
    isFocusMode: false,
    currentFocusIndex: 0,
    isReading: false,
    complexParagraphs: [],
    settings: {}
  };

  // Initialize on page load
  async function init() {
    console.log('🧠 Cognitive Assistant: Initializing...');
    
    // Wait for utility scripts to load
    const ready = await waitForDependencies();
    if (!ready) {
      console.error('❌ Failed to initialize - dependencies not ready');
      return;
    }
    
    // Load settings
    await loadSettings();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Listen for messages from popup/options
    chrome.runtime.onMessage.addListener(handleMessage);
    
    console.log('✓ Cognitive Assistant: Ready');
    
    // AUTO-RUN after page fully renders
    setTimeout(async () => {
      await analyzeAndEnhancePage();
    }, 1500);
  }

  /**
   * Wait for utility scripts to load
   */
  async function waitForDependencies() {
    const maxWait = 5000; // 5 seconds max
    const startTime = Date.now();
    
    while (!window.CogAssist_DOM || !window.CogAssist_NLP || !window.CogAssist_TTS) {
      if (Date.now() - startTime > maxWait) {
        console.error('⚠️ Timeout waiting for dependencies');
        console.error('Missing:', {
          DOM: !window.CogAssist_DOM,
          NLP: !window.CogAssist_NLP,
          TTS: !window.CogAssist_TTS
        });
        break;
      }
      await sleep(50);
    }
    
    if (window.CogAssist_DOM && window.CogAssist_NLP && window.CogAssist_TTS) {
      console.log('✓ All dependencies loaded');
      return true;
    } else {
      console.warn('⚠️ Some dependencies missing:', {
        DOM: !!window.CogAssist_DOM,
        NLP: !!window.CogAssist_NLP,
        TTS: !!window.CogAssist_TTS
      });
      return false;
    }
  }

  /**
   * Main entry point - analyze page and create subtle enhancements
   */
  async function analyzeAndEnhancePage() {
    try {
      // Check dependencies
      if (!window.CogAssist_DOM || !window.CogAssist_NLP) {
        console.warn('⚠️ Dependencies not ready, skipping enhancement');
        return;
      }

      // 1. Extract and analyze content
      const analysis = analyzePageContent();
      
      if (!analysis.mainContent || analysis.totalWords < 100) {
        console.log('⚠️ Page too short, skipping enhancement');
        return;
      }

      // 2. Detect tone
      let toneResult = { tone: 'neutral', confidence: 0.5 };
      if (state.settings.autoDetectComplexity !== false && window.CogAssist_NLP) {
        try {
          toneResult = await window.CogAssist_NLP.detectTone(analysis.fullText);
        } catch (e) {
          console.warn('Tone detection failed:', e);
        }
      }

      // 3. Get AI summary
      let summary = null;
      let apiKeyMissing = false;
      
      if (state.settings.autoSimplify !== false && analysis.totalWords > 200 && window.CogAssist_NLP) {
        // Check if API key is configured
        if (!state.settings.apiKey || state.settings.apiKey.trim() === '') {
          console.warn('⚠️ No API key configured');
          apiKeyMissing = true;
        } else {
          try {
            console.log('📝 Requesting AI summary for', analysis.totalWords, 'words...');
            summary = await window.CogAssist_NLP.simplifyText(analysis.fullText, state.settings.readingLevel || '8');
            console.log('✅ Summary received:', summary);
          } catch (e) {
            console.error('❌ AI summary failed:', e);
            showNotification('⚠️ Could not generate summary - check API key');
          }
        }
      } else {
        console.log('⏭️ Skipping AI summary:', { 
          autoSimplify: state.settings.autoSimplify, 
          wordCount: analysis.totalWords,
          hasNLP: !!window.CogAssist_NLP 
        });
      }

      // 4. Create elegant sidebar panel
      createSidebarPanel(summary, toneResult, analysis, apiKeyMissing);

      // 5. Selectively simplify complex paragraphs (in-place)
      if (state.settings.autoSimplify !== false && analysis.complexParagraphs.length > 0) {
        await selectivelySimplifyComplexContent(analysis.complexParagraphs);
      }

      // 6. Auto-enable focus mode if setting enabled
      if (state.settings.autoFocusMode) {
        setTimeout(() => enableFocusMode(), 2000);
      }

      // 7. Auto-start TTS if enabled
      if (state.settings.autoTTS) {
        setTimeout(() => startReading(), 3000);
      }

    } catch (error) {
      console.error('Enhancement failed:', error);
    }
  }

  /**
   * Analyze page content and detect complexity
   */
  function analyzePageContent() {
    if (!window.CogAssist_DOM) {
      return { mainContent: null, complexParagraphs: [], totalWords: 0, fullText: '' };
    }

    const { findMainContent } = window.CogAssist_DOM;
    
    // Find main content container
    const mainContent = findMainContent();
    if (!mainContent) return { mainContent: null, complexParagraphs: [], totalWords: 0, fullText: '' };

    // Get all text blocks (paragraphs, list items, headings)
    const textBlocks = Array.from(mainContent.querySelectorAll('p, li, h1, h2, h3, article > div'));
    const complexParagraphs = [];
    let fullText = '';

    textBlocks.forEach(block => {
      const text = block.textContent.trim();
      if (text.length < 50) return; // Skip very short blocks

      fullText += text + '\n\n';

      // Analyze complexity
      const metrics = calculateComplexity(text);
      
      // Mark as complex if:
      // - Average sentence length > 20 words
      // - Complex word ratio > 25%
      // - Reading level > 12th grade
      if (metrics.avgSentenceLength > 20 || metrics.complexWordRatio > 25 || metrics.readingLevel > 12) {
        complexParagraphs.push({
          element: block,
          text: text,
          metrics: metrics
        });
      }
    });

    return {
      mainContent,
      complexParagraphs,
      fullText: fullText.slice(0, 5000), // Limit for API
      totalWords: fullText.split(/\s+/).length
    };
  }

  /**
   * Calculate complexity metrics for a text block
   */
  function calculateComplexity(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const avgSentenceLength = words.length / Math.max(sentences.length, 1);
    
    // Count complex words (3+ syllables)
    const complexWords = words.filter(word => countSyllables(word) >= 3);
    const complexWordRatio = (complexWords.length / words.length) * 100;
    
    // Flesch-Kincaid Grade Level approximation
    const readingLevel = 0.39 * avgSentenceLength + 11.8 * (countTotalSyllables(words) / words.length) - 15.59;
    
    return {
      avgSentenceLength: Math.round(avgSentenceLength),
      complexWordRatio: Math.round(complexWordRatio),
      readingLevel: Math.max(1, Math.round(readingLevel)),
      totalWords: words.length
    };
  }

  /**
   * Count syllables in a word
   */
  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    const vowels = word.match(/[aeiouy]+/g);
    return vowels ? Math.max(1, vowels.length - (word.endsWith('e') ? 1 : 0)) : 1;
  }

  function countTotalSyllables(words) {
    return words.reduce((sum, word) => sum + countSyllables(word), 0);
  }

  /**
   * Create elegant right-side summary panel
   */
  function createSidebarPanel(summary, tone, analysis, apiKeyMissing = false) {
    // Remove existing panel
    const existing = document.getElementById('cog-assist-sidebar');
    if (existing) existing.remove();

    // Create panel container
    const panel = document.createElement('div');
    panel.id = 'cog-assist-sidebar';
    panel.className = 'cog-assist-panel';
    
    // Build panel content
    panel.innerHTML = `
      <div class="cog-panel-header">
        <h3>📖 Page Assistant</h3>
        <button class="cog-panel-toggle" aria-label="Toggle panel">
          <span class="toggle-icon">◀</span>
        </button>
      </div>

      <div class="cog-panel-content">
        <!-- Tone Indicator -->
        ${tone && tone.tone !== 'neutral' ? `
          <div class="cog-tone-badge cog-tone-${tone.tone}">
            <span class="tone-icon">${getToneIcon(tone.tone)}</span>
            <span class="tone-label">${capitalize(tone.tone)} Tone</span>
          </div>
        ` : ''}

        <!-- Page Summary -->
        ${apiKeyMissing ? `
          <div class="cog-section">
            <h4>📝 Summary</h4>
            <div style="padding: 16px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1)); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);">
              <p style="margin: 0 0 12px 0; font-weight: 600; color: #dc2626;">🔑 API Key Required</p>
              <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.6; color: #374151;">
                To use AI-powered summaries and text simplification, you need a Google Gemini API key.
              </p>
              <ol style="margin: 0 0 12px 0; padding-left: 20px; font-size: 13px; color: #4b5563;">
                <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" style="color: #6366f1; text-decoration: underline;">Google AI Studio</a></li>
                <li>Create a free API key</li>
                <li>Add it in Settings</li>
              </ol>
              <button onclick="chrome.runtime.openOptionsPage()" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                Open Settings
              </button>
            </div>
          </div>
        ` : summary && summary.keySentences && summary.keySentences.length > 0 ? `
          <div class="cog-section">
            <h4>📝 Summary</h4>
            <ul class="cog-summary-list">
              ${summary.keySentences.slice(0, 7).map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
          </div>
        ` : `
          <div class="cog-section">
            <h4>📝 Summary</h4>
            <p style="padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; font-size: 13px; color: #1e40af;">
              ⏳ Generating AI summary...
            </p>
          </div>
        `}

        <!-- Key Actions -->
        ${summary && summary.bullets && summary.bullets.length > 0 ? `
          <div class="cog-section">
            <h4>🎯 Key Actions</h4>
            <ul class="cog-action-list">
              ${summary.bullets.slice(0, 5).map(b => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Complexity Stats -->
        <div class="cog-section">
          <h4>📊 Page Analysis</h4>
          <div class="cog-stats">
            <div class="stat-item">
              <span class="stat-label">Complex sections:</span>
              <span class="stat-value">${analysis.complexParagraphs.length}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total words:</span>
              <span class="stat-value">${analysis.totalWords.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="cog-section">
          <h4>⚙️ Quick Actions</h4>
          <div class="cog-controls">
            <button class="cog-btn cog-btn-focus" data-action="focus">
              <span>🎯</span> Focus Mode
            </button>
            <button class="cog-btn cog-btn-read" data-action="read">
              <span>🔊</span> Read Aloud
            </button>
            <button class="cog-btn cog-btn-about" data-action="about">
              <span>ℹ️</span> About
            </button>
          </div>
        </div>
      </div>
    `;

    // Inject into page
    document.body.appendChild(panel);

    // Animate in
    setTimeout(() => panel.classList.add('cog-panel-visible'), 50);

    // Setup event listeners
    setupPanelEvents(panel);
  }

  /**
   * Setup panel event listeners
   */
  function setupPanelEvents(panel) {
    // Toggle panel
    const toggleBtn = panel.querySelector('.cog-panel-toggle');
    toggleBtn?.addEventListener('click', () => {
      state.panelVisible = !state.panelVisible;
      panel.classList.toggle('cog-panel-collapsed');
      const icon = toggleBtn.querySelector('.toggle-icon');
      if (icon) icon.textContent = state.panelVisible ? '◀' : '▶';
    });

    // Control buttons
    const focusBtn = panel.querySelector('[data-action="focus"]');
    focusBtn?.addEventListener('click', () => toggleFocusMode());

    const readBtn = panel.querySelector('[data-action="read"]');
    readBtn?.addEventListener('click', () => toggleReading());

    const aboutBtn = panel.querySelector('[data-action="about"]');
    aboutBtn?.addEventListener('click', () => showAboutPage());
  }

  /**
   * Show About page overlay
   */
  function showAboutPage() {
    // Remove existing about page if present
    const existing = document.getElementById('cog-assist-about');
    if (existing) {
      existing.remove();
      return; // Toggle behavior
    }

    // Create about page overlay
    const aboutPage = document.createElement('div');
    aboutPage.id = 'cog-assist-about';
    aboutPage.className = 'cog-about-overlay';
    
    aboutPage.innerHTML = `
      <div class="cog-about-content">
        <div class="cog-about-header">
          <h2>Cognitive Accessibility Assistant</h2>
          <button class="cog-about-close" aria-label="Close">&times;</button>
        </div>
        
        <div class="cog-about-body">
          <section class="about-section">
            <h3>What This Does</h3>
            <p>
              A thoughtful accessibility layer that helps people with dyslexia, ADHD, 
              cognitive processing differences, or language barriers read web content more easily.
            </p>
          </section>

          <section class="about-section">
            <h3>How It Works</h3>
            <ul class="about-list">
              <li><strong>Complexity Detection</strong> – Analyzes text for reading difficulty</li>
              <li><strong>Smart Simplification</strong> – AI rewrites complex sections at your reading level</li>
              <li><strong>Hover Tooltips</strong> – See simplified text without replacing the original</li>
              <li><strong>Focus Mode</strong> – Reduces visual overwhelm with soft highlighting</li>
              <li><strong>Text-to-Speech</strong> – Natural voice reading with live highlighting</li>
            </ul>
          </section>

          <section class="about-section">
            <h3>Design Philosophy</h3>
            <p>
              <strong>Non-intrusive</strong> – No popups or blocking overlays<br>
              <strong>Contextual</strong> – Enhancements appear only when needed<br>
              <strong>Reversible</strong> – Original content always preserved<br>
              <strong>Private</strong> – No tracking or data collection
            </p>
          </section>

          <section class="about-section">
            <h3>Privacy & Security</h3>
            <p>
              This extension stores your API key locally and uses it only for text processing. 
              No usage data, browsing history, or personal information is collected or transmitted.
            </p>
          </section>

          <section class="about-section about-footer">
            <p><strong>Powered by:</strong> Google Gemini 2.5 Flash API</p>
            <p><strong>Version:</strong> 1.0.0 | <strong>License:</strong> MIT</p>
            <p style="margin-top: 16px; font-size: 13px; color: #6b7280;">
              Made with care for a more accessible web.
            </p>
          </section>
        </div>
      </div>
    `;

    document.body.appendChild(aboutPage);

    // Animate in
    setTimeout(() => aboutPage.classList.add('cog-about-visible'), 50);

    // Close button handler
    const closeBtn = aboutPage.querySelector('.cog-about-close');
    closeBtn?.addEventListener('click', () => {
      aboutPage.classList.remove('cog-about-visible');
      setTimeout(() => aboutPage.remove(), 300);
    });

    // Close on overlay click (not content)
    aboutPage.addEventListener('click', (e) => {
      if (e.target === aboutPage) {
        aboutPage.classList.remove('cog-about-visible');
        setTimeout(() => aboutPage.remove(), 300);
      }
    });

    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        aboutPage.classList.remove('cog-about-visible');
        setTimeout(() => aboutPage.remove(), 300);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  /**
   * Selectively simplify only complex paragraphs in-place
   */
  async function selectivelySimplifyComplexContent(complexParagraphs) {
    if (complexParagraphs.length === 0 || !window.CogAssist_NLP) return;

    // Limit to first 15 paragraphs to avoid performance issues
    const toSimplify = complexParagraphs.slice(0, 15);

    for (const item of toSimplify) {
      try {
        // Get simplified version from AI
        const result = await window.CogAssist_NLP.simplifyText(item.text, state.settings.readingLevel || '8');
        
        if (result.simplified && result.simplified !== item.text) {
          // Store original and simplified versions
          item.element.setAttribute('data-original-text', item.text);
          item.element.setAttribute('data-simplified-text', result.simplified);
          item.element.setAttribute('data-simplified', 'true');
          
          // Add subtle indicator
          item.element.style.borderLeft = '3px solid #6366f1';
          item.element.style.paddingLeft = '12px';
          item.element.style.transition = 'all 0.3s ease';
          item.element.style.cursor = 'help';
          
          // Add hover tooltip
          addHoverTooltip(item.element, result.simplified);
        }
      } catch (e) {
        console.warn('Failed to simplify paragraph:', e);
        // Continue with next paragraph
      }

      // Throttle API calls
      await sleep(300);
    }

    console.log(`✓ Simplified ${toSimplify.length} complex sections`);
  }

  /**
   * Add hover tooltip to show simplified version
   */
  function addHoverTooltip(element, simplifiedText) {
    let tooltip = null;

    element.addEventListener('mouseenter', () => {
      // Create tooltip
      tooltip = document.createElement('div');
      tooltip.className = 'cog-assist-tooltip';
      tooltip.innerHTML = `
        <div class="tooltip-header">✨ Simplified</div>
        <div class="tooltip-content">${escapeHtml(simplifiedText)}</div>
      `;
      
      document.body.appendChild(tooltip);
      
      // Position tooltip near the element
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Position above or below based on space
      if (rect.top > tooltipRect.height + 20) {
        // Show above
        tooltip.style.top = `${rect.top + window.scrollY - tooltipRect.height - 10}px`;
      } else {
        // Show below
        tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
      }
      
      // Center horizontally, but keep within viewport
      let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
      left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
      tooltip.style.left = `${left}px`;
      
      // Animate in
      setTimeout(() => tooltip.classList.add('cog-tooltip-visible'), 10);
    });

    element.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.classList.remove('cog-tooltip-visible');
        const tooltipToRemove = tooltip;
        tooltip = null;
        setTimeout(() => {
          if (tooltipToRemove && tooltipToRemove.parentNode) {
            tooltipToRemove.remove();
          }
        }, 200);
      }
    });
  }

  /**
   * Toggle focus mode - highlight current section, dim rest
   */
  function toggleFocusMode() {
    state.isFocusMode = !state.isFocusMode;

    if (state.isFocusMode) {
      enableFocusMode();
    } else {
      disableFocusMode();
    }
  }

  function enableFocusMode() {
    state.isFocusMode = true;
    
    // Get all paragraphs
    const paragraphs = Array.from(document.querySelectorAll('p, li, h1, h2, h3'));
    if (paragraphs.length === 0) return;

    // Add dimming overlay
    const overlay = document.createElement('div');
    overlay.id = 'cog-focus-overlay';
    overlay.className = 'cog-focus-overlay';
    document.body.appendChild(overlay);

    // Highlight first visible paragraph
    state.currentFocusIndex = 0;
    highlightFocusParagraph(paragraphs);

    // Setup navigation
    setupFocusNavigation(paragraphs);

    showNotification('🎯 Focus Mode Active (↑↓ to navigate)');
  }

  function disableFocusMode() {
    state.isFocusMode = false;
    
    // Remove overlay
    const overlay = document.getElementById('cog-focus-overlay');
    overlay?.remove();

    // Remove all highlights
    document.querySelectorAll('.cog-focused').forEach(el => {
      el.classList.remove('cog-focused');
    });

    showNotification('Focus Mode Disabled');
  }

  function highlightFocusParagraph(paragraphs) {
    // Remove previous highlight
    document.querySelectorAll('.cog-focused').forEach(el => {
      el.classList.remove('cog-focused');
    });

    // Highlight current
    const current = paragraphs[state.currentFocusIndex];
    if (current) {
      current.classList.add('cog-focused');
      current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function setupFocusNavigation(paragraphs) {
    const handler = (e) => {
      if (!state.isFocusMode) {
        document.removeEventListener('keydown', handler);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.currentFocusIndex = Math.min(paragraphs.length - 1, state.currentFocusIndex + 1);
        highlightFocusParagraph(paragraphs);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.currentFocusIndex = Math.max(0, state.currentFocusIndex - 1);
        highlightFocusParagraph(paragraphs);
      } else if (e.key === 'Escape') {
        disableFocusMode();
      }
    };

    document.addEventListener('keydown', handler);
  }

  /**
   * Toggle text-to-speech
   */
  function toggleReading() {
    if (state.isReading) {
      stopReading();
    } else {
      startReading();
    }
  }

  function startReading() {
    if (!window.CogAssist_DOM || !window.CogAssist_TTS) {
      showNotification('⚠️ Text-to-speech not available');
      return;
    }

    const { findMainContent } = window.CogAssist_DOM;
    const mainContent = findMainContent();
    
    if (!mainContent) {
      showNotification('⚠️ No content found to read');
      return;
    }

    state.isReading = true;
    
    const text = mainContent.innerText;
    try {
      window.CogAssist_TTS.speak(text, {
        rate: state.settings.ttsRate || 1.0,
        onEnd: () => {
          state.isReading = false;
        },
        onError: (error) => {
          console.error('TTS error:', error);
          state.isReading = false;
          showNotification('⚠️ Speech error occurred');
        }
      });
      showNotification('🔊 Reading aloud...');
    } catch (error) {
      console.error('Failed to start TTS:', error);
      state.isReading = false;
      showNotification('⚠️ Could not start reading');
    }
  }

  function stopReading() {
    state.isReading = false;
    
    if (window.CogAssist_TTS) {
      window.CogAssist_TTS.stop();
    }

    showNotification('⏹️ Reading stopped');
  }

  /**
   * Keyboard shortcuts
   */
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey) {
        switch(e.key.toLowerCase()) {
          case 'f':
            e.preventDefault();
            toggleFocusMode();
            break;
          case 'r':
            e.preventDefault();
            toggleReading();
            break;
          case 'p':
            e.preventDefault();
            const panel = document.getElementById('cog-assist-sidebar');
            panel?.querySelector('.cog-panel-toggle')?.click();
            break;
        }
      }
    });
  }

  /**
   * Load settings from storage
   */
  async function loadSettings() {
    return new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, response => {
        state.settings = response?.settings || {};
        resolve();
      });
    });
  }

  /**
   * Handle messages from popup/options
   */
  function handleMessage(message, sender, sendResponse) {
    switch(message.type) {
      case 'TOGGLE_FOCUS':
        toggleFocusMode();
        sendResponse({ success: true });
        break;
      case 'TOGGLE_TTS':
        toggleReading();
        sendResponse({ success: true });
        break;
      case 'REFRESH':
        analyzeAndEnhancePage();
        sendResponse({ success: true });
        break;
    }
    return true;
  }

  /**
   * Utilities
   */
  function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'cog-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('cog-toast-visible'), 50);
    setTimeout(() => {
      toast.classList.remove('cog-toast-visible');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function getToneIcon(tone) {
    const icons = {
      'urgent': '⚠️',
      'strict': '📋',
      'friendly': '😊',
      'sarcastic': '😏',
      'neutral': 'ℹ️'
    };
    return icons[tone] || 'ℹ️';
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
