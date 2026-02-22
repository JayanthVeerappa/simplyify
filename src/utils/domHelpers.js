// DOM Helper Utilities
// Functions for detecting main content, removing clutter, and manipulating the page

/**
 * Find the main content area of a webpage
 * Uses semantic HTML tags and heuristics to identify the primary content
 */
function findMainContent() {
  // Priority selectors for main content
  const semanticSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.main-content',
    '#main-content',
    '.article',
    '.post-content',
    '.entry-content'
  ];

  // Try semantic selectors first
  for (const selector of semanticSelectors) {
    const element = document.querySelector(selector);
    if (element && element.innerText && element.innerText.trim().length > 200) {
      return element;
    }
  }

  // Fallback: find element with most text content
  let bestElement = document.body;
  let maxScore = 0;

  const candidates = document.querySelectorAll('div, section, article');
  candidates.forEach(element => {
    // Skip if element is too nested or has too many children
    if (element.querySelectorAll('*').length > 500) return;
    
    const text = element.innerText || '';
    const textLength = text.trim().length;
    
    // Score based on text length and paragraph count
    const paragraphs = element.querySelectorAll('p').length;
    const score = textLength + (paragraphs * 100);
    
    if (score > maxScore) {
      maxScore = score;
      bestElement = element;
    }
  });

  return bestElement;
}

/**
 * Remove clutter elements (ads, sidebars, popups, etc.)
 */
function removeClutter() {
  // Selectors for common clutter elements
  const clutterSelectors = [
    // Ads
    'aside',
    'iframe[src*="ads"]',
    'iframe[src*="doubleclick"]',
    '.ad', '.ads', '.advert', '.advertisement',
    '[class*="ad-"]', '[id*="ad-"]',
    '[class*="sponsor"]', '[id*="sponsor"]',
    
    // Navigation and sidebars
    'nav:not([role="main"])',
    '.sidebar', '.side-bar',
    '[class*="sidebar"]',
    
    // Popups and modals
    '.modal', '.popup', '.overlay',
    '[class*="popup"]', '[class*="modal"]',
    '.cookie-notice', '.cookie-banner',
    '[class*="cookie"]',
    
    // Social and sharing
    '.social-share', '.share-buttons',
    '[class*="social-"]',
    
    // Comments (can be distracting)
    '.comments', '#comments',
    '[class*="comment-section"]',
    
    // Other distractions
    '.newsletter', '.subscribe',
    '[aria-hidden="true"]',
    'script', 'style', 'noscript'
  ];

  let removedCount = 0;
  clutterSelectors.forEach(selector => {
    try {
      document.querySelectorAll(selector).forEach(element => {
        // Don't remove if it's inside main content
        const main = findMainContent();
        if (main && main.contains(element) && element.tagName === 'NAV') {
          return; // Keep navigation if it's part of main content
        }
        element.remove();
        removedCount++;
      });
    } catch (e) {
      console.warn('Error removing element:', selector, e);
    }
  });

  console.log(`Removed ${removedCount} clutter elements`);
}

/**
 * Collapse long paragraphs with "read more" buttons
 */
function collapseLongParagraphs(container) {
  const paragraphs = (container || document).querySelectorAll('p');
  
  paragraphs.forEach(p => {
    const text = p.innerText || '';
    
    // Only collapse paragraphs longer than 300 characters
    if (text.length < 300) return;
    
    // Skip if already processed
    if (p.dataset.collapsed) return;
    p.dataset.collapsed = 'true';
    
    const preview = text.slice(0, 200);
    const fullText = text;
    
    // Create collapsed view
    const wrapper = document.createElement('div');
    wrapper.className = 'cog-assist-paragraph';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'cog-assist-text';
    textSpan.textContent = preview + '...';
    
    const button = document.createElement('button');
    button.className = 'cog-assist-expand-btn';
    button.textContent = 'Read more';
    button.setAttribute('aria-expanded', 'false');
    
    let expanded = false;
    button.addEventListener('click', () => {
      expanded = !expanded;
      textSpan.textContent = expanded ? fullText : preview + '...';
      button.textContent = expanded ? 'Show less' : 'Read more';
      button.setAttribute('aria-expanded', expanded.toString());
    });
    
    wrapper.appendChild(textSpan);
    wrapper.appendChild(button);
    
    p.parentNode.replaceChild(wrapper, p);
  });
}

/**
 * Highlight key sentences within paragraphs
 */
function highlightKeySentences(keySentences) {
  if (!keySentences || keySentences.length === 0) return;
  
  const paragraphs = document.querySelectorAll('p, .cog-assist-text');
  
  paragraphs.forEach(p => {
    let html = p.innerHTML;
    
    keySentences.forEach(sentence => {
      if (sentence.length < 10) return; // Skip very short sentences
      
      const escapedSentence = sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSentence, 'gi');
      
      html = html.replace(regex, match => {
        return `<mark class="cog-assist-highlight">${match}</mark>`;
      });
    });
    
    p.innerHTML = html;
  });
}

/**
 * Simple vocabulary replacement (basic fallback)
 */
function simplifyVocabulary(element) {
  const complexToSimple = {
    'utilize': 'use',
    'approximately': 'about',
    'subsequent': 'next',
    'commence': 'start',
    'terminate': 'end',
    'endeavor': 'try',
    'possess': 'have',
    'purchase': 'buy',
    'numerous': 'many',
    'sufficient': 'enough',
    'additional': 'more',
    'require': 'need',
    'demonstrate': 'show',
    'indicate': 'show',
    'participate': 'join',
    'implement': 'do',
    'facilitate': 'help'
  };
  
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  
  textNodes.forEach(node => {
    let text = node.textContent;
    
    Object.entries(complexToSimple).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      text = text.replace(regex, simple);
    });
    
    node.textContent = text;
  });
}

/**
 * Extract main content paragraphs for analysis
 * Returns array of paragraph elements
 */
function extractMainContent() {
  const mainContainer = findMainContent();
  if (!mainContainer) return [];
  
  // Get all paragraphs from main content
  const paragraphs = Array.from(mainContainer.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6'));
  
  // Filter out empty or very short elements
  return paragraphs.filter(p => {
    const text = p.textContent.trim();
    return text.length > 20; // At least 20 characters
  });
}

// Export to global scope for content script
window.CogAssist_DOM = {
  findMainContent,
  removeClutter,
  collapseLongParagraphs,
  highlightKeySentences,
  simplifyVocabulary,
  extractMainContent
};
