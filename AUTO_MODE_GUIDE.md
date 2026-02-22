# 🚀 Automatic Mode Guide

## What's New: Fully Automatic Extension

The extension now runs **automatically** when you load any webpage. No button clicks required!

---

## ⚡ Automatic Features

### 1. **Auto-Detect Complexity & Tone** ✅ (Enabled by default)
- Analyzes the reading level of the page
- Detects emotional tone (urgent, strict, friendly, etc.)
- Shows a visual indicator for urgent/strict content
- Marks complex sections with orange border

### 2. **Auto-Simplify Pages** ✅ (Enabled by default)
- Automatically simplifies text when pages load
- Converts complex words to simple alternatives
- Breaks down long paragraphs
- No manual clicks needed!

### 3. **Auto-Focus Mode** ❌ (Disabled by default)
- Can automatically enable focus mode on complex pages
- Enable in Settings if you want this feature
- Progressive reveal as you scroll

### 4. **Auto-Read Aloud** ❌ (Disabled by default)
- Can automatically start reading content
- ⚠️ **Use with caution** - may be disruptive
- Enable only if you always want TTS

---

## 🎛️ Settings Page

### New Controls:

1. Open extension settings (right-click extension icon → Options)

2. Scroll to "**⚡ Automatic Features**" section

3. Toggle these options:
   - ✅ **Auto-Simplify Pages** - Simplifies text automatically
   - ✅ **Auto-Detect Complexity** - Analyzes reading level and tone  
   - ☐ **Auto-Focus Mode** - Enables focus mode automatically
   - ☐ **Auto-Read Aloud** - Starts TTS automatically (careful!)

4. Click "💾 Save Settings"

---

## 📋 How It Works

### When You Load a Webpage:

**Step 1** (1.5 seconds after page loads):
```
✅ Auto-detect complexity and tone
   └─ Calculates reading level
   └─ Detects emotional tone
   └─ Shows tone indicator (if urgent/strict)
   └─ Marks complex sections
```

**Step 2** (if Auto-Simplify enabled):
```
✅ Auto-simplify page content
   └─ Sends text to Google Gemini API
   └─ Replaces original text with simplified version
   └─ Adds bullet points and summaries
```

**Step 3** (if Auto-Focus Mode enabled):
```
⚡ Enable focus mode
   └─ Dims the rest of the page
   └─ Highlights first paragraph
   └─ Progressive reveal as you scroll
```

**Step 4** (if Auto-TTS enabled):
```
🔊 Start reading aloud
   └─ Reads simplified content
   └─ Shows word highlighting indicator
   └─ Pauses between paragraphs
```

---

## ⌨️ Keyboard Shortcuts

Even in automatic mode, you can still control features manually:

| Shortcut | Action |
|----------|--------|
| **Ctrl+Shift+S** | Manually simplify current page |
| **Ctrl+Shift+F** | Toggle focus mode on/off |
| **Ctrl+Shift+R** | Start/resume reading aloud |
| **Ctrl+Shift+X** | **STOP ALL FEATURES** |

**Pro Tip:** Press **Ctrl+Shift+X** to immediately disable all automatic features on the current page.

---

## 🧪 Test It Out

### Recommended Test Pages:

1. **Wikipedia Article** (Complex content)
   - https://en.wikipedia.org/wiki/Quantum_mechanics
   - Should auto-detect high complexity
   - Should auto-simplify technical terms

2. **News Article** (Varied tone)
   - Try CNN, BBC, or NYTimes
   - Should detect tone (urgent/neutral/friendly)

3. **Government Forms** (High complexity + strict tone)
   - IRS, FAFSA, DMV sites
   - Should show "strict" tone indicator
   - Should mark complex sections

4. **Blog Post** (Friendly tone)
   - Medium, Dev.to articles
   - Should detect friendly tone

---

## 🔍 Visual Indicators

### Tone Indicator (Top Right Corner)
```
┌─────────────────────────────┐
│ ⚠️ This page has urgent     │
│    content                   │
└─────────────────────────────┘
```
- **Red gradient**: Urgent/strict content
- **Blue gradient**: Informational content
- Auto-disappears after 5 seconds

### Complex Section Markers
```
│ This paragraph has very complex
│ vocabulary and long sentences that
│ may be difficult to understand.
```
- **Orange left border**: High reading level
- **3px thick**: Very complex section

### Toast Notifications
```
┌─────────────────────┐
│ 📖 Simplifying      │
│    page...          │
└─────────────────────┘
```
- Appears when you use keyboard shortcuts
- Auto-dismisses after 2.5 seconds

---

## ⚠️ Troubleshooting

### "Failed to do anything" Error

**Problem:** Extension shows errors when clicking features

**Solutions:**

1. **Check API Key**
   - Open Settings (right-click icon → Options)
   - Verify API key is entered: `AIzaSyDFZnJa6vilujizpEAWJSUyqK8fAb3eWes`
   - Click "Save Settings"

2. **Reload Extension**
   - Go to `chrome://extensions/`
   - Find "Cognitive Accessibility Assistant"
   - Click the reload icon (↻)
   - Refresh your test webpage

3. **Check Console for Errors**
   - Press F12 to open DevTools
   - Click "Console" tab
   - Look for red error messages
   - Share errors if issue persists

4. **Verify Permissions**
   - Extension needs: `storage`, `activeTab`, `scripting`
   - All should be granted automatically

### Auto-Features Not Running

**Problem:** Page loads but nothing happens automatically

**Check:**

1. ✅ API key is configured in Settings
2. ✅ "Auto-Simplify" is checked in Settings
3. ✅ You're on a text-heavy page (not blank page)
4. ✅ Extension is enabled (not in incognito without permission)

**Wait Time:**
- Features start **1.5 seconds** after page loads
- Give it a moment to initialize

### Features Running Too Aggressively

**Problem:** Every page gets simplified, even when you don't want it

**Solution:**

1. Disable "Auto-Simplify" in Settings
2. Use keyboard shortcuts instead: **Ctrl+Shift+S**
3. Or use the floating button to trigger manually

### TTS Starts Unexpectedly

**Problem:** Pages start reading aloud automatically

**Solution:**

1. Open Settings
2. Uncheck "Auto-Read Aloud"
3. Use **Ctrl+Shift+R** to start TTS manually when needed

---

## 🎯 Recommended Settings

### For Most Users (Default):
```
✅ Auto-Simplify Pages
✅ Auto-Detect Complexity
☐ Auto-Focus Mode
☐ Auto-Read Aloud
```

### For Advanced Users:
```
☐ Auto-Simplify Pages (manual control)
✅ Auto-Detect Complexity (always helpful)
☐ Auto-Focus Mode
☐ Auto-Read Aloud
```
Use keyboard shortcuts for full control.

### For Maximum Accessibility:
```
✅ Auto-Simplify Pages
✅ Auto-Detect Complexity
✅ Auto-Focus Mode
✅ Auto-Read Aloud
```
Everything runs automatically!

---

## 📊 Performance Impact

### Initial Page Load:
- **+1.5s delay** before auto-features start
- **+2-5s** for API simplification (first time)
- **Minimal impact** on browsing speed

### Resource Usage:
- **Low CPU usage** - runs once per page
- **API calls** - only when simplifying (rate limited)
- **Storage** - < 1 MB for settings

---

## 🔐 Privacy & Security

### Data Handling:
- ✅ API key stored **locally** only
- ✅ No tracking or analytics
- ✅ No data sent to third parties
- ⚠️ Page content sent to Google Gemini API for simplification

### Permissions:
- `storage` - Save your settings
- `activeTab` - Access current page content
- `scripting` - Inject simplification UI

---

## 🎓 Next Steps

1. **Load the extension** in Chrome
2. **Configure settings** (enable/disable auto-features)
3. **Visit a complex webpage** (Wikipedia, government site)
4. **Watch it work automatically!**
5. **Use Ctrl+Shift+X** if you need to stop features

---

**Need help?** Check the browser console (F12 → Console) for debugging information.

**Want manual control?** Disable auto-features and use keyboard shortcuts or the floating button.

**All set?** Enjoy automatic cognitive accessibility on every page! 🎉
