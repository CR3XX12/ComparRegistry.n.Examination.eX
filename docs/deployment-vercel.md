# Vercel Deployment

Use Vercel as the shared testing environment so non-developers can try the app from one browser URL.

## Recommended Setup

1. Go to https://vercel.com/new.
2. Import the GitHub repository.
3. Keep the production branch set to `main`.
4. Use the detected framework preset: `Next.js`.
5. Use these build settings:
   - Root directory: `.`
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: leave as the Vercel default for Next.js
6. Click Deploy.

After setup, every merge or push to `main` creates the shared testing deployment. Send Reya the production URL from the Vercel project dashboard.

## Local Pre-Deploy Check

Before merging to `main`, run:

```txt
npm.cmd run build
```

## Notes

- The app uses committed sample data from `src/data/generated/impi-sample.json`, so no production environment variables are required right now.
- Branch and pull-request deployments may still be created by Vercel, but the URL to share for routine testing should be the production deployment from `main`.
- If the project later uses private data, turn on deployment protection or use a private staging environment before sharing links.
