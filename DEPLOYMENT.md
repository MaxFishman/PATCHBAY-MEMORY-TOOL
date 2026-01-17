# Deployment Guide

## Backend Deployment (Render - Free Tier)

1. **Create a Render account** at https://render.com

2. **Create a new Web Service:**
   - Connect your GitHub repository
   - Select "PATCHBAY-MEMORY-TOOL"
   - Use these settings:
     - **Name:** patchbay-memory-tool-api
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm run server`
     - **Plan:** Free

3. **Your backend will be deployed at:** `https://patchbay-memory-tool-api.onrender.com`

## Frontend Deployment (GitHub Pages)

1. **Install gh-pages package:**
   ```bash
   cd client
   npm install
   ```

2. **Create `.env.production` file in the client folder:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```
   Replace with your actual Render backend URL from step 3 above.

3. **Deploy to GitHub Pages:**
   ```bash
   cd client
   npm run deploy
   ```

4. **Enable GitHub Pages:**
   - Go to your repository settings on GitHub
   - Navigate to Pages section
   - Source should be set to "gh-pages" branch
   - Your site will be live at: `https://maxfishman.github.io/PATCHBAY-MEMORY-TOOL`

## Quick Deploy Commands

```bash
# From the client directory:
npm run deploy
```

## Environment Variables

### Client (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### Server (Set in Render Dashboard)
```
NODE_ENV=production
PORT=5000
```

## Important Notes

- **First load may be slow:** Render free tier spins down after inactivity (takes ~30 seconds to wake up)
- **Database:** SQLite file persists on Render's file system
- **CORS:** Already configured to accept requests from your GitHub Pages domain

## Troubleshooting

If you get CORS errors:
1. Verify your backend URL in `.env.production`
2. Check that CORS is configured correctly in `server/index.js`
3. Ensure you rebuilt the frontend after updating `.env.production`

## Alternative Free Backend Options

If Render doesn't work for you:
- **Railway** (https://railway.app) - 500 hours/month free
- **Fly.io** (https://fly.io) - Free tier available
- **Cyclic** (https://cyclic.sh) - Serverless, free tier
