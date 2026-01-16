# 📔 Learning Journal PWA - Project Documentation

**Student:** Askal Thapa
**Course:** BSc Computer Science
**Unit:** FGCT6021 Mobile Application Development
**University:** University for the Creative Arts, Farnham

---

## 📖 Project Overview
This project is a **Progressive Web Application (PWA)** designed as a personal learning journal and portfolio. It documents the 7-week journey of mastering mobile application development, transitioning from static web pages to a full-stack application with offline capabilities and backend integration.

The application serves two purposes:
1.  **Portfolio:** Showcasing technical skills in HTML5, CSS3, JavaScript, and PWA technologies.
2.  **Learning Log:** A functional journal to record weekly progress, insights, and challenges.

---

## 🏗️ Technical Architecture

### 1. Frontend (The Interface)
-   **Core Technologies:** HTML5 (Semantic), CSS3 (Variables, Flexbox, Grid), JavaScipt (ES6+).
-   **Design System:**
    -   **Mobile-First Approach:** CSS media queries targets mobile screens (`max-width: 480px`, `768px`) first, then expands to desktop.
    -   **Theming:** Dynamic Dark/Light mode utilizing CSS Custom Properties (`--bg-primary`, `--text-primary`) and `localStorage` for persistence.
    -   **Glassmorphism:** Used in navigation overlays and cards for a modern, premium aesthetic.
-   **Interactivity:**
    -   **Dynamic Navigation:** Injected via JavaScript (`script.js`) to ensure consistency across pages.
    -   **Mobile Drawer:** Custom hamburger menu implementation with staggered animations.
    -   **Data Visualization:** Real-time statistics dashboard calculating metrics from JSON data.

### 2. Backend (The Data Layer)
-   **Language:** Python 3.
-   **Server:** Custom HTTP Server (`backend/server.py`).
-   **Database:** JSON Flat File (`backend/reflections.json`).
-   **API Endpoints:**
    -   `POST /api/reflections`: Accepts JSON payloads to save new journal entries.
    -   `GET /sw.js`: Serves the Service Worker from the root scope.

### 3. PWA Features (The "Progressive" Part)
-   **Service Worker (`sw.js`):**
    -   **Cache Strategy:** Cache-First for "App Shell" (HTML, CSS, JS) to ensure instant loading.
    -   **Network-First:** For dynamic content where freshness matters.
-   **Manifest (`manifest.json`):** Defines app name, icons, and `display: standalone` property to allow installation on home screens.
-   **Offline Sync:**
    -   Detects network status (`navigator.onLine`).
    -   Saves entries to `localStorage` when offline.
    -   Automatically pushes data to the server when connection is restored (`window.addEventListener('online')`).

---

## 📅 Weekly Progress Analysis

### Week 1: Setup & Foundations
-   **Focus:** Environment setup, Git version control, and initial folder structure.
-   **Outcome:** Established a clean codebase with separated concerns (`css/`, `js/`, `images/`). Deployed initial static structure to GitHub Pages.

### Week 2: Frontend Fundamentals
-   **Focus:** Semantic HTML5 and Advanced CSS.
-   **Outcome:** Implemented the "Mobile-First" responsive grid. Created the CSS variable system for easy theming. Achieved 95+ Lighthouse accessibility score.

### Week 3: JavaScript & Interactivity
-   **Focus:** DOM manipulation and State Management.
-   **Outcome:** Built the **Dark Mode toggle** and **Dynamic Navigation**. Learned to persist state using `localStorage`. This week bridged the gap between static pages and dynamic apps.

### Week 4: Advanced PWA Features
-   **Focus:** Offline capabilities and Installability.
-   **Outcome:** Implemented the **Service Worker**. This was the most complex phase, learning cache lifecycles (`install`, `activate`, `fetch`). Transformed the website into an installable app.

### Week 5: Backend Integration (Python & JSON)
-   **Focus:** Data Persistence beyond the browser.
-   **Outcome:** Connected the frontend to a Python script (`save_entry.py`) and JSON store. Moved from hardcoded HTML entries to dynamically rendering data fetched from `reflections.json`.

### Week 6: Full Stack Development
-   **Focus:** HTTP Methods and CRUD operations.
-   **Outcome:** Refined the backend to handle `POST` requests. Implemented the "Add Reflection" feature, understanding the client-server request/response cycle.

### Week 7: Polishing & Offline Sync
-   **Focus:** Resilience and UX.
-   **Outcome:** Implemented the **Offline Sync** logic. Verified edge cases (connection loss during save). Added Toast notifications for user feedback and refined the UI with animations.

---

## 🚀 Key Features Guide

### 1. Offline Mode 🔌
-   **How it works:** The Service Worker intercepts network requests. If the network fails, it serves the cached files.
-   **Syncing:** JavaScript listeners wait for the `online` event to upload any data saved in `localStorage`.

### 2. Flappy Bird Game 🐦
-   **Tech:** HTML5 Canvas API.
-   **Logic:** A game loop running at 60fps renders the bird, pipes, and background. Collision detection math checks for overlaps between the bird's coordinate circle and pipe rectangles.

### 3. Smart Navigation 🧭
-   **Tech:** JavaScript & CSS Media Queries.
-   **Logic:** On desktop, a horizontal bar. On mobile, a hamburger icon triggers a slide-out drawer. The overlay uses `backdrop-filter: blur()` for a premium glass effect.

---

## 🔮 Future Improvements
-   **Authentication:** Implement user login to secure the write-access backend.
-   **Database:** Migrate from JSON to SQLite or PostgreSQL for better scalability.
-   **Push Notifications:** Use the Push API to re-engage users when new content is posted.

---
*Documentation generated for university submission.*
