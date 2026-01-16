# Learning Journal PWA 🚀

A Progressive Web App (PWA) learning journal with offline support and backend sync.

## Features
- **Offline Support**: View pages and save reflections even without internet.
- **Backend Sync**: Data saved offline automatically syncs when specific connection is restored.
- **Installable**: Can be installed on mobile/desktop as a native app.
- **Dark Mode**: Built-in theme switcher.

## How to Run

### Prerequisite
- Python 3.x installed

### Steps
1.  Open a terminal in the project root folder.
2.  Run the custom backend server:
    ```bash
    python3 backend/server.py
    ```
3.  Open your browser and navigate to:
    - [http://localhost:8000](http://localhost:8000)

### Testing Offline Mode
1.  Open the app in Chrome/Edge.
2.  Open DevTools (F12) -> Network tab.
3.  Change "No throttling" to **"Offline"**.
4.  Try adding a reflection. You should see a "Saved locally" notification.
5.  Turn "Offline" off.
6.  You should see a "Back online" and "Synced" notification.

## Data Storage
- **Online**: Data is saved to `backend/reflections.json`.
- **Offline**: Data is temporarily saved in `localStorage`.
