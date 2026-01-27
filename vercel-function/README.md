# Standalone Vercel Function

This is a **standalone serverless function** that you can deploy to Vercel without deploying your entire site.

## Quick Setup (5 minutes)

### Step 1: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
cd vercel-function
npm i -g vercel
vercel
# Follow the prompts
```

**Option B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Click "Add New Project"
4. Import this folder (or create a new project and upload just `api/create-issue.js`)
5. Deploy

### Step 2: Add Environment Variables

In Vercel dashboard → Your project → Settings → Environment Variables:

- `GITHUB_TOKEN` = your fine-grained token
- `GITHUB_OWNER` = `dilsilva`
- `GITHUB_REPO` = `rodrigoeric-tattoostudio`

### Step 3: Get Your Function URL

After deployment, Vercel will give you a URL like:
```
https://your-project.vercel.app/api/create-issue
```

### Step 4: Update Your HTML

In your `index.html`, update line 285:

```javascript
const API_ENDPOINT = 'https://your-project.vercel.app/api/create-issue';
```

Replace `your-project` with your actual Vercel project name.

### Step 5: Test!

Your site stays on GitHub Pages (or wherever), but the function runs on Vercel!

## Benefits

✅ **No need to deploy entire site** - just the function  
✅ **Free tier** - unlimited requests  
✅ **Fast** - global CDN  
✅ **Easy** - simple deployment  
✅ **Independent** - update function without touching your site  

## Cost

**Free forever** for your usage level (contact forms use minimal resources)
