# Cognitive Accessibility Assistant

**A thoughtful, non-intrusive accessibility layer for the modern web.**

---

## The Problem

Millions of people with dyslexia, ADHD, cognitive processing differences, or language barriers struggle with dense online content. Traditional reading aids are either too aggressive (breaking page layouts), too manual (requiring constant clicking), or too simplistic (just changing fonts).

**Cognitive accessibility shouldn't require disrupting the reading experience.**

---

## What It Does

Cognitive Accessibility Assistant analyzes web pages in real-time and provides intelligent support without blocking or replacing content:

### Core Features

**Automatic Complexity Detection**  
Analyzes paragraphs for sentence length, vocabulary complexity, and reading level. Only enhances content that genuinely needs simplification.

**Smart Text Simplification**  
Uses AI to rewrite complex sections at an adjustable reading level (1st-12th grade). Simplified versions appear on hover—preserving the original text for those who want it.

**Elegant Summary Panel**  
A 320px right-side panel with glassmorphism styling provides:
- AI-generated page summary (5-7 key points)
- Tone detection (urgent, friendly, formal, etc.)
- Complexity statistics
- Quick action controls

**Focus Mode**  
Soft background dimming with purple ring highlighting to reduce visual overwhelm. Progressive focus that adapts to your reading position.

**Text-to-Speech Integration**  
Natural voice reading with live sentence highlighting. Adjustable speed and voice selection.

**Privacy-First Architecture**  
All processing happens client-side or through secure background workers. No tracking, no analytics, no external servers beyond the AI API.

---

## Design Philosophy

This extension follows a **calm technology** approach:

- **Non-intrusive** – No massive popups or modal overlays
- **Contextual** – Enhancements appear only when needed
- **Reversible** – Original content is always preserved
- **Minimal** – Clean glassmorphism aesthetic with soft shadows and blur effects
- **Accessible** – Built with WCAG principles in mind

The interface uses a modern glassmorphism design language: translucent panels, backdrop filters, smooth animations, and neutral color palettes that adapt to light/dark mode.

---

## How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Content Script (content.js)                    │
│  • DOM analysis & complexity detection          │
│  • Sidebar panel injection                      │
│  • Focus mode & TTS coordination                │
└─────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│  Utility Layer                                  │
│  • domHelpers.js - Content extraction           │
│  • nlpClient.js - API routing                   │
│  • ttsEngine.js - Speech synthesis              │
└─────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│  Background Service Worker (background.js)      │
│  • Secure API key management                    │
│  • Settings persistence (Chrome Storage)        │
│  • Message routing between contexts             │
└─────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│  Google Gemini 2.5 Flash API                    │
│  • Text simplification                          │
│  • Tone detection                               │
│  • Summary generation                           │
└─────────────────────────────────────────────────┘
```

### Complexity Detection Algorithm

Text blocks are analyzed using:
- **Flesch-Kincaid Grade Level** – Reading difficulty estimation
- **Average Sentence Length** – Flags sentences >20 words
- **Complex Word Ratio** – Identifies 3+ syllable words
- **Threshold Logic** – Only marks truly complex paragraphs

### AI Processing Pipeline

1. Page loads → Content script waits 1.5s for full render
2. Extract main content using semantic selectors
3. Analyze paragraphs for complexity metrics
4. Send full-page text to Gemini API for summary
5. Selectively simplify complex paragraphs (max 15 to prevent API overload)
6. Display results in sidebar panel
7. Add hover tooltips to simplified paragraphs

---

## Performance & Safety

**API Rate Limiting**  
- Maximum 15 paragraph simplifications per page
- 300ms throttle between API calls
- Automatic fallback if API fails

**Graceful Degradation**  
- Extension works without AI API (shows basic stats)
- Fallback summaries use heuristic extraction
- No page freezing or layout breaks

**Error Handling**  
- Extension context validation before API calls
- Automatic retry with exponential backoff
- User-friendly error notifications

**Resource Efficiency**  
- Lazy-loaded components
- Debounced scroll handlers
- Minimal DOM manipulation

---

## Privacy Statement

**Zero Tracking. Zero Analytics. Zero Data Collection.**

- API key stored locally in Chrome's secure storage
- No user behavior logging
- No external servers (except Gemini API for text processing)
- Text sent to Gemini API is not stored by this extension
- All settings remain on-device

**Note:** Google Gemini API has its own data policies. Review them at: https://ai.google.dev/gemini-api/terms

---

## Configuration Options

Access settings through the extension popup or right-click the extension icon:

| Setting | Description | Default |
|---------|-------------|---------|
| **Reading Level** | Target simplification grade (1-12) | 8th grade |
| **Auto-Simplify** | Automatically enhance pages on load | Enabled |
| **Auto-Focus Mode** | Enable focus highlighting on load | Disabled |
| **Auto-TTS** | Start text-to-speech automatically | Disabled |
| **TTS Rate** | Speech speed (0.5x - 2.0x) | 1.0x |
| **TTS Voice** | Preferred voice (system-dependent) | System default |
| **Panel Visibility** | Show/hide sidebar panel | Visible |

---

## Keyboard Shortcuts

- `Ctrl+Shift+F` – Toggle Focus Mode
- `Ctrl+Shift+R` – Start/Stop Reading
- `Ctrl+Shift+H` – Toggle Panel Visibility

*(Shortcuts can be customized in `chrome://extensions/shortcuts`)*

---

## Roadmap

### Planned Features
- **Multi-language support** – Simplify non-English content
- **Custom dictionaries** – Add domain-specific terms
- **Reading history** – Track comprehension metrics
- **Annotation layer** – Highlight and save key passages
- **Collaborative modes** – Share simplified versions
- **Browser sync** – Settings across devices

### Technical Improvements
- Offline mode with cached simplifications
- WebAssembly complexity analysis (faster processing)
- Progressive Web App companion for mobile
- Custom AI model fine-tuned for accessibility

### Accessibility Enhancements
- Screen reader optimizations
- High contrast mode
- Reduced motion alternatives
- Customizable color schemes

---

## Technical Stack

**Extension Framework**  
Chrome Manifest V3 (modern extension architecture)

**Frontend**  
- Vanilla JavaScript (no framework dependencies)
- CSS3 with backdrop-filter for glassmorphism
- Web Speech API for TTS

**AI/NLP**  
Google Gemini 2.5 Flash via REST API

**Storage**  
Chrome Storage API (sync across signed-in devices)

**Build Tools**  
None required – pure client-side execution

---

## Vision

**Cognitive accessibility should be a default, not an afterthought.**

The web is humanity's shared knowledge base, but dense academic language, complex terminology, and walls of text create unnecessary barriers. This extension is a step toward a more inclusive internet—one where information adapts to the reader, not the other way around.

**Our goal:** Make every webpage as readable as it needs to be, for everyone, without compromise.

---

## Contributing

This project welcomes contributions focused on:
- Performance optimization
- New accessibility features
- UI/UX refinements
- Bug fixes and error handling
- Documentation improvements

Please open an issue before starting major work.

---

## License

MIT License – See [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built with accessibility-first design principles inspired by:
- Web Content Accessibility Guidelines (WCAG 2.1)
- Calm technology philosophy (Mark Weiser)
- Dyslexia-friendly design research
- ADHD cognitive load reduction studies

---

**TO RUN**
1) Download file, then go to extensions and load as upacked. You will need to Provide an API Key

