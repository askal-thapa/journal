const navHTML = `
    <nav>
        <ul class="nav-container">
            <li><a href="index.html" id="nav-home">Home</a></li>
            <li><a href="journal.html" id="nav-journal">Journal</a></li>
            <li><a href="reflections.html" id="nav-reflections">Reflections</a></li>
            <li><a href="about.html" id="nav-about">About</a></li>
            <li><a href="projects.html" id="nav-projects">Projects</a></li>
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
    }
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
}


document.addEventListener('DOMContentLoaded', () => {
    loadNavigation();
    setupThemeSwitcher();
    initializeFeatures();
});