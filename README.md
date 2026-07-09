# Learning Journal PWA

A Progressive Web App that documents my Mobile Application Development coursework
(Labs 1–7). It has a Flask backend, a JSON reflections API, a service worker for
offline use, a web manifest so it can be installed like a native app, and a small
canvas game as the creative extension.

**Live demo:** https://askal.pythonanywhere.com
**Source:** https://github.com/askal-thapa/journal

---

## What it does

| Requirement (Labs 1–7) | Where it lives |
| --- | --- |
| Frontend (HTML/CSS/JS) | `index.html`, `journal.html`, `about.html`, `projects.html`, `reflections.html`, `css/`, `js/` |
| JavaScript & DOM | `js/script.js` (nav, theme, clock), `js/browser.js` (search, copy, reading time) |
| APIs | Geolocation + reverse-geocoding (`js/script.js`), Clipboard API (`js/browser.js`), and the app's own reflections API |
| Python & JSON storage | `backend/reflections.json`, `backend/save_entry.py` (CLI to add entries) |
| Flask backend | `app.py` — serves the site and the `/api/reflections` endpoints |
| Service worker (offline) | `sw.js` + `offline.html` |
| Web manifest (installable) | `manifest.json` + icons in `images/` |
| **Creative extension** | `game.html` + `js/game.js` — a Flappy-Bird-style canvas game |

## Project structure

```
journal/
├── app.py                     # Flask backend (run this)
├── manifest.json              # PWA manifest
├── sw.js                      # Service worker (offline caching)
├── offline.html               # Shown when a page isn't cached and you're offline
├── requirements.txt           # Python dependencies (Flask)
├── pythonanywhere_wsgi.py     # WSGI template for deployment (see below)
├── index.html … game.html     # Pages
├── css/                       # Styles
├── js/                        # Front-end JavaScript
├── images/                    # Profile photo + PWA icons
└── backend/
    ├── reflections.json       # Stored reflections (the "database")
    └── save_entry.py          # Lab 5 CLI tool to add reflections
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET`  | `/api/reflections` | Returns all reflections as a JSON array |
| `POST` | `/api/reflections` | Adds one reflection (`{ "text": "...", "category": "..." }`) |

All front-end `fetch()` calls use **relative** URLs (`/api/reflections`), so the
exact same code runs on `localhost` and on PythonAnywhere with no changes.

---

## Run it locally

You need Python 3.

```bash
# 1. (optional but recommended) create a virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 2. install Flask
pip install -r requirements.txt

# 3. start the server
python app.py
```

Then open **http://localhost:8000** — not Live Server. The whole app (pages +
API) is served by Flask from one origin, which is what makes the PWA and the API
work together.

---

## How I deployed it (PythonAnywhere)

I chose PythonAnywhere because GitHub Pages can't run a Flask server, and I get
HTTPS for free, which the PWA needs to install and register the service worker.

These are the steps I followed:

1. Made a free account at [pythonanywhere.com](https://www.pythonanywhere.com/).
2. Opened a Bash console and cloned the project:
   ```bash
   git clone https://github.com/askal-thapa/journal.git
   ```
3. Installed Flask on the server:
   ```bash
   pip install --user -r journal/requirements.txt
   ```
4. On the **Web** tab I added a new web app with *Manual configuration → Python 3.10*.
5. Opened the WSGI file it generated (`/var/www/askal_pythonanywhere_com_wsgi.py`),
   cleared it, and pasted the contents of [`pythonanywhere_wsgi.py`](pythonanywhere_wsgi.py)
   so it imports my Flask app from `/home/Askal/journal`.
6. Hit **Reload** and opened https://askal.pythonanywhere.com.

Flask serves the pages, icons, `manifest.json` and `sw.js` itself, so I didn't need
to set up any static-file mapping. Reflections are written to
`backend/reflections.json` on the server, so entries I add stay after a reload. The
location lookup runs in the visitor's browser, so the free-tier proxy doesn't affect it.

---

## Test the PWA features

**Install it**
1. Open the site in Chrome/Edge (on the deployed HTTPS URL).
2. An install icon appears in the address bar, or use ⋮ menu → *Install*.
3. On Android: *Add to Home screen*.

**Check it works offline**
1. Open DevTools (F12) → **Network** tab → set throttling to **Offline**.
2. The status pill in the top bar switches to **Offline**.
3. Reload — pages still load from the cache.
4. Add a reflection while offline → *"Saved locally"*.
5. Turn Offline off → the pill returns to **Online** and entries sync automatically.

**Audit it**
Run **Lighthouse** (DevTools → Lighthouse → *Progressive Web App*) — it should
report an installable manifest and a registered service worker.

---

## Creative extension — the game

`game.html` is a Flappy-Bird-style game built with the Canvas API (`js/game.js`).
It keeps a high score in `localStorage` and has an optional "infinite" mode. It's
included in the offline cache, so it plays with no connection.
