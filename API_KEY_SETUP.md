# 🔑 API Key Setup Instructions

Your Google Gemini API key is ready to use!

## Your API Key
```
AIzaSyDFZnJa6vilujizpEAWJSUyqK8fAb3eWes
```

## How to Configure

### Method 1: Via Extension Settings (Recommended)
1. Load the extension in Chrome
2. Click the extension icon in your toolbar
3. Click "⚙️ Settings" at the bottom of the popup
4. Scroll to "🤖 AI Integration" section
5. Paste your API key in the "API Key" field
6. Click "💾 Save Settings"

### Method 2: Test First Without API Key
The extension works without an API key using fallback simplification:
- Basic vocabulary replacement
- Automatic sentence extraction
- Bullet-point generation

But you'll see a notice: "Using basic simplification. Add an API key for AI-powered features."

## What the API Key Enables

With the API key configured, you get:

### 1. **Smart Text Simplification**
- AI understands context and meaning
- Adjusts to your selected reading level (5th, 8th, or 12th grade)
- Preserves important information
- Creates meaningful summaries

### 2. **Tone Detection**
- Analyzes emotional content
- Detects: urgent, neutral, friendly, strict, sarcastic
- Shows confidence score
- Provides explanation

### Without API Key
- Basic word replacement (utilize → use)
- First sentences as key points
- Generic bullet points
- No tone detection

## Security

✅ **Your API key is secure:**
- Stored locally in Chrome's sync storage
- Never exposed to web pages
- Only used for API calls through the background service worker
- Not sent to any third parties
- You can remove it anytime in settings

## API Usage & Limits

### Google Gemini Free Tier
- **60 requests per minute**
- **1,500 requests per day**
- Sufficient for personal use

### Monitoring Usage
- Visit: https://makersuite.google.com/app/apikey
- View your API key dashboard
- Check usage statistics

## Testing the Integration

1. **Install the extension**
   ```
   chrome://extensions/ → Load unpacked → Select simplyify folder
   ```

2. **Configure API key** (as shown above)

3. **Test on a webpage**
   - Visit any news article or blog post
   - Click the extension icon
   - Click "📖 Simplify Text"
   - Wait a few seconds for AI processing
   - You should see a simplified version with tone indicator

4. **Verify it's working**
   - Look for "Simplified version" header
   - Check for "Tone:" badge (should not say "neutral" always)
   - No yellow notice about "basic simplification"

## Troubleshooting

### "No API key configured" error
- Go to Settings and save the key again
- Refresh the page you're testing on
- Try clicking Simplify again

### "API error: 403" or "API error: 400"
- Your API key might be invalid
- Check you copied the full key correctly
- Verify it's active at https://makersuite.google.com

### Still using fallback mode
- Make sure you clicked "Save Settings"
- Check the browser console (F12) for errors
- Try reloading the extension

### API quota exceeded
- You've hit the daily limit (1,500 requests)
- Wait until tomorrow, or
- Create a new API key

## Alternative: Use Your Own Key

If you prefer to use your own API key:

1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the generated key
4. Paste it in the extension settings
5. Save

## Custom API Endpoints

Advanced users can change the endpoint:

**Default:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

To use a different model or provider:
1. Go to Settings
2. Enter custom endpoint in "API Endpoint (Advanced)"
3. Save

**Note:** The code expects Google Gemini's response format. Other providers will need code modifications.

## Privacy Note

The extension sends text content to Google Gemini API for processing when you click "Simplify Text". This includes:
- Page content you choose to simplify
- Your reading level preference

**Not sent:**
- Your browsing history
- Personal information
- Data from other tabs

You can review exactly what's sent in `src/background.js` (functions `simplifyText` and `detectTone`).

---

**Your extension is ready to provide AI-powered accessibility features!** 🚀

Install it and enjoy smarter text simplification and tone detection.
