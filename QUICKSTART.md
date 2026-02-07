# 🚀 Quick Deployment Checklist

## BEFORE YOU START
- [ ] You have a GitHub account (already signed up)
- [ ] Code is committed and pushed: `git push origin main`
- [ ] You're logged out of any old Railway accounts

---

## STEP 1: Create Railway Account (2 min)

```
1. Go to: https://railway.app
2. Click "Start Free"
3. Click "Continue with GitHub"
4. Approve GitHub access
5. ✅ Done - you're logged in
```

---

## STEP 2: Deploy Backend (2 min)

```
1. In Railway Dashboard: Click "+ New Project"
2. Select "Deploy from GitHub"
3. Search for: DESG318_surveyDesign
4. Click "Connect"
5. Click "Deploy"
6. Wait for ✅ "Deployment complete" (2 min)
7. Copy your Railway URL (top right corner)
   Example: https://desg318-surveydesign-production.up.railway.app
```

---

## STEP 3: Update Frontend Config (1 min)

**Edit: index.html**
- Find line with: `window.SURVEY_SERVER_BASE = '';`
- Replace with your Railway URL:
  ```javascript
  window.SURVEY_SERVER_BASE = 'https://your-railway-url-here';
  ```

**Edit: responses.html** 
- Same change around line 189

**Then push:**
```bash
git add index.html responses.html
git commit -m "Configure backend URL"
git push origin main
```

---

## STEP 4: Test (5 min)

**Visit Frontend:**
```
https://workwithprnv-stack.github.io/survey/index.html
```

1. Fill survey form
2. Click "Complete & Submit"
3. Check browser console (F12):
   - Should show: ✅ Survey submitted to server

**Visit Responses Page:**
```
https://workwithprnv-stack.github.io/survey/responses.html
```

1. Should show your response
2. Shows sessionId, timestamp, answers
3. Auto-refreshes every 5 seconds

---

## ✅ Done!

Your survey is now live and collecting responses!

**Frontend:** https://workwithprnv-stack.github.io/survey/index.html  
**Responses:** https://workwithprnv-stack.github.io/survey/responses.html  
**Backend:** (Running on Railway)

---

## 🆘 If Something Goes Wrong

1. **Backend not deployed?**
   - Check Railway dashboard for errors
   - Click "Logs" to see error messages

2. **Responses not saving?**
   - Check server.js is running on Railway
   - Check browser console for fetch errors
   - Verify railway URL in index.html

3. **CORS errors?**
   - Hard refresh browser (Ctrl+Shift+R)
   - Wait 2 minutes for Pages to redeploy
   - Clear browser cache

4. **Still broken?**
   - Check the DEPLOYMENT.md file for detailed troubleshooting
   - Railway support: https://railway.app/support

---

**Time to Deploy:** 5 minutes  
**Time to Test:** 5 minutes  
**Total:** 10 minutes 🎉

