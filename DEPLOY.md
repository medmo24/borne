# 🚀 Deploy EV Charging Backend to Railway

This guide will help you deploy your backend to Railway's free tier so your V2C charging stations can connect from anywhere.

## Prerequisites

- [ ] GitHub account ([sign up here](https://github.com/signup))
- [ ] Railway account ([sign up here](https://railway.app) - use GitHub to sign in)
- [ ] Git installed on your computer

## Step 1: Initialize Git Repository

If you haven't already, initialize git in your project:

```powershell
cd "C:\Users\admin\Downloads\TEST APP"
git init
git add .
git commit -m "Initial commit - EV Charging Backend"
```

## Step 2: Push to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it `ev-charging-backend` (or any name you prefer)
   - **Do NOT** initialize with README
   - Click "Create repository"

2. Push your code:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/ev-charging-backend.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Railway

### Create New Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your `ev-charging-backend` repository
5. Click **"Deploy Now"**

### Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically create a `DATABASE_URL` environment variable and link it to your service

### Configure Backend Service

1. Click on your backend service (the one from GitHub)
2. Go to **"Settings"** tab
3. Under **"Environment"**, verify these variables exist:
   - `DATABASE_URL` (automatically added when you added PostgreSQL)
   - `PORT` - should be set to `3001` or Railway's default
   
4. Add this variable manually:
   - Click **"New Variable"**
   - Name: `JWT_SECRET`
   - Value: Generate a random string (e.g., `openssl rand -base64 32` or use any random string)

5. Under **"Deploy"** section:
   - Root Directory: `backend`
   - Build Command: (leave default or use) `npm install && npm run build && npx prisma generate`
   - Start Command: `npm run start:prod`

### Run Database Migrations

1. In your Railway project dashboard, click on your backend service
2. Go to **"Settings"** → **"Service"**
3. Look for **"Deploy Logs"** - wait for the deployment to complete
4. Once deployed, go to **Settings** → **New Variable**:
   - Add a temporary variable to trigger migration:
   - Or use Railway's terminal feature to run:
   ```bash
   npx prisma migrate deploy
   ```

**Alternative:** You can add a one-time deploy command:
- In package.json, temporarily add to start:prod: `"start:prod": "npx prisma migrate deploy && node dist/main"`
- After first successful deploy, remove the migrate command

## Step 4: Get Your Public URL

1. In Railway, click on your backend service
2. Go to **"Settings"** tab
3. Scroll to **"Networking"**
4. Click **"Generate Domain"**
5. Railway will give you a public URL like: `https://your-app-name.up.railway.app`

**Important:** Railway provides HTTPS, but OCPP uses WebSocket. Your OCPP URL will be:

```
ws://your-app-name.up.railway.app/ocpp/MRIAD2025
```

## Step 5: Test Your Deployment

### Test HTTP Endpoint

```powershell
curl https://your-app-name.up.railway.app
```

You should see: `Hello World!` or similar response.

### Test OCPP WebSocket (Optional)

Update your test file to use the Railway URL:

```javascript
// In test-ocpp-connection.js, change:
const wsUrl = `ws://your-app-name.up.railway.app/ocpp/MRIAD2025`;
```

Then run:
```powershell
node backend/test-ocpp-connection.js
```

## Step 6: Configure Your V2C Charger

In your V2C application/configuration, enter this OCPP URL:

```
ws://your-app-name.up.railway.app/ocpp/MRIAD2025
```

**Make sure:**
- Use `ws://` (not `wss://` or `http://`)
- The Charge Point ID (`MRIAD2025`) matches the station you created in your dashboard
- Your V2C charger has internet connectivity

## Step 7: Verify Connection

1. Open your frontend dashboard: `http://localhost:3000/dashboard/stations`
2. Look for station `MRIAD2025`
3. When your V2C charger connects, the status should change from **OFFLINE** to **ONLINE**

---

## 🎯 Final OCPP URL Format

```
ws://YOUR-RAILWAY-DOMAIN.up.railway.app/ocpp/YOUR-CHARGE-POINT-ID
```

**Examples:**
- For MRIAD2025: `ws://ev-charging-production.up.railway.app/ocpp/MRIAD2025`
- For TEST001: `ws://ev-charging-production.up.railway.app/ocpp/TEST001`

---

## Troubleshooting

### Database Connection Issues
- Check Railway logs for Prisma errors
- Verify `DATABASE_URL` variable exists and is connected to PostgreSQL
- Run migrations manually via Railway CLI or deploy script

### WebSocket Not Connecting
- Verify you're using `ws://` not `wss://` or `http://`
- Check the Charge Point ID matches exactly with your database
- Review Railway logs for connection attempts
- Ensure your V2C charger has outbound internet access

### Deployment Fails
- Check Railway build logs for errors
- Ensure `backend` is set as root directory
- Verify all dependencies are in package.json
- Make sure Node version is compatible (check package.json engines field)

---

## 💰 Railway Free Tier Limits

- $5 credit per month
- Enough for development and small production use
- Monitor usage in Railway dashboard

If you exceed the free tier, you can:
1. Add a credit card for pay-as-you-go
2. Upgrade to a paid plan
3. Switch to another provider (Render also has a free tier)
