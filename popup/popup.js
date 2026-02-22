// Popup Script
// Handles UI interactions and sends messages to content script

document.addEventListener('DOMContentLoaded', async () => {
  // Get elements
  const simplifyBtn = document.getElementById('simplify-btn');
  const focusBtn = document.getElementById('focus-btn');
  const readBtn = document.getElementById('read-btn');
  const formBtn = document.getElementById('form-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const readingLevel = document.getElementById('reading-level');
  const ttsSpeed = document.getElementById('tts-speed');
  const speedValue = document.getElementById('speed-value');
  const status = document.getElementById('status');

  // Load saved settings
  await loadSettings();

  // Update speed display
  ttsSpeed.addEventListener('input', () => {
    speedValue.textContent = parseFloat(ttsSpeed.value).toFixed(1) + 'x';
  });

  // Save settings when changed
  readingLevel.addEventListener('change', saveSettings);
  ttsSpeed.addEventListener('change', saveSettings);

  // Simplify Page
  simplifyBtn.addEventListener('click', async () => {
    setButtonLoading(simplifyBtn, true);
    
    try {
      const result = await sendMessageToActiveTab({
        type: 'SIMPLIFY_PAGE',
        options: {
          readingLevel: readingLevel.value
        }
      });
      
      if (result.success) {
        if (result.result.restored) {
          showStatus('Original page restored', 'success');
        } else {
          showStatus(
            result.result.usedFallback 
              ? '✓ Simplified (basic mode - add API key for AI features)' 
              : '✓ Page simplified successfully',
            'success'
          );
        }
      } else {
        showStatus('Error: ' + result.error, 'error');
      }
    } catch (error) {
      showStatus('Failed to simplify page', 'error');
    } finally {
      setButtonLoading(simplifyBtn, false);
    }
  });

  // Focus Mode
  let focusModeActive = false;
  focusBtn.addEventListener('click', async () => {
    focusModeActive = !focusModeActive;
    
    try {
      await sendMessageToActiveTab({
        type: 'TOGGLE_FOCUS_MODE',
        enable: focusModeActive
      });
      
      focusBtn.classList.toggle('primary', focusModeActive);
      showStatus(
        focusModeActive ? 'Focus mode enabled' : 'Focus mode disabled',
        'info'
      );
    } catch (error) {
      showStatus('Failed to toggle focus mode', 'error');
      focusModeActive = !focusModeActive;
    }
  });

  // Read Aloud
  let isReading = false;
  readBtn.addEventListener('click', async () => {
    if (isReading) {
      // Stop reading
      try {
        await sendMessageToActiveTab({ type: 'STOP_READING' });
        readBtn.querySelector('.icon').textContent = '🔊';
        readBtn.querySelector('.label').textContent = 'Read Aloud';
        isReading = false;
        showStatus('Stopped reading', 'info');
      } catch (error) {
        showStatus('Failed to stop', 'error');
      }
    } else {
      // Start reading
      try {
        await sendMessageToActiveTab({
          type: 'READ_ALOUD',
          options: {
            rate: parseFloat(ttsSpeed.value)
          }
        });
        readBtn.querySelector('.icon').textContent = '⏸️';
        readBtn.querySelector('.label').textContent = 'Stop';
        isReading = true;
        showStatus('Reading aloud...', 'info');
      } catch (error) {
        showStatus('Failed to read', 'error');
      }
    }
  });

  // Form Mode
  formBtn.addEventListener('click', async () => {
    setButtonLoading(formBtn, true);
    
    try {
      const result = await sendMessageToActiveTab({ type: 'FORM_MODE' });
      
      if (result.success) {
        showStatus('Form guidance enabled', 'success');
      } else {
        showStatus('Error: ' + result.error, 'error');
      }
    } catch (error) {
      showStatus('Failed to enable form mode', 'error');
    } finally {
      setButtonLoading(formBtn, false);
    }
  });

  // Settings
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Helper Functions
  async function loadSettings() {
    return new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, response => {
        if (response && response.settings) {
          readingLevel.value = response.settings.readingLevel || '8';
          ttsSpeed.value = response.settings.ttsRate || 1.0;
          speedValue.textContent = parseFloat(ttsSpeed.value).toFixed(1) + 'x';
        }
        resolve();
      });
    });
  }

  async function saveSettings() {
    const settings = {
      readingLevel: readingLevel.value,
      ttsRate: parseFloat(ttsSpeed.value)
    };
    
    // Get existing settings first
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, response => {
      const existingSettings = response.settings || {};
      const mergedSettings = { ...existingSettings, ...settings };
      
      chrome.runtime.sendMessage({
        type: 'SET_SETTINGS',
        settings: mergedSettings
      });
    });
  }

  function sendMessageToActiveTab(message) {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs[0]) {
          reject(new Error('No active tab'));
          return;
        }
        
        chrome.tabs.sendMessage(tabs[0].id, message, response => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(response);
        });
      });
    });
  }

  function showStatus(message, type = 'info') {
    status.textContent = message;
    status.className = `status ${type}`;
    
    setTimeout(() => {
      status.classList.add('hidden');
    }, 3000);
  }

  function setButtonLoading(button, loading) {
    if (loading) {
      button.disabled = true;
      button.style.opacity = '0.6';
      button.style.cursor = 'wait';
    } else {
      button.disabled = false;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  }
});
