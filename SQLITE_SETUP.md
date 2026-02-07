# 📊 SQLite Backend - Setup & Running Guide

## Overview

Your survey system now uses **SQLite** for data storage instead of JSON files. This is more robust and easier to query.

```
Frontend (GitHub Pages)          Backend (Local Node.js)
─────────────────────────        ───────────────────────
• index.html                      • server.js (Node.js)
• responses.html                  • survey_responses.db (SQLite)
• script.js                       • better-sqlite3 module
• style.css                       
                ↑ POST /submit
                ↓ GET /api/responses
```

---

## Quick Start (3 steps)

### Step 1: Install Dependencies

```bash
cd c:\Users\prana\Documents\2026\ddd\survey
npm install
```

This installs `better-sqlite3` (a fast SQLite library for Node.js).

**Expected output:**
```
added 1 package
changed 0 packages
npm audit: 0 vulnerabilities
```

### Step 2: Start the Server

```bash
npm start
# OR
node server.js
```

**Expected output:**
```
✅ SQLite database initialized: ...survey_responses.db
╔════════════════════════════════════════════╗
║   Survey Backend Server (SQLite)           ║
╠════════════════════════════════════════════╣
║ 🚀 Server running on port 3000             ║
║ 📊 Database: survey_responses.db           ║
║ 🌐 API: http://localhost:3000/api/responses │
║ 📝 Submit: POST http://localhost:3000/submit║
╚════════════════════════════════════════════╝
```

### Step 3: Test It

**In your browser, visit:**
```
http://localhost:3000
```

1. Fill out the survey form
2. Click "Submit"
3. Check responses at: `http://localhost:3000/responses.html`
4. You should see your response appear!

---

## How It Works

### Database Schema

```sql
CREATE TABLE responses (
    id INTEGER PRIMARY KEY,
    session_id TEXT UNIQUE,
    timestamp TEXT,
    q1 TEXT,
    q2 TEXT,
    ... (q3 through q11)
    created_at DATETIME
);
```

Each survey submission creates one row in the `responses` table.

### Data Flow

**When user submits survey:**
```
1. JavaScript collects: sessionId, timestamp, q1...q11
2. POST to localhost:3000/submit
3. Server validates (rejects all-Neutral)
4. Server saves to SQLite database
5. Returns success response
```

**When user views responses:**
```
1. Browser fetches: GET localhost:3000/api/responses
2. Server queries: SELECT * FROM responses ORDER BY timestamp DESC
3. Returns JSON with all submissions
4. Page displays responses
5. Auto-refreshes every 5 seconds
```

---

## File Structure

```
survey/
├── server.js                # Node.js backend (NEW: SQLite version)
├── package.json             # Includes: better-sqlite3, npm start
├── storage.sql              # Database schema
├── survey_responses.db      # SQLite database (created on first run)
├── survey_responses.db-journal  # WAL file (created on first run)
├── index.html               # Frontend form
├── responses.html           # Response viewer
├── script.js                # Form logic
├── style.css                # Styling
└── .gitignore               # Excludes *.db files
```

---

## Important Notes

### ✅ What's Different from JSON Version

| Feature | JSON Version | SQLite Version |
|---------|-----|--------|
| Data store | `all_responses.json` | `survey_responses.db` |
| Database | File-based JSON | SQL database |
| Query | Read entire file | SQL SELECT queries |
| Performance | Slower with many responses | Faster |
| Reliability | Rewrites whole file | Atomic writes |

### ⚠️ Frontend Configuration

The frontend still uses `window.SURVEY_SERVER_BASE`. For **local testing**, leave it empty:

```javascript
window.SURVEY_SERVER_BASE = '';  // Uses relative /submit and /api/responses
```

This works because both frontend and backend are on `localhost:3000`.

### ⚠️ Important Limitation

**The frontend is deployed on GitHub Pages** (public internet), but **your backend is local** (localhost:3000). 

This means:
- ✅ Works locally: Visit `http://localhost:3000` in your browser
- ❌ Does NOT work remotely: GitHub Pages cannot reach your local server

**If you want to deploy the frontend to GitHub Pages + backend locally:**
- Frontend users will get "Cannot POST /submit" errors
- The system won't work unless users also run the server locally

**To fix this, either:**
1. Keep both frontend and backend local (current setup)
2. Deploy backend to cloud (Railway, Render, Heroku, etc.)
3. Use a tunneling service (ngrok) to expose local server

---

## Running the Server

### Normal Start

```bash
npm start
```

Or:

```bash
node server.js
```

### Stop the Server

Press `Ctrl+C` in the terminal.

### Check if Server is Running

```bash
# In PowerShell
netstat -ano | findstr :3000

# Or visit in browser
http://localhost:3000
```

---

## Database Queries (Advanced)

If you want to query the database directly:

```bash
# Install sqlite3 CLI (optional)
choco install sqlite

# Then open database
sqlite3 survey_responses.db

# In sqlite3 prompt:
sqlite> SELECT * FROM responses;
sqlite> SELECT COUNT(*) FROM responses;
sqlite> SELECT timestamp, q10, q11 FROM responses;
sqlite> .quit
```

---

## Troubleshooting

### Error: "Cannot find module 'better-sqlite3'"

**Solution:**
```bash
npm install
```

Then restart the server.

### Error: "EADDRINUSE: address already in use :::3000"

**Meaning:** Port 3000 is already in use (maybe another server is running)

**Solution 1 - Kill existing process:**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**Solution 2 - Use different port:**
```bash
$env:PORT=3001
npm start
```

Then visit: `http://localhost:3001`

### Error: "database is locked"

**Meaning:** Multiple processes are accessing the database

**Solution:**
- Close the server (`Ctrl+C`)
- Delete `survey_responses.db-journal` if it exists
- Restart the server

### Responses not saving but no error message

**Check:**
1. Is server running? (Check terminal)
2. Are you answering more than just "Neutral"?
3. Check browser console (F12 → Console) for errors

---

## Performance Tips

### Backing Up Data

```bash
# Copy database to backup
copy survey_responses.db survey_responses.backup.db
```

### Checking Database Size

```bash
dir survey_responses.db
# Look for file size in bytes
# SQLite is very efficient, even 10,000 responses = ~1MB
```

### Clearing All Responses

```bash
# DELETE all data from database:
sqlite3 survey_responses.db "DELETE FROM responses;"

# Or delete the file entirely:
del survey_responses.db
# Server will recreate it on restart
```

---

## Production Deployment Consideration

⚠️ **Current setup is NOT suitable for public deployment because:**
- Backend runs only on your machine (localhost)
- Frontend deployed to public GitHub Pages can't reach private localhost

**To deploy publicly, you would need to:**
1. Deploy backend to a cloud service (Railway, Render, Heroku, etc.)
2. Update `window.SURVEY_SERVER_BASE` to point to cloud backend
3. Ensure database is backed up regularly

**For now:** This setup works great for **local development and testing**.

---

## Monitoring

### See Server Logs

The server prints all requests:
```
✅ Saved response from session: abc123...
```

### Monitor Database Size

```bash
# Check number of responses
sqlite3 survey_responses.db "SELECT COUNT(*) FROM responses;"

# Check database file size
dir survey_responses.db
```

---

## Common Workflow

### Development

```
1. Terminal: npm start
2. Browser: http://localhost:3000
3. Fill survey and submit
4. Check responses.html
5. Repeat testing
6. Press Ctrl+C to stop server
```

### Sharing with Others

Since the backend is local, you'd need to either:
1. Share your machine's IP + tunnel it with ngrok
2. Deploy backend to cloud (see deployment guides)
3. Have everyone run the server locally on their machine

---

## Next Steps

- ✅ **Now:** Run `npm start` to test locally
- ✅ **Next:** Verify form submission and response viewing works
- ❓ **Later:** If needed, deploy backend to cloud (see DEPLOYMENT.md)

---

## File Manifest

| File | Purpose | Status |
|------|---------|--------|
| server.js | Node.js backend using SQLite | ✅ New version |
| package.json | Dependencies (better-sqlite3) | ✅ Updated |
| storage.sql | Database schema | ✅ Created |
| survey_responses.db | SQLite database | ⏳ Created on first run |
| index.html | Frontend form | ✅ Unchanged |
| responses.html | Response viewer | ✅ Unchanged |
| script.js | Form logic | ✅ Unchanged |

---

## Support

If you encounter issues:
1. Check server logs in terminal
2. Check browser console (F12 → Console)
3. Verify port 3000 is not in use
4. Try deleting `survey_responses.db` and restarting

