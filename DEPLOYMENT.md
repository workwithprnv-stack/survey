# 🚀 Complete Deployment Guide

## Current Status: READY FOR DEPLOYMENT

- ✅ Frontend code: Complete and tested
- ✅ Backend code: Complete and tested locally  
- ✅ GitHub repository: Code pushed
- ❌ Backend deployed: **THIS IS WHAT YOU NEED TO DO NEXT**
- ⏳ Frontend configured with backend URL: Pending after deployment

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  User Browser at GitHub Pages                           │
│  https://workwithprnv-stack.github.io/survey/           │
│                                                          │
│  Loads: index.html → script.js → POST /submit            │
│         responses.html → fetch /api/responses            │
└──────────────────────────┬──────────────────────────────┘
                           │
                    (INTERNET / HTTP)
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Backend Server (deployed on Railway)                    │
│  https://desg318-surveydesign-production.up.railway.app │
│                                                          │
│  POST /submit                                            │
│  → Receives form data                                   │
│  → Validates (rejects neutral-only)                      │
│  → Saves to all_responses.json                           │
│  → Returns success response                              │
│                                                          │
│  GET /api/responses                                     │
│  → Returns all_responses.json                            │
│  → With CORS headers (allows cross-origin)               │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start (5 minutes)

### 1️⃣ Create Railway Account (2 min)
- Go to https://railway.app
- Click "Sign up"
- Choose "Continue with GitHub"
- Authorize GitHub access
- ✅ Account created

### 2️⃣ Deploy Backend (2 min)
- In Railway dashboard: **+ New Project**
- Select **Deploy from GitHub**
- Choose repository: `workwithprnv-stack / DESG318_surveyDesign`
- Railway auto-detects Node.js ✓
- Click **Deploy**
- Wait for ✅ "Deployment successful"
- Copy your Railway URL (looks like): `https://desg318-surveydesign-production.up.railway.app`

### 3️⃣ Configure Frontend (1 min)
Replace the `window.SURVEY_SERVER_BASE = '';` line in both **index.html** and **responses.html** with:

```javascript
window.SURVEY_SERVER_BASE = 'https://YOUR-RAILWAY-URL';
```

Example:
```javascript
window.SURVEY_SERVER_BASE = 'https://desg318-surveydesign-production.up.railway.app';
```

Commit and push:
```bash
git add index.html responses.html
git commit -m "Configure backend URL for production"
git push origin main
```

GitHub Actions will auto-deploy to Pages (1-2 min).

### 4️⃣ Test It! (0 min)
1. Visit: https://workwithprnv-stack.github.io/survey/index.html
2. Fill out survey
3. Click "Submit"
4. View responses at: https://workwithprnv-stack.github.io/survey/responses.html
5. 🎉 See your response appear!

---

## 📋 Step-by-Step Walkthrough

### Step 1: Ensure Code is Pushed to GitHub

```bash
cd c:\Users\prana\Documents\2026\ddd\survey

# Check if there are unpushed changes
git status

# If there are changes, commit and push
git add .
git commit -m "Deployment ready: added Procfile and server URL config"
git push origin main
```

**Expected output:**
```
Everything up-to-date
```
or
```
[main xxxxxxx] Deployment ready...
 X files changed, X insertions...
```

---

### Step 2: Create Railway Account

**If you don't have a Railway account:**

1. Open https://railway.app
2. Click **"Start Free"**
3. Click **"Continue with GitHub"**
4. You'll see GitHub OAuth approval screen
5. Click **"Authorize Railway"**
6. GitHub redirects back to Railway
7. ✅ You're logged in

**If you already have Railway:**
- Just log in at https://railway.app

---

### Step 3: Deploy Backend to Railway

1. **Access Railway Dashboard:**
   - Go to https://railway.app/dashboard
   - You should see a welcome screen

2. **Create New Project:**
   - Click **"+ New Project"** (top right)
   - Select **"Deploy from GitHub"**

3. **Connect GitHub Repository:**
   - Railway will ask which repository
   - Search for: `DESG318_surveyDesign`
   - Click on it to select
   - Click **"Connect"**

4. **Configure Deployment:**
   - Railway auto-detects `package.json`
   - Detects Node.js ✓
   - Detects `Procfile` ✓
   - **Just click "Deploy"**

5. **Wait for Deployment:**
   - You'll see a deployment log:
   ```
   Building dependencies...
   npm install... ✓
   npm start (from Procfile) ✓
   Server running on port 3000
   ```
   - Wait until you see: ✅ "Deployment complete"
   - Takes about 1-2 minutes

6. **Get Your Railway URL:**
   - In the Railway dashboard, find your project
   - Look for a URL that appears (top right corner)
   - Example: `https://desg318-surveydesign-production.up.railway.app`
   - **Copy this URL**

---

### Step 4: Update Frontend Configuration

Now that your backend is deployed, tell the frontend where to find it.

**Edit index.html:**

Find this section (around line 70):
```javascript
<script>
  window.SURVEY_SERVER_BASE = '';
</script>
```

Replace the empty string with your Railway URL:
```javascript
<script>
  window.SURVEY_SERVER_BASE = 'https://YOUR-RAILWAY-URL-HERE';
</script>
```

**Example:**
```javascript
<script>
  window.SURVEY_SERVER_BASE = 'https://desg318-surveydesign-production.up.railway.app';
</script>
```

**Do the same for responses.html** (line ~189)

**Commit and push to GitHub:**
```bash
git add index.html responses.html
git commit -m "Set production backend URL"
git push origin main
```

**GitHub Actions will automatically:**
- Detect the push
- Build the site
- Deploy to GitHub Pages (1-2 minutes)

---

### Step 5: Verify It Works

**Test the Frontend:**

1. Open: https://workwithprnv-stack.github.io/survey/index.html
2. Fill out the survey form
3. Answer at least one question (not just "Neutral" for all)
4. Click **"Complete & Submit"**
5. You should see: `✅ Survey submitted to server` in browser console
6. **No visible confirmation page** (by design)

**Check the Responses Page:**

1. Go to: https://workwithprnv-stack.github.io/survey/responses.html
2. You should see your response appear on this page
3. It will show:
   - Your sessionId (first 6 characters)
   - Timestamp
   - All your answers

**Test with Multiple Users:**

- Have different users fill the form from different browsers/devices
- Each will get a unique sessionId
- All responses appear on responses.html
- The server stores them in `all_responses.json`

---

## 🔍 How Data Flows

### When User Submits Survey:

```
1. User fills form (browser)
   ↓
2. Clicks "Complete & Submit"
   ↓
3. JavaScript collects: sessionId, timestamp, all responses
   ↓
4. POST request sent to: /submit
   ↓
5. Backend (Railway) receives request
   ↓
6. Validates: checks no all-Neutral responses
   ✓ Valid → saves to all_responses.json
   ✗ Invalid → returns error
   ↓
7. Browser shows success message
   ↓
8. Form is cleared, user can retake it (new sessionId)
```

### When User Views Responses:

```
1. User visits responses.html
   ↓
2. Page loads, JavaScript runs
   ↓
3. Fetches: GET /api/responses
   ↓
4. Backend sends: all_responses.json
   ↓
5. JavaScript displays all submissions
   ↓
6. Every 5 seconds: auto-refresh to get latest responses
```

---

## 📁 File Reference

| File | Purpose | Deployed To |
|------|---------|-------------|
| `script.js` | Form logic + session management | GitHub Pages + Railway |
| `index.html` | Survey form | GitHub Pages |
| `responses.html` | Response viewer | GitHub Pages |
| `style.css` | Styling | GitHub Pages |
| `server.js` | Backend endpoints | Railway |
| `package.json` | Node.js config | Railway |
| `Procfile` | Startup command | Railway |
| `.gitignore` | Excludes data files | Both |
| `all_responses.json` | Data storage | Railway (server only) |

---

## 🐛 Troubleshooting

### Problem: "Cannot POST /submit"

**Cause:** Backend URL not configured or not deployed  
**Solution:**
1. Check that `window.SURVEY_SERVER_BASE` is set in index.html
2. Verify Railway deployment is complete and running
3. Check Railway URL is correct

**Test:**
```bash
# Visit your Railway URL directly
https://your-railway-url.up.railway.app/

# You should see "Survey Backend Server" or index page
```

### Problem: "No responses showing on responses.html"

**Cause:** Backend not returning data OR responses not saved  
**Solution:**
1. Open browser console (F12)
2. Submit a survey
3. Check console for errors
4. Go to responses.html
5. Open console, check `/api/responses` fetch errors

**Debug:**
```bash
# Visit this endpoint directly (replace with your URL)
https://your-railway-url.up.railway.app/api/responses

# Should show JSON:
# {"responses": [...], "lastUpdated": "2026-..."}
```

### Problem: "CORS error" in browser console

**Example error:**
```
Access to XMLHttpRequest at 'https://...' from origin 'https://workwithprnv-stack.github.io' 
has been blocked by CORS policy
```

**Solution:**  
Server already has CORS enabled (`Access-Control-Allow-Origin: *`). This shouldn't happen.  
If it does:
1. Clear browser cache (Ctrl+Shift+Del)
2. Hard refresh (Ctrl+Shift+R)
3. Wait 2-3 minutes for Pages to redeploy

### Problem: "Neutral-only response rejected"

**Why:** The backend rejects surveys where ALL answers are "Neutral"  
**Solution:** Answer at least one question with a different option  
**Reason:** Quality control - ensures meaningful responses

---

## 🔐 Security Notes

- ✅ Frontend on GitHub Pages (public)
- ✅ Backend on Railway (private, only accepts valid POSTs)
- ✅ All responses stored in `all_responses.json` (only on server, not in git)
- ✅ No sensitive data in responses (no emails, ids, etc.)
- ✅ Public can view responses (by design for this assignment)
- ⚠️ Not recommended for real user data without auth

---

## 📊 Monitoring & Analytics

### Check Recent Deployments:
**Railway Dashboard:**
- Go to your Railway project
- Click "Deployments" tab
- See all deployments and their status

**GitHub Actions:**
- Go to GitHub repo
- Click "Actions" tab
- See all Pages deployments

### View Server Logs:
**Railway:**
- Click your project
- Click "Logs" tab
- Real-time server console output

---

## 🎓 Assignment Notes

- **Each student:** Audits one domain (listed in index.html)
- **Each submission:** Gets unique sessionId
- **Response storage:** Server-side in `all_responses.json`
- **Data visibility:** All responses shown on responses.html (no privacy restrictions for assignment)
- **Multiple attempts:** Each page visit = new sessionId, so users can retake

---

## 📞 Common Commands

### Check server status locally:
```bash
node server.js
# Server on http://localhost:3000
# Press Ctrl+C to stop
```

### Reset response data:
```bash
# On your machine, in survey/ folder:
# Edit all_responses.json, set to:
# {"responses": [], "lastUpdated": "..."}
# Then git add, commit, push
```

### See all git commits:
```bash
git log --oneline
```

### Update backend on Railway:
```bash
# Just push to GitHub
git push origin main
# Railway auto-rebuilds and redeploys
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub (`git push origin main`)
- [ ] Railway account created
- [ ] Backend deployed on Railway
- [ ] Railway URL copied
- [ ] `index.html` updated with Railway URL
- [ ] `responses.html` updated with Railway URL
- [ ] Frontend changes pushed (`git push`)
- [ ] GitHub Pages deployed (auto, 1-2min)
- [ ] Test survey form submission
- [ ] Test responses page display
- [ ] Multiple test submissions verified
- [ ] Documented Railway URL (for future reference)

---

## 🎉 You're Done!

When all checks pass:
- Frontend: ✅ Deployed to GitHub Pages
- Backend: ✅ Deployed to Railway
- Integration: ✅ Forms submit to server
- Responses: ✅ All responses stored and displayed

Your survey is ready for student submissions!

