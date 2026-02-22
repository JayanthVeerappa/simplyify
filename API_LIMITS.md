# Google Gemini API Quotas

## Free Tier Limits (Current Usage)

**Model:** `gemini-2.5-flash`

**Quota:** 20 requests per day per project

## What This Means

- You can simplify approximately **15-20 pages** per day
- The quota resets every 24 hours
- Each page typically uses:
  - 1 request for the page summary
  - 1-15 requests for paragraph simplifications (depending on complexity)

## Error Message

When you hit the limit, you'll see:
```
"error": {
  "code": 429,
  "message": "You exceeded your current quota...",
  "status": "RESOURCE_EXHAUSTED"
}
```

## Solutions

### 1. Wait for Quota Reset
The error message tells you exactly when to retry (e.g., "Please retry in 34s")

### 2. Upgrade to Paid Tier
Visit [Google AI Studio](https://ai.google.dev/pricing) to increase your quota:
- **Pay-as-you-go:** 1500 requests/min, 1M requests/day
- Cost: ~$0.10 per 1M input tokens

### 3. Reduce Usage
In extension settings:
- Disable "Auto Simplify" to manually trigger simplification
- Increase reading level to reduce complex paragraph detection
- Use Focus Mode and Read Aloud (don't require API calls)

## Extension Behavior

The extension now handles quota errors gracefully:
- Stops making additional API calls when quota exceeded
- Shows user-friendly notification
- Preserves non-API features (Focus Mode, TTS)
- Retries automatically after quota resets

## Monitoring Usage

Check your quota usage at: https://ai.dev/rate-limit
