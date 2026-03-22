# Deployment Instructions for AI Chat

## Problem
GitHub Pages only hosts static files and can't make API calls to OpenRouter due to CORS restrictions.

## Solution
Deploy the API proxy to Vercel (free tier) to handle OpenRouter API calls.

## Steps:

### 1. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

### 2. Add Environment Variable

In Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add:
   - Name: `OPENROUTER_API_KEY`
   - Value: `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`
3. Click "Save"

### 3. Update script.js

After deployment, Vercel will give you a URL like: `https://your-project.vercel.app`

Update line 305 in `script.js`:
```javascript
const API_ENDPOINT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/api/chat'
    : 'https://YOUR-VERCEL-URL.vercel.app/api/chat';  // Replace with your actual Vercel URL
```

### 4. Push Changes

```bash
git add .
git commit -m "Add Vercel API proxy for chat"
git push
```

### 5. Redeploy

Vercel will automatically redeploy when you push to GitHub.

## Alternative: Use Netlify

If you prefer Netlify:

1. Create `netlify/functions/chat.js` instead of `api/chat.js`
2. Deploy to Netlify
3. Update API_ENDPOINT to `https://your-site.netlify.app/.netlify/functions/chat`

## Security Note

Your API key is currently exposed in the code. After setting up Vercel:
1. Remove the API key from `script.js`
2. It will only exist as an environment variable in Vercel
3. The proxy will handle authentication securely
