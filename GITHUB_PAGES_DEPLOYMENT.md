# GitHub Pages Deployment Guide

## 🚀 Deploy Your Rent-A-Car DApp to GitHub Pages

This guide will help you deploy your app to GitHub Pages for free hosting.

---

## Prerequisites

- GitHub account with this repository
- Repository pushed to GitHub
- Smart contract deployed to Stellar testnet

---

## Step 1: Configure GitHub Repository Settings

1. Go to your GitHub repository: `https://github.com/harystyleseze/rent-a-car-dapp`
2. Click on **Settings** (top right)
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - **Source**: GitHub Actions
5. Save the settings

---

## Step 2: Update Base URL in vite.config.ts

✅ **Already configured!** The base URL is set to `/rent-a-car-dapp/`

If your repository name is different, update line 9 in `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

---

## Step 3: Deploy Using GitHub Actions

### Automatic Deployment (Recommended)

✅ **Already set up!** Push to `main` or `dev` branch to auto-deploy:

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin dev
```

The workflow will:

1. Install dependencies
2. Build contract clients
3. Build the React app
4. Deploy to GitHub Pages

### Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Watch the deployment progress
3. Once complete, your app will be live at:
   ```
   https://harystyleseze.github.io/rent-a-car-dapp/
   ```

---

## Step 4: Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Build and deploy
npm run deploy
```

---

## Important Notes

### ⚠️ Smart Contract Configuration

Your app uses environment variables for the contract ID. Make sure:

1. **Contract is deployed to testnet**
2. **Contract ID is embedded in the generated client** (`packages/rent_a_car/src/index.ts`)

The app will automatically use the embedded contract ID from the generated client.

### 🔐 Wallet Support

GitHub Pages supports:

- ✅ Freighter wallet
- ✅ xBull wallet
- ✅ Albedo wallet

All wallet integrations work on static hosting.

### 🌐 CORS & API Calls

- ✅ Stellar RPC endpoints support CORS
- ✅ Wallet extensions work on any domain
- ✅ No backend needed - fully decentralized!

---

## Troubleshooting

### Issue: 404 on page refresh

**Solution**: GitHub Pages doesn't support SPA routing by default. Add a `404.html`:

```bash
cp dist/index.html dist/404.html
```

Or use hash-based routing by updating `App.tsx`:

```typescript
import { HashRouter } from "react-router-dom";
// Use HashRouter instead of BrowserRouter
```

### Issue: Blank page after deployment

**Check**:

1. Base URL matches your repository name in `vite.config.ts`
2. Build completed successfully (check Actions tab)
3. Pages is enabled in repository settings
4. Browser console for errors

### Issue: Contract calls failing

**Check**:

1. Contract ID is correct in generated client
2. Network is set to TESTNET in `environments.toml`
3. Wallet is connected to Stellar testnet
4. Wallet has testnet XLM (use friendbot)

---

## Testing Locally Before Deployment

Build and preview the production version:

```bash
# Build for production
npm run build:gh-pages

# Preview the build
npm run preview
```

Visit `http://localhost:4173` to test the production build locally.

---

## Post-Deployment Checklist

✅ App loads at GitHub Pages URL
✅ Routing works (all pages accessible)
✅ Wallet connection works
✅ Contract interactions work
✅ Sign in with role selection works
✅ Car listing, renting, and returning work
✅ Admin functions work (commission, payouts)

---

## Custom Domain (Optional)

Want a custom domain like `rentacar.yourdomain.com`?

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. Add DNS records:
   ```
   Type: CNAME
   Name: rentacar (or www)
   Value: harystyleseze.github.io
   ```
3. In GitHub Settings > Pages > Custom domain, enter your domain
4. Enable "Enforce HTTPS"

---

## Updating Your Deployed App

Just push to the branch:

```bash
git add .
git commit -m "Update app"
git push origin dev
```

GitHub Actions will automatically rebuild and redeploy! 🎉

---

## Cost

**FREE!** 🎉

- GitHub Pages: Free
- Stellar testnet: Free
- Smart contract deployment: Free on testnet
- Bandwidth: 100GB/month (soft limit)

---

## Your Live DApp

Once deployed, share your DApp:

```
🌐 https://harystyleseze.github.io/rent-a-car-dapp/
```

Built with ❤️ on Stellar blockchain
