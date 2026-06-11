# 🎓 Presentation Slides: Learning Journal PWA (10-Slide Version)

## Slide 1: Title Slide
- **Title:** Mobile Application Development: The Journey
- **Subtitle:** From Static Web to Progressive Web App (PWA)
- **Student Name:** Askal Thapa
- **Course:** BSc Computer Science | **Unit:** FGCT6021
- **Visual:** Screenshot of the App's Hero Section (Home Page).

## Slide 2: Project Overview & Tech Stack
- **Goal:** Build a personal learning journal documentation of 7 weeks of development.
- **Problem:** Creating an accessible, performant, offline-capable platform.
- **Solution:** A PWA built with HTML, CSS, JS, and Python.
- **The Stack:**
    - **Frontend:** HTML5, CSS3 (Variables, Grid), JS (ES6+).
    - **Backend:** Python (Custom Server), JSON (File-based DB).
    - **PWA:** Service Workers, Web App Manifest.

## Slide 3: Phase 1 - Foundation & UI (Weeks 1-2)
- **Week 1:** Setup & Structure.
    - Git/GitHub setup, Folder structure.
    - First "Hello World" deployment.
- **Week 2:** Advanced UI/UX (Mobile-First).
    - **Layout:** CSS Grid & Flexbox.
    - **Design:** Custom Color Palette (`--accent-primary`) & Responsive Design.
    - **Visual:** Code snippet of CSS Variables.

## Slide 4: Phase 2 - Interactivity & Logic (Week 3)
- **Core Logic:** DOM Manipulation & State Management.
- **Key Feature:** Dark Mode Toggle.
    - Persists user preference via `localStorage`.
- **Advanced Logic Spotlight: The Game (Flappy Bird Clone)**
    - Uses HTML5 Canvas API & Custom Physics Engine.
    - Demonstrates complex JS logic & 60fps loop handling.

## Slide 5: Phase 3 - PWA Transformation (Week 4)
- **Goal:** Bridging the gap between web and native apps.
- **Manifest.json:** Enables specific app name, icons, and standalone mode (no URL bar).
- **Service Worker ("The Brain"):**
    - **Strategy:** "Cache-First" for App Shell (HTML, CSS, JS).
    - **Result:** App loads instantly and works even without a network.

## Slide 6: Phase 4 - Full Stack Integration (Weeks 5-6)
- **From Static to Dynamic:**
    - **Week 5:** Python Backend to replace hardcoded content.
    - **Week 6:** REST API connection.
- **API Architecture:**
    - `GET /api/reflections`: Fetch entries.
    - `POST /api/reflections`: Save new data.
- **Data Store:** JSON based file storage for simplicity and portability.

## Slide 7: Phase 5 - Advanced Sync Logic (Week 7)
- **The Challenge:** Handling unreliable network connections.
- **Workflow:**
    1. **Offline:** User saves entry -> Save to `localStorage` -> Notify "Saved Locally".
    2. **Online:** Detect connection -> Background Sync -> Push to Server.
- **Result:** Seamless user experience regardless of connectivity.

## Slide 8: Feature Spotlights
- **Dynamic Navigation:**
    - Single JS source for menus injected into all pages.
    - Auto-highlights active page.
- **Data Visualization (Stats):**
    - Calculates total entries, categories, and average word count.
    - Visualizes progress dynamically.

## Slide 9: Challenges, Quality & Roadmap
- **Challenges:**
    - Service Worker Cache management (Fixed with versioning).
    - Mobile Hover sticky states (Fixed with media queries).
- **Testing:** Achieved 90+ Lighthouse scores (Performance, Accessibility).
- **Future Roadmap:**
    - Implement User Authentication.
    - Migrate from JSON to SQL Database.
    - Add Push Notifications.

## Slide 10: Conclusion & Q&A
- **Summary:**
    - Built a robust Full-Stack PWA from scratch.
    - Mastered Frontend, Backend, and Offline-First paradigms.
- **Reflection:** A rewarding journey turning static pages into a native-like app.
- **Links:** [Live Demo] | [GitHub Repo]
- **Q&A:** Thank You! Any Questions?
