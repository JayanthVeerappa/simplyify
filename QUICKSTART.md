# Quick Start Guide

## Installation Steps

1. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/` in your browser
   - Enable "Developer mode" (toggle in top-right corner)

2. **Load the Extension**
   - Click "Load unpacked"
   - Select this folder: `/Users/Jayanth/Desktop/simplyify`
   - The extension will appear in your toolbar

3. **Configure API Key (Recommended)**
   - Click the extension icon
   - Click "Settings" at the bottom
   - Add your Google Gemini API key:
     - Visit: https://makersuite.google.com/app/apikey
     - Create a new API key
     - Paste it in the settings
   - Click "Save Settings"

## Usage

### From the Popup
- **Simplify Text**: Converts the current page to an easy-to-read format
- **Focus Mode**: Highlights one section at a time with navigation
- **Read Aloud**: Uses text-to-speech to read the page
- **Form Mode**: Breaks complex forms into simple steps

### Keyboard Shortcuts ⌨️
Use these shortcuts for hands-free access:
- **Ctrl+Shift+S** - Simplify current page
- **Ctrl+Shift+F** - Toggle Focus Mode
- **Ctrl+Shift+R** - Read Aloud
- **Ctrl+Shift+X** - Stop all active features

### Floating Button
- A brain emoji (🧠) appears in the bottom-right of pages
- Click it to quickly toggle Focus Mode

## Features Breakdown

### 1. Page Simplification
- Automatically detects and removes ads, sidebars, and clutter
- Simplifies complex vocabulary
- Creates bullet-point summaries
- Highlights key sentences
- Shows tone/emotion indicator (urgent, friendly, etc.)

### 2. Focus Mode
- Dims the rest of the page
- Shows one paragraph/section at a time
- Progressive reveal: navigate with Previous/Next buttons
- Exit anytime with the Exit button

### 3. Text-to-Speech
- Reads content aloud with adjustable speed
- Highlights words as they're spoken (experimental)
- Works on simplified or original text

### 4. Form Guidance
- Detects multi-step forms
- Breaks them into manageable steps
- Shows inline help for each field
- Highlights required fields
- Validates input before moving to next step

### 5. Tone Detection
- AI analyzes text for emotional tone
- Shows badge: urgent, neutral, friendly, strict, or sarcastic
- Helps understand the intent of emails, instructions, etc.

## Settings

Access via popup → "Settings" button

- **Reading Level**: Choose simplification target (5th, 8th, or 12th grade)
- **Speech Speed**: Adjust TTS rate (0.5x to 2.0x)
- **Voice**: Select preferred text-to-speech voice
- **Floating Button**: Toggle the quick-access button
- **API Key**: Your Google Gemini key for AI features

## Without API Key

The extension still works without an API key using fallback simplification:
- Basic vocabulary replacement
- Sentence extraction
- Automatic bullet points
- But AI-powered simplification and tone detection won't be available

## Icons

The extension currently uses text placeholders for icons. To add proper icons:

1. Create PNG files in three sizes: 16x16, 48x48, and 128x128
2. Save them in the `icons/` folder as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
3. Reload the extension

You can use any brain/accessibility icon or create one at https://www.canva.com/

## Troubleshooting

**Extension doesn't appear:**
- Make sure Developer mode is enabled
- Try reloading the extension
- Check the Chrome console for errors

**Features not working:**
- Refresh the page after installing
- Check that the content script has permission (should work on all URLs)
- Some sites (like chrome:// pages) block extensions

**API features fail:**
- Verify your API key is correct
- Check you have API quota remaining
- The extension falls back to basic mode if API fails

**TTS doesn't work:**
- Some browsers/systems don't support Web Speech API
- Try selecting a different voice in settings
- Make sure your volume is on

## File Structure

```
simplyify/
├── manifest.json              # Extension config
├── README.md                  # Documentation
├── QUICKSTART.md             # This file
├── src/
│   ├── background.js         # Service worker
│   ├── content.js            # Main content script
│   ├── styles.css            # Injected styles
│   └── utils/
│       ├── domHelpers.js     # DOM utilities
│       ├── nlpClient.js      # API client
│       └── ttsEngine.js      # TTS engine
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── options/
│   ├── options.html
│   ├── options.css
│   └── options.js
└── icons/
    └── README.txt            # Icon placeholder note
```

## Privacy & Security

- API key is stored locally in Chrome's sync storage
- Only transmitted to Google Gemini API (if configured)
- No data is collected or sent to third parties
- All processing happens locally or via your API key
- Open source - review the code yourself

## Support

For issues, questions, or contributions:
- Review the code in each file (heavily commented)
- Check Chrome's extension console for errors
- Modify settings in the options page

## Next Steps

1. Install the extension
2. Try it on a news article or blog post
3. Configure your API key for full features
4. Adjust settings to your preferences
5. Use the floating button for quick access

Enjoy easier web browsing! 🧠✨
