# Data Driven Design Survey Form

A lightweight, zero-backend survey application. 100% client-side with local storage.

## Features

✅ **No Server Required**
- Pure static HTML/CSS/JS
- Works on GitHub Pages, Netlify, Vercel, or any static host
- No dependencies to install

✅ **Local Data Storage**
- All responses stored in browser `localStorage`
- View all responses on dedicated page
- Export responses as JSON

✅ **User Friendly**
- Progress bar showing completion
- Resume incomplete surveys
- Download individual responses
- Simple response viewer dashboard

## Quick Start

### Option 1: Local File
Just open `index.html` in your browser. That's it!
```bash
# Windows
start survey/index.html

# macOS
open survey/index.html

# Linux
xdg-open survey/index.html
```

### Option 2: Simple HTTP Server (Optional)
If you want to test as if deployed:
```bash
# Python 3
python -m http.server 3000

# Node.js
npx http-server -p 3000

# PowerShell
python -m http.server 3000
```

Then open `http://localhost:3000/survey/`

## How It Works

1. **User fills survey** → Data saved to browser's `localStorage`
2. **View responses** → Open `responses.html` to see all collected data
3. **Export data** → Download as JSON file for analysis

## Project Structure

```
survey/
├── index.html              # Main survey
├── responses.html          # View all responses
├── script.js              # Survey logic
├── style.css              # Styling
├── config.json            # Configuration
└── README.md              # This file
```

## Data Storage

All responses are stored in **browser localStorage** with keys like:
```
survey_ceb85c7b-23f1-468d-9a62-06681fa3fd15
survey_a49a32fd-ffe0-45f8-a5f3-90feca7bb35e
```

### View Responses

1. **In Browser**: Open `responses.html`
2. **In Developer Tools**: 
   - Press F12 → Application → Local Storage
   - Look for keys starting with `survey_`

### Export Responses

- **Individual**: Click "Download My Responses" after completing survey
- **All Together**: Click "📥 Download All Responses" on responses page

## Deployment

### Deploy to GitHub Pages

```bash
git add .
git commit -m "Add survey"
git push origin main
```

Your survey will be live at: `https://yourusername.github.io/repo-name/survey/`

### Deploy to Netlify

1. Connect GitHub repo
2. Build command: (leave empty)
3. Publish directory: `survey`
4. Deploy!

### Deploy to Vercel

Same as Netlify - just connect your GitHub repo.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Survey Questions

The survey covers:
1. User profile (Professor/Student/Other)
2. Moodle usage frequency  
3. Campus Wi-Fi usage
4. Campus Wi-Fi satisfaction
5. Moodle reliability
6. Moodle usability
7. IT support accessibility
8. IT support helpfulness
9. System reliability during exams
10. Overall satisfaction
11. Net Promoter Score (NPS)

## Configuration

Edit `config.json` to customize survey details.

## Data Privacy

✅ **Completely Private**
- All data stays in browser
- No server, no tracking
- No IP logging
- Users control their data

## No Server Issues?

Since there's no server:
- ✅ Works completely offline
- ✅ No CORS issues
- ✅ No authentication needed
- ✅ Works on any host
- ✅ Instant deployment

## Clear All Responses

On `responses.html` page, click "🗑️ Clear All" button.

Or in browser console:
```javascript
for (let key in localStorage) {
    if (key.startsWith('survey_')) {
        localStorage.removeItem(key);
    }
}
```

## Support

For issues:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Check for error messages
4. Verify localStorage is enabled in browser

## That's It! 🎉

No servers, no databases, no complexity. Just a simple survey that works everywhere.
