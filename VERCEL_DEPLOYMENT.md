# Vercel Deployment Guide

This document provides step-by-step instructions for deploying the Rockfall Prediction System frontend to Vercel.

## Prerequisites

- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub repository with the project code
- Node.js 18+ installed locally

## Deployment Steps

### 1. Connect GitHub Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository: `1Rajveer-Singh/SIH2025`
4. Vercel will automatically detect it's a React project

### 2. Configure Project Settings

**Framework Preset:** React
**Root Directory:** Leave as `.` (root)
**Build Command:** `cd frontend && npm run build`
**Output Directory:** `frontend/build`
**Install Command:** `cd frontend && npm install`

### 3. Environment Variables (Optional)

In Vercel dashboard, add these environment variables:

```
REACT_APP_API_URL=https://your-backend-api-url.com
REACT_APP_WEBSOCKET_URL=wss://your-backend-api-url.com
GENERATE_SOURCEMAP=false
```

### 4. Deploy

Click "Deploy" - Vercel will:
- Install dependencies
- Build the React app
- Deploy to a live URL

## Configuration Files

The project includes these Vercel-specific files:

- `vercel.json` - Vercel deployment configuration
- `.vercelignore` - Files to exclude from deployment
- `frontend/.env.production` - Production environment variables
- `frontend/.env.development` - Development environment variables

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `frontend/package.json`
- Verify build works locally: `cd frontend && npm run build`

### Routing Issues
- The `vercel.json` includes rewrites for React Router
- All routes will redirect to `index.html` for client-side routing

### API Connection
- Update `REACT_APP_API_URL` environment variable
- Ensure backend is deployed and accessible
- Check CORS settings on backend

## Local Testing

Test the production build locally:

```bash
cd frontend
npm run build
npx serve -s build
```

## Automatic Deployments

Once connected, Vercel will automatically deploy:
- **Production:** On pushes to `main` branch
- **Preview:** On pull requests

Your live site will be available at a URL like:
`https://your-project-name.vercel.app`

## Performance Optimization

The build is optimized with:
- Code splitting
- Tree shaking
- Source maps disabled in production
- Gzip compression
- Static asset optimization

## Support

For issues:
1. Check Vercel deployment logs
2. Verify local build works
3. Check environment variables
4. Review browser console for errors