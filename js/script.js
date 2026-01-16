// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker: Registered (Pages)'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}

// Offline/Online Status Handling
window.addEventListener('online', () => {
    showNotification('You are back online! 🌐');
    syncOfflineReflections();
});

window.addEventListener('offline', () => {
    showNotification('You are offline. Changes will save locally. 💾');
});

// Sync Logic
async function syncOfflineReflections() {
    const offlineData = localStorage.getItem('offlineReflections');
    if (!offlineData) return;

    const reflections = JSON.parse(offlineData);
    if (reflections.length === 0) return;

    showNotification(`Syncing ${reflections.length} offline reflection(s)... ⏳`);

    let syncedCount = 0;
    const remainingReflections = [];

    for (const reflection of reflections) {
        try {
            const response = await fetch('http://localhost:8000/api/reflections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reflection)
            });

            if (response.ok) {
                syncedCount++;
            } else {
                remainingReflections.push(reflection);
            }
        } catch (error) {
            console.error('Sync error:', error);
            remainingReflections.push(reflection);
        }
    }

    if (syncedCount > 0) {
        showNotification(`Successfully synced ${syncedCount} reflections! ✅`);
        // Reload reflections if on the page
        if (typeof loadReflections === 'function') {
            loadReflections();
        }
    }

    if (remainingReflections.length > 0) {
        localStorage.setItem('offlineReflections', JSON.stringify(remainingReflections));
    } else {
        localStorage.removeItem('offlineReflections');
    }
}

// Toast Notification
function showNotification(message, duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger reflow
    void toast.offsetWidth;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

const navHTML = `
    <nav>
        <div class="nav-brand-mobile">
            <a href="index.html">Askal Thapa</a>
        </div>
        
        <div class="nav-mobile-right">
            <div class="nav-info-wrapper">
                 <div class="nav-info">
                    <div class="nav-time nav-time-display">Loading...</div>
                    <div class="nav-location nav-location-display">Loading location...</div>
                </div>
            </div>
            <button class="hamburger" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <div class="nav-overlay"></div>
        <ul class="nav-container">
            <li><a href="index.html" id="nav-home">Home</a></li>
            <li><a href="journal.html" id="nav-journal">Journal</a></li>
            <li><a href="reflections.html" id="nav-reflections">Reflections</a></li>
            <li><a href="about.html" id="nav-about">About</a></li>
            <li class="nav-right-section-desktop">
                <div class="theme-toggle-container">
                    <span class="theme-toggle-label">Dark Mode</span>
                    <button id="theme-toggle" aria-label="Toggle theme"></button>
                </div>
                <div class="nav-info">
                    <div class="nav-time nav-time-display">Loading...</div>
                    <div class="nav-location nav-location-display">Loading location...</div>
                </div>
            </li>
        </ul>
    </nav>
`;

function loadNavigation() {
    const headerElement = document.querySelector('header.navigation');
    if (!headerElement) return;

    headerElement.innerHTML = navHTML;

    const path = window.location.pathname.split('/').pop();
    if (path === 'index.html' || path === '') {
        const homeLink = document.getElementById('nav-home');
        if (homeLink) homeLink.classList.add('active');
    } else if (path === 'journal.html') {
        const el = document.getElementById('nav-journal'); if (el) el.classList.add('active');
    } else if (path === 'reflections.html') {
        const el = document.getElementById('nav-reflections'); if (el) el.classList.add('active');
    } else if (path === 'about.html') {
        const el = document.getElementById('nav-about'); if (el) el.classList.add('active');
    } else if (path === 'projects.html') {
        const el = document.getElementById('nav-projects'); if (el) el.classList.add('active');
    } else if (path === 'game.html') {
        const el = document.getElementById('nav-game'); if (el) el.classList.add('active');
    }

    setupMobileMenu();
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navContainer = document.querySelector('.nav-container');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-container a');
    const body = document.body;

    if (!hamburger || !navContainer) return;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navContainer.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navContainer.classList.remove('active');
        navOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navContainer.classList.contains('active') &&
            !navContainer.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navContainer.classList.contains('active')) {
            closeMenu();
        }
    });
}

function setupThemeSwitcher() {
    const toggleButton = document.getElementById('theme-toggle');
    const toggleLabel = document.querySelector('.theme-toggle-label');
    const body = document.body;
    if (!toggleButton) return;

    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    function updateThemeUI(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            toggleButton.classList.add('active');
            toggleButton.innerHTML = moonIcon; // Show moon in dark mode (or sun to switch back? standard is show current state or action)
            // Actually, best UX: Show the icon of the mode you are IN (or will switch to?). 
            // Standard: Show sun if you can switch to light (i.e. currently dark), or show moon if you can switch to dark.
            // Wait, usually the icon represents the *current* state (Moon = Night mode is On). 
            // Let's stick to: Moon Icon = Dark Mode Active. Sun Icon = Light Mode Active.
            toggleButton.innerHTML = sunIcon; /* Shows Sun, indicating click to go Light */
            toggleButton.setAttribute('aria-label', 'Switch to light theme');
            if (toggleLabel) toggleLabel.textContent = 'Light Mode';
        } else {
            body.classList.remove('dark-mode');
            toggleButton.classList.remove('active');
            toggleButton.innerHTML = moonIcon; /* Shows Moon, indicating click to go Dark */
            toggleButton.setAttribute('aria-label', 'Switch to dark theme');
            if (toggleLabel) toggleLabel.textContent = 'Dark Mode';
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        updateThemeUI(true);
    } else {
        updateThemeUI(false);
    }

    toggleButton.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-mode');
        // Toggle
        if (isDark) {
            localStorage.setItem('theme', 'light');
            updateThemeUI(false);
        } else {
            localStorage.setItem('theme', 'dark');
            updateThemeUI(true);
        }
    });
}

// Real-time clock functionality
function updateTime() {
    const timeElements = document.querySelectorAll('.nav-time-display');
    if (timeElements.length === 0) return;

    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    const timeString = now.toLocaleTimeString('en-US', options);
    timeElements.forEach(el => el.textContent = timeString);
}

// Location functionality with caching
async function updateLocation() {
    const locationElements = document.querySelectorAll('.nav-location-display');
    if (locationElements.length === 0) return;

    function setLocationText(text) {
        locationElements.forEach(el => el.textContent = text);
    }

    // Check if we have cached location data
    const cachedLocation = localStorage.getItem('cachedLocation');
    const cacheTimestamp = localStorage.getItem('locationCacheTime');
    const now = Date.now();
    const cacheExpiry = 10 * 60 * 1000; // 10 minutes in milliseconds

    // If we have cached data and it's not expired, use it
    if (cachedLocation && cacheTimestamp && (now - parseInt(cacheTimestamp)) < cacheExpiry) {
        setLocationText(cachedLocation);
        return;
    }

    if (!navigator.geolocation) {
        setLocationText('Location not supported');
        return;
    }

    try {
        // Get user's position
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: false
            });
        });

        const { latitude, longitude } = position.coords;

        // Use reverse geocoding to get city name
        // Using a free service that doesn't require API key
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await response.json();

        const city = data.city || data.locality || data.countryName || 'Unknown location';
        setLocationText(city);

        // Cache the location data
        localStorage.setItem('cachedLocation', city);
        localStorage.setItem('locationCacheTime', now.toString());

    } catch (error) {
        console.log('Location error:', error);
        // Fallback to IP-based location
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const city = data.city || 'Unknown location';
            setLocationText(city);

            // Cache the fallback location too
            localStorage.setItem('cachedLocation', city);
            localStorage.setItem('locationCacheTime', now.toString());
        } catch (ipError) {
            const fallbackLocation = 'London, UK'; // Default fallback
            setLocationText(fallbackLocation);

            // Cache even the fallback
            localStorage.setItem('cachedLocation', fallbackLocation);
            localStorage.setItem('locationCacheTime', now.toString());
        }
    }
}

// Initialize time and location features
function initializeFeatures() {
    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);

    // Update location once
    updateLocation();

    // Add Back to Top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.ariaLabel = 'Back to Top';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavigation();
    setupThemeSwitcher();
    initializeFeatures();
});