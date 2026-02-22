# ✅ Extension Testing Checklist

## Pre-Flight Check

### 1. Icons Created ✅
- [x] icon16.png (1.1 KB)
- [x] icon48.png (2.7 KB)  
- [x] icon128.png (2.5 KB)

### 2. API Key Configured ✅
- [x] Background script: `AIzaSyDFZnJa6vilujizpEAWJSUyqK8fAb3eWes`
- [x] Options page: Pre-filled with API key
- [x] Default settings: Auto-simplify enabled

### 3. Automatic Features Added ✅
- [x] Auto-detect complexity function
- [x] Auto-simplify on page load
- [x] Settings UI for toggling auto-features
- [x] Tone indicator visual component
- [x] Complex section markers

---

## 🚀 Load the Extension

1. Open Chrome: `chrome://extensions/`
2. Toggle "Developer mode" ON
3. Click "Load unpacked"
4. Select: `/Users/Jayanth/Desktop/simplyify`
5. Look for: "Cognitive Accessibility Assistant" ✅

**Expected:** Extension loads without errors

---

## 🧪 Test: Automatic Mode

### Test 1: Auto-Detect Complexity

**Page to Visit:** https://en.wikipedia.org/wiki/Quantum_mechanics

**Expected Behavior:**
1. Page loads normally
2. After 1.5 seconds, extension auto-runs
3. Console shows: "Auto-detecting page complexity and tone..."
4. Reading metrics calculated
5. Tone indicator may appear (top-right)

**Check:**
- [ ] Extension initializes without errors
- [ ] Complexity detection runs automatically
- [ ] Console logs show metrics

### Test 2: Auto-Simplify Text

**Page to Visit:** https://www.irs.gov/ (or any complex government site)

**Expected Behavior:**
1. Page loads
2. Extension detects main content
3. Sends text to Google Gemini API
4. Replaces original text with simplified version
5. Page shows simplified content

**Check:**
- [ ] API call succeeds (check Network tab)
- [ ] Text is replaced automatically
- [ ] No "failed" errors

**If It Fails:**
- Open DevTools (F12) → Console
- Look for errors like "No API key" or "API call failed"
- Verify API key is correct in Settings

### Test 3: Tone Detection

**Page to Visit:** News site with urgent headlines

**Expected Behavior:**
1. Extension analyzes tone
2. If urgent/strict detected:
   - Visual indicator appears (top-right)
   - Red or blue gradient background
   - Shows tone label
3. Auto-disappears after 5 seconds

**Check:**
- [ ] Tone is detected
- [ ] Visual indicator appears
- [ ] Auto-dismisses after 5s

---

## ⌨️ Test: Keyboard Shortcuts

### Test 4: Manual Simplify (Ctrl+Shift+S)

**Steps:**
1. Visit any webpage
2. Press **Ctrl+Shift+S**
3. Watch for toast notification
4. Page should simplify

**Check:**
- [ ] Toast shows: "📖 Simplifying page..."
- [ ] Simplification starts
- [ ] No errors

### Test 5: Focus Mode (Ctrl+Shift+F)

**Steps:**
1. Visit article page
2. Press **Ctrl+Shift+F**
3. Focus mode should activate

**Expected:**
- [ ] Page dims
- [ ] First paragraph highlighted
- [ ] Navigation controls appear
- [ ] Toast shows: "🎯 Focus mode enabled"

### Test 6: Read Aloud (Ctrl+Shift+R)

**Steps:**
1. Visit any text page
2. Press **Ctrl+Shift+R**
3. TTS should start

**Expected:**
- [ ] Voice begins reading
- [ ] Reading indicator appears (bottom)
- [ ] Shows current word
- [ ] Toast shows: "🔊 Reading aloud..."

### Test 7: Stop All (Ctrl+Shift+X)

**Steps:**
1. Activate some features (focus mode, TTS)
2. Press **Ctrl+Shift+X**
3. All features should stop

**Expected:**
- [ ] TTS stops immediately
- [ ] Focus mode exits
- [ ] Toast shows: "⏹️ All features stopped"

---

## ⚙️ Test: Settings Page

### Test 8: Open Settings

**Steps:**
1. Right-click extension icon
2. Click "Options"
3. Settings page opens

**Check:**
- [ ] Page loads with no errors
- [ ] All settings visible
- [ ] API key field pre-filled
- [ ] Automatic features section visible

### Test 9: Toggle Auto-Features

**Steps:**
1. In Settings, uncheck "Auto-Simplify Pages"
2. Click "💾 Save Settings"
3. Visit a new page
4. Page should NOT auto-simplify

**Expected:**
- [ ] Settings save successfully
- [ ] Button shows "✓ Saved!"
- [ ] New pages don't auto-simplify
- [ ] Manual shortcuts still work

**Then:**
1. Re-enable "Auto-Simplify Pages"
2. Save again
3. New pages should auto-simplify again

---

## 🐛 Troubleshooting Tests

### Test 10: Check Console Errors

**Steps:**
1. Visit any page
2. Press F12 → Console
3. Look for errors

**Good Signs:**
```
✅ Cognitive Assistant: Initializing...
✅ Cognitive Assistant: Ready
✅ Auto-detecting page complexity and tone...
✅ Page metrics: {readingLevel: 12, ...}
```

**Bad Signs:**
```
❌ Error: No API key configured
❌ Failed to simplify: API call failed
❌ TypeError: Cannot read property...
```

### Test 11: Network Tab (API Calls)

**Steps:**
1. F12 → Network tab
2. Reload page (with auto-simplify enabled)
3. Look for Gemini API call

**Check:**
- [ ] Request to `generativelanguage.googleapis.com`
- [ ] Status: 200 OK (success)
- [ ] Response contains simplified text

**If 401 Unauthorized:**
- API key is wrong or expired
- Get new key from Google AI Studio

**If 429 Too Many Requests:**
- API rate limit exceeded
- Wait a few minutes

---

## 📊 Expected Results Summary

### ✅ Working Extension Checklist

- [ ] Loads without manifest errors
- [ ] Icons display correctly
- [ ] Auto-detect runs on page load
- [ ] Auto-simplify works (if enabled)
- [ ] Keyboard shortcuts respond
- [ ] Toast notifications appear
- [ ] Settings page saves correctly
- [ ] No console errors
- [ ] API calls succeed (200 status)

### ⚠️ Known Issues (Acceptable)

- Some pages may not have "main content" to simplify
- Very simple pages may not trigger complexity detection
- API may take 2-5 seconds to respond (normal)
- First API call may be slower (cold start)

### ❌ Critical Issues (Must Fix)

If you see any of these, report immediately:

- Extension won't load (manifest error)
- "Failed to do anything" on every click
- API calls always fail (401, 403, 500)
- JavaScript errors in console
- Settings won't save
- Keyboard shortcuts don't work

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________

Extension Version: 1.0.0
Chrome Version: ___________

=== RESULTS ===

✅ Extension loaded successfully: [YES / NO]
✅ Icons display: [YES / NO]
✅ Auto-detect works: [YES / NO]
✅ Auto-simplify works: [YES / NO]
✅ Keyboard shortcuts work: [YES / NO]
✅ Settings save correctly: [YES / NO]
✅ API calls succeed: [YES / NO]

=== ERRORS FOUND ===

(List any errors from console)

=== NOTES ===

(Additional observations)
```

---

## 🎯 Success Criteria

**Minimum Viable:**
- Extension loads without errors
- Manual features work (keyboard shortcuts)
- Settings can be changed

**Fully Functional:**
- All above, PLUS:
- Auto-detect runs on page load
- Auto-simplify works when enabled
- API calls succeed
- Visual indicators appear

**Production Ready:**
- All above, PLUS:
- No console errors
- Smooth animations
- Fast performance (<3s delay)
- Works on 90%+ of websites

---

## 🚢 Ready to Test!

1. Load extension in Chrome
2. Visit test pages
3. Check each item on this list
4. Report any issues

**Good luck!** 🎉
