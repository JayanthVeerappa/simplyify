# Extension Reload Instructions

The extension code is correct and the API works. Follow these steps exactly:

## Step 1: Remove Old Extension
1. Go to `chrome://extensions/`
2. Find "Cognitive Accessibility Assistant"  
3. Click **REMOVE** (not just disable)
4. Confirm removal

## Step 2: Clear Chrome Cache
1. Press `Cmd+Shift+Delete` (Mac) or `Ctrl+Shift+Delete` (Windows)
2. Select "Cached images and files"
3. Click "Clear data"

## Step 3: Reload Extension
1. Go back to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the folder: `/Users/Jayanth/Desktop/simplyify`

## Step 4: Verify It's Working
1. Visit any webpage (try Wikipedia or a news site)
2. Wait 2-3 seconds
3. You should see a beautiful overlay with simplified text automatically appear

## Step 5: Check Console for Errors
If it still doesn't work:
1. Right-click the extension icon → "Inspect popup"
2. Go to Console tab
3. Tell me what error you see

---

**API Status**: ✅ Working (tested successfully with your API key)
**Model**: gemini-2.5-flash ✅ Available
**Authentication**: Header-based ✅ Correct
**Code**: ✅ No syntax errors
