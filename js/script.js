const navHTML = `
    <nav>
        <div class="nav-brand-mobile">
            <a href="index.html">Askal Thapa</a>
        </div>
        <button class="hamburger" aria-label="Toggle navigation">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <div class="nav-overlay"></div>
        <ul class="nav-container">
            <li><a href="index.html" id="nav-home">Home</a></li>
            <li><a href="journal.html" id="nav-journal">Journal</a></li>
            <li><a href="reflections.html" id="nav-reflections">Reflections</a></li>
            <li><a href="about.html" id="nav-about">About</a></li>
            <li><a href="projects.html" id="nav-projects">Projects</a></li>
            <li><a href="game.html" id="nav-game">Game</a></li>
            <li class="nav-right-section">
                <div class="theme-toggle-container">
                    <span class="theme-toggle-label">Dark Mode</span>
                    <button id="theme-toggle" aria-label="Toggle theme"></button>
                </div>
                <div class="nav-info">
                    <div class="nav-time" id="current-time">Loading...</div>
                    <div class="nav-location" id="current-location">Loading location...</div>
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

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        toggleButton.classList.add('active');
        toggleLabel.textContent = 'Light Mode';
        toggleButton.setAttribute('aria-label', 'Switch to light theme');
    } else {
        toggleLabel.textContent = 'Dark Mode';
        toggleButton.setAttribute('aria-label', 'Switch to dark theme');
    }

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        toggleButton.classList.toggle('active');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            toggleLabel.textContent = 'Light Mode';
            toggleButton.setAttribute('aria-label', 'Switch to light theme');
        } else {
            localStorage.setItem('theme', 'light');
            toggleLabel.textContent = 'Dark Mode';
            toggleButton.setAttribute('aria-label', 'Switch to dark theme');
        }
    });
}

// Real-time clock functionality
function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (!timeElement) return;

    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    const timeString = now.toLocaleTimeString('en-US', options);
    timeElement.textContent = timeString;
}

// Location functionality with caching
async function updateLocation() {
    const locationElement = document.getElementById('current-location');
    if (!locationElement) return;

    // Check if we have cached location data
    const cachedLocation = localStorage.getItem('cachedLocation');
    const cacheTimestamp = localStorage.getItem('locationCacheTime');
    const now = Date.now();
    const cacheExpiry = 10 * 60 * 1000; // 10 minutes in milliseconds

    // If we have cached data and it's not expired, use it
    if (cachedLocation && cacheTimestamp && (now - parseInt(cacheTimestamp)) < cacheExpiry) {
        locationElement.textContent = cachedLocation;
        return;
    }

    if (!navigator.geolocation) {
        locationElement.textContent = 'Location not supported';
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
        locationElement.textContent = city;

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
            locationElement.textContent = city;

            // Cache the fallback location too
            localStorage.setItem('cachedLocation', city);
            localStorage.setItem('locationCacheTime', now.toString());
        } catch (ipError) {
            const fallbackLocation = 'London, UK'; // Default fallback
            locationElement.textContent = fallbackLocation;

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