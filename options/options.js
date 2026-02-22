// Options Page Script
// Handles settings persistence and UI updates

const DEFAULT_SETTINGS = {
  readingLevel: '8',
  ttsRate: 1.0,
  ttsVoice: null,
  showFloatingButton: true,
  autoSimplify: true,        // Auto-simplify pages on load
  autoFocusMode: false,       // Auto-enable focus mode
  autoTTS: false,             // Auto-start text-to-speech
  autoDetectComplexity: true, // Auto-detect complexity and tone
  apiKey: 'AIzaSyDFZnJa6vilujizpEAWJSUyqK8fAb3eWes',
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
};

document.addEventListener('DOMContentLoaded', async () => {
  // Get elements
  const readingLevel = document.getElementById('reading-level');
  const showFloating = document.getElementById('show-floating');
  const ttsRate = document.getElementById('tts-rate');
  const rateValue = document.getElementById('rate-value');
  const ttsVoice = document.getElementById('tts-voice');
  const apiKey = document.getElementById('api-key');
  const apiEndpoint = document.getElementById('api-endpoint');
  const autoSimplify = document.getElementById('auto-simplify');
  const autoDetect = document.getElementById('auto-detect');
  const autoFocus = document.getElementById('auto-focus');
  const autoTTS = document.getElementById('auto-tts');
  const saveBtn = document.getElementById('save-btn');
  const resetBtn = document.getElementById('reset-btn');
  const status = document.getElementById('status');

  // Load available voices
  loadVoices();

  // Load saved settings
  await loadSettings();

  // Update rate display
  ttsRate.addEventListener('input', () => {
    rateValue.textContent = parseFloat(ttsRate.value).toFixed(1) + 'x';
  });

  // Save settings
  saveBtn.addEventListener('click', async () => {
    const settings = {
      readingLevel: readingLevel.value,
      ttsRate: parseFloat(ttsRate.value),
      ttsVoice: ttsVoice.value || null,
      showFloatingButton: showFloating.checked,
      autoSimplify: autoSimplify.checked,
      autoDetectComplexity: autoDetect.checked,
      autoFocusMode: autoFocus.checked,
      autoTTS: autoTTS.checked,
      apiKey: apiKey.value.trim(),
      apiEndpoint: apiEndpoint.value.trim() || DEFAULT_SETTINGS.apiEndpoint
    };

    try {
      await chrome.runtime.sendMessage({
        type: 'SET_SETTINGS',
        settings: settings
      });

      showStatus('Settings saved successfully!', 'success');
      
      // Animate button
      saveBtn.textContent = '✓ Saved!';
      setTimeout(() => {
        saveBtn.textContent = '💾 Save Settings';
      }, 2000);
    } catch (error) {
      showStatus('Failed to save settings: ' + error.message, 'error');
    }
  });

  // Reset settings
  resetBtn.addEventListener('click', async () => {
    if (confirm('Reset all settings to defaults?')) {
      try {
        await chrome.runtime.sendMessage({
          type: 'SET_SETTINGS',
          settings: DEFAULT_SETTINGS
        });

        // Reload page to show defaults
        location.reload();
      } catch (error) {
        showStatus('Failed to reset settings', 'error');
      }
    }
  });

  // Functions
  async function loadSettings() {
    return new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, response => {
        if (response && response.settings) {
          const settings = response.settings;
          
          readingLevel.value = settings.readingLevel || DEFAULT_SETTINGS.readingLevel;
          ttsRate.value = settings.ttsRate || DEFAULT_SETTINGS.ttsRate;
          rateValue.textContent = parseFloat(ttsRate.value).toFixed(1) + 'x';
          ttsVoice.value = settings.ttsVoice || '';
          showFloating.checked = settings.showFloatingButton !== false;
          autoSimplify.checked = settings.autoSimplify !== false;
          autoDetect.checked = settings.autoDetectComplexity !== false;
          autoFocus.checked = settings.autoFocusMode === true;
          autoTTS.checked = settings.autoTTS === true;
          apiKey.value = settings.apiKey || '';
          apiEndpoint.value = settings.apiEndpoint || DEFAULT_SETTINGS.apiEndpoint;
        }
        resolve();
      });
    });
  }

  function loadVoices() {
    // Get available voices from the system
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      // Voices might not be loaded yet, try again
      window.speechSynthesis.onvoiceschanged = () => {
        populateVoices();
      };
    } else {
      populateVoices();
    }
  }

  function populateVoices() {
    const voices = window.speechSynthesis.getVoices();
    ttsVoice.innerHTML = '<option value="">Default</option>';
    
    voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      ttsVoice.appendChild(option);
    });
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    
    setTimeout(() => {
      status.classList.add('hidden');
    }, 5000);
  }
});
