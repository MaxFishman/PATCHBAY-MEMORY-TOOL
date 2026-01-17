# Vercel Deployment Guide

## Quick Start

### Option 1: One-Click Deploy (Easiest)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `MaxFishman/PATCHBAY-MEMORY-TOOL`
4. Click "Deploy"
5. Done! Your app will be live at `https://patchbay-memory-tool.vercel.app`

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow the prompts and your app will be live!
```

## What Gets Deployed

- **Frontend:** React app built and served from Vercel's CDN
- **Backend:** Node.js/Express server also runs on Vercel

## Environment Variables

If you need to set custom environment variables:

1. Go to your Vercel project settings
2. Click "Environment Variables"
3. Add your variables (e.g., `REACT_APP_API_URL`)
4. Redeploy

For Vercel deployment, you typically don't need custom API URLs since everything runs on the same domain.

## Features

✅ **Automatic deployments** - Deploys on every git push to main
✅ **Preview deployments** - Preview PRs before merging
✅ **Serverless functions** - Backend runs as serverless functions
✅ **SQLite database** - Data persists between deployments
✅ **Free tier** - Fully functional on free tier
✅ **Custom domain** - Add your own domain for free

## Performance Notes

- Frontend is served from Vercel's global CDN (very fast)
- Backend cold start ~2-3 seconds (acceptable for a patchbay app)
- After first request, subsequent requests are instant

## Monitoring

View deployment logs and metrics:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project
3. View logs in the "Deployments" tab

## Rollback

To rollback to a previous deployment:
1. Go to "Deployments" tab
2. Click the three dots next to a previous deployment
3. Select "Promote to Production"

## Custom Domain

To use a custom domain:
1. Go to project "Settings"
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed

## Troubleshooting

### "Cannot GET /api/*"
- This means the backend is responding. Check browser console for actual error

### CORS errors
- Already configured in `server/index.js`
- Check that your domain is included in CORS whitelist

### Slow initial load
- Vercel serverless functions have a ~2-3 second cold start
- This only happens after deployment or extended inactivity
- Subsequent requests are instant

## Limits on Free Tier

- **Builds:** Unlimited
- **Deployments:** Unlimited
- **Functions:** Up to 100 concurrent
- **Data transfer:** 100 GB/month
- **Bandwidth:** Unlimited

For 99.9% of patchbay use cases, free tier is more than sufficient!

## Learn More

- [Vercel Docs](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/functions/nodejs)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
