# Cognitive Accessibility Assistant

A comprehensive Chrome extension designed to support users with dyslexia, ADHD, autism, and cognitive processing difficulties.

## ✨ Features

### 🎯 **Automatic Mode** (NEW!)
The extension now runs automatically on every webpage:
- ✅ **Auto-detect complexity & tone** - Analyzes reading level and emotional tone  
- ✅ **Auto-simplify text** - Converts complex content to simple language (default: ON)
- ⚡ **Auto-focus mode** - Progressive reveal (default: OFF, enable in Settings)
- 🔊 **Auto-read aloud** - TTS on page load (default: OFF, enable in Settings)

**No button clicks required!** Configure in Settings which features run automatically.

### 📚 Core Features
✨ **Page Simplification** - AI-powered text simplification using Google Gemini  
🎯 **Focus Mode** - Progressive reveal system that highlights one section at a time  
🔊 **Text-to-Speech** - Read aloud with word highlighting and adjustable speed  
📝 **Form Guidance** - Step-by-step form assistance with inline explanations  
😊 **Tone Detection** - Detects urgent, strict, friendly, sarcastic, or neutral tone  
⌨️ **Keyboard Shortcuts** - Quick access to all features without touching the mouse

## Keyboard Shortcuts

- **Ctrl+Shift+S** - Simplify current page
- **Ctrl+Shift+F** - Toggle Focus Mode
- **Ctrl+Shift+R** - Read Aloud
- **Ctrl+Shift+X** - Stop all features  

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select this directory: `/Users/Jayanth/Desktop/simplyify`
5. Reload the extension if you already had it loaded

## Configuration

1. Click the extension icon in your browser toolbar
2. Click "Settings" at the bottom of the popup
3. Configure your preferences:
   - Reading level (5th, 8th, or 12th grade)
   - Text-to-Speech speed
   - API key for NLP features (optional but recommended)

## Usage

### Quick Actions (from popup)
- **Simplify Text** - Converts current page to simplified, easy-to-read format
- **Focus Mode** - Enables progressive reveal for focused reading
- **Read Aloud** - Activates text-to-speech with word highlighting
- **Form Mode** - Breaks complex forms into manageable steps

### Keyboard Shortcuts
- Press the floating assistant button (bottom-right) for quick access to focus mode

## API Integration

For advanced features (text simplification and tone detection), you can integrate with AI services:

1. Get an API key from your preferred provider (OpenAI, Anthropic, Google AI, etc.)
2. Add it in Settings → API Key field
3. The extension will use it for intelligent text processing

**Security Note**: API calls are routed through the background service worker to keep your key secure.

## File Structure

```
simplyify/
├── manifest.json          # Extension configuration
├── src/
│   ├── background.js      # Service worker (settings, API proxy)
│   ├── content.js         # Main content script
│   ├── styles.css         # Injected styles
│   └── utils/
│       ├── domHelpers.js  # DOM manipulation utilities
│       ├── nlpClient.js   # NLP API client
│       └── ttsEngine.js   # Text-to-speech engine
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
└── options/
    ├── options.html       # Settings page
    ├── options.css        # Settings styles
    └── options.js         # Settings logic
```

## Development

This extension uses vanilla JavaScript (no build step required) for maximum compatibility and ease of modification.

## License

MIT License - Feel free to modify and distribute
