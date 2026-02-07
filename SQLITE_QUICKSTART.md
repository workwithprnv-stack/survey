# ⚡ SQLite Backend - Quick Start

## What Changed?

- ❌ No more JSON files (`all_responses.json`)
- ✅ Now using SQLite database (`survey_responses.db`)
- ✅ No more Railway/cloud deployment needed
- ✅ Runs locally on your machine

---

## 3-Step Setup

### 1️⃣ Install Dependencies (1 min)

```bash
cd c:\Users\prana\Documents\2026\ddd\survey
npm install
```

### 2️⃣ Start Server (instantly)

```bash
npm start
```

**You should see:**
```
✅ SQLite database initialized: ...survey_responses.db
🚀 Server running on port 3000
```

### 3️⃣ Test It (2 min)

- Open browser: `http://localhost:3000`
- Fill survey form
- Click "Submit"
- View responses: `http://localhost:3000/responses.html`
- ✅ Done!

---

## Key Points

| Question | Answer |
|----------|--------|
| Where is data stored? | `survey_responses.db` (SQLite database) |
| Where does server run? | Your computer (localhost:3000) |
| Is cloud needed? | No! |
| Can I stop the server? | Yes - press Ctrl+C |
| Will I lose data if I restart? | No - it's saved in the database |

---

## Troubleshooting

**Problem:** `npm install` fails
```bash
# Solution: Make sure you're in the survey folder
cd c:\Users\prana\Documents\2026\ddd\survey
npm install
```

**Problem:** "Port 3000 already in use"
```bash
# Solution: Kill the existing process
taskkill /F /IM node.exe
# Then: npm start
```

**Problem:** "Cannot link to responses.html"
- Make sure you visit: `http://localhost:3000/responses.html`
- NOT `http://localhost:3000/survey/responses.html`

---

## That's It! 🎉

Your survey system is now running locally with SQLite.

**Next?** 
- Fill out survey forms
- Check responses page
- Read SQLITE_SETUP.md for more details

---

## One Note About Deployment

⚠️ **Current setup:** Backend is local only
- ✅ Works: `http://localhost:3000` (on your computer)
- ❌ Doesn't work: GitHub Pages remote frontend

If you need the frontend on GitHub Pages to connect to the backend, you'd need to either:
1. Deploy backend to cloud (Railway, Render, etc.) 
2. Or keep everything local

For now, **local-only is perfect for testing and assignment submission**.

