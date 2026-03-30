// ============================================================
// API endpoints
// ============================================================
const apiUrl      = '/api/weather';
const forecastUrl = '/api/forecast';
const geocodeUrl  = '/api/geocode';
const aqiUrl      = '/api/aqi';

// ============================================================
// DOM references
// ============================================================
const searchInput        = document.getElementById('search-input');
const searchBtn          = document.getElementById('btn-search');
const locationBtn        = document.getElementById('btn-location');
const weatherIcon        = document.querySelector('.weather-icon');
const weatherSection     = document.getElementById('weather-section');
const errorSection       = document.getElementById('error-section');
const loadingSection     = document.getElementById('loading-section');
const errorMessageEl     = document.getElementById('error-message');
const loadingTextEl      = document.getElementById('loading-text');
const retryBtn           = document.getElementById('btn-retry');
const quickLocationsEl   = document.getElementById('quick-locations');
const unitToggleC        = document.querySelector('.unit-c');
const unitToggleF        = document.querySelector('.unit-f');
const themeToggle        = document.getElementById('theme-toggle');
const languageSelect     = document.getElementById('language-select');
const forecastList       = document.getElementById('forecast-list');
const weatherCard        = document.getElementById('weather-card');
const aqiBadge           = document.getElementById('aqi-badge');
const autocompleteDropdown = document.getElementById('autocomplete-dropdown');

// ============================================================
// State — restored from localStorage
// ============================================================
let currentUnit   = localStorage.getItem('unit')     || 'metric';
let currentLang   = localStorage.getItem('lang')     || 'id';
let lastCity      = localStorage.getItem('lastCity')  || 'Jakarta';
let recentCities  = JSON.parse(localStorage.getItem('recentCities') || '[]');

// ============================================================
// Init
// ============================================================
function init() {
    // Restore theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light');
        themeToggle.querySelector('.theme-icon').textContent = '☼';
    }

    // Restore unit selection
    if (currentUnit === 'imperial') {
        unitToggleF.classList.add('active');
        unitToggleC.classList.remove('active');
    }

    // Restore language
    languageSelect.value = currentLang;
    document.documentElement.lang = currentLang;

    renderQuickCities();
    updateLanguageTexts();
    fetchWeather(lastCity);
}

// ============================================================
// Recent / quick cities
// ============================================================
const DEFAULT_CITIES = ['Jakarta', 'Bandung', 'Surabaya'];

function addRecentCity(city) {
    recentCities = [city, ...recentCities.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 3);
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    renderQuickCities();
}

function renderQuickCities() {
    const cities = recentCities.length > 0 ? recentCities : DEFAULT_CITIES;
    quickLocationsEl.innerHTML = cities.map(city =>
        `<button class="quick-city" data-city="${city}">${city}</button>`
    ).join('');
    quickLocationsEl.querySelectorAll('.quick-city').forEach(btn => {
        btn.addEventListener('click', () => fetchWeather(btn.dataset.city));
    });
}

// ============================================================
// Section visibility
// ============================================================
function showSection(section) {
    weatherSection.style.display = 'none';
    errorSection.style.display   = 'none';
    loadingSection.style.display = 'none';

    if (section === 'weather') weatherSection.style.display = 'block';
    if (section === 'error')   errorSection.style.display   = 'block';
    if (section === 'loading') loadingSection.style.display = 'flex';
}

// ============================================================
// Helpers
// ============================================================
function formatTime(timestamp, timezoneOffset, use24Hour = true) {
    const date    = new Date((timestamp + timezoneOffset) * 1000);
    const hours   = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    if (use24Hour) return `${String(hours).padStart(2, '0')}:${minutes}`;

    const suffix  = hours >= 12 ? 'PM' : 'AM';
    const hour12  = hours % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
}

function convertVisibility(meters) {
    return (meters / 1000).toFixed(1);
}

function getIconForWeather(main) {
    const m = (main || '').toLowerCase();
    if (m === 'clouds')                              return 'images/clouds.png';
    if (m === 'clear')                               return 'images/clear.png';
    if (m === 'rain')                                return 'images/rain.png';
    if (m === 'drizzle')                             return 'images/drizzle.png';
    if (m === 'mist' || m === 'fog' || m === 'haze') return 'images/mist.png';
    if (m === 'snow')                                return 'images/snow.png';
    return 'images/clear.png';
}

function getWindDirection(deg) {
    const dirs    = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    const arrows  = ['↑','↑','↗','↗','→','→','↘','↘','↓','↓','↙','↙','←','←','↖','↖'];
    const index   = Math.round(deg / 22.5) % 16;
    return `${arrows[index]} ${dirs[index]}`;
}

function setCardBackground(weatherMain) {
    weatherCard.className = `card weather-${(weatherMain || '').toLowerCase()}`;
}

function getAqiLabel(aqi) {
    const labels = {
        id: ['', 'Baik', 'Cukup', 'Sedang', 'Buruk', 'Sangat Buruk'],
        en: ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'],
    };
    return (labels[currentLang] || labels.en)[aqi] || '';
}

function setError(type) {
    const msgs = {
        city_not_found: { id: 'Kota tidak ditemukan. Coba nama lain.',            en: 'City not found. Try another name.' },
        geo_failed:     { id: 'Gagal mengambil cuaca berdasarkan lokasi.',         en: 'Failed to get weather by location.' },
        geo_denied:     { id: 'Izin lokasi ditolak. Gunakan pencarian kota.',      en: 'Location permission denied. Please search by city.' },
        generic:        { id: 'Terjadi kesalahan. Periksa koneksi internet kamu.', en: 'Something went wrong. Check your internet connection.' },
    };
    errorMessageEl.textContent = (msgs[type] || msgs.generic)[currentLang];
}

// ============================================================
// Forecast (horizontal cards with icons)
// ============================================================
function buildDailyForecast(forecastData, timezoneOffset) {
    const days = {};
    forecastData.list.forEach(item => {
        const localTs = item.dt + timezoneOffset;
        const dayKey  = new Date(localTs * 1000).toISOString().slice(0, 10);
        if (!days[dayKey]) days[dayKey] = [];
        days[dayKey].push(item);
    });

    const entries = Object.keys(days).slice(0, 5).map(dayKey => {
        const group       = days[dayKey];
        const temps       = group.map(g => g.main.temp);
        const min         = Math.round(Math.min(...temps));
        const max         = Math.round(Math.max(...temps));
        const midWeather  = group[Math.floor(group.length / 2)].weather[0];
        const date        = new Date((group[0].dt + timezoneOffset) * 1000);
        const dayName     = date.toLocaleDateString(
            currentLang === 'id' ? 'id-ID' : 'en-US',
            { weekday: 'short', day: 'numeric', month: 'short' }
        );
        return { dateLabel: dayName, min, max, main: midWeather.main, description: midWeather.description };
    });

    forecastList.innerHTML = '';
    entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <div class="forecast-day">${entry.dateLabel}</div>
            <img src="${getIconForWeather(entry.main)}" alt="${entry.main}" class="forecast-icon">
            <div class="forecast-main">${entry.description}</div>
            <div class="forecast-temps">
                <span class="max">↑ ${entry.max}°</span>
                <span class="min">↓ ${entry.min}°</span>
            </div>`;
        forecastList.appendChild(item);
    });
}

// ============================================================
// AQI
// ============================================================
async function fetchAQI(lat, lon) {
    try {
        const res = await fetch(`${aqiUrl}?lat=${lat}&lon=${lon}`);
        if (!res.ok) return;
        const data = await res.json();
        const aqi  = data?.list?.[0]?.main?.aqi;
        if (!aqi) { aqiBadge.textContent = ''; return; }
        aqiBadge.className = `aqi-badge aqi-${aqi}`;
        const label = currentLang === 'id' ? 'Kualitas Udara' : 'Air Quality';
        aqiBadge.textContent = `${label}: ${getAqiLabel(aqi)}`;
    } catch {
        aqiBadge.textContent = '';
    }
}

// ============================================================
// Fetch — by city name
// ============================================================
async function fetchWeather(city) {
    if (!city) return;
    lastCity = city;
    localStorage.setItem('lastCity', city);
    showSection('loading');
    closeAutocomplete();

    try {
        const q = new URLSearchParams({ city, units: currentUnit, lang: currentLang });
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${apiUrl}?${q}`),
            fetch(`${forecastUrl}?${q}`),
        ]);

        if (!currentRes.ok) throw new Error(currentRes.status === 404 ? 'CITY_NOT_FOUND' : 'API_ERROR');

        const currentData  = await currentRes.json();
        const forecastData = forecastRes.ok ? await forecastRes.json() : null;

        updateUI(currentData, forecastData);
        showSection('weather');
        addRecentCity(currentData.name);
        if (currentData.coord) fetchAQI(currentData.coord.lat, currentData.coord.lon);
    } catch (err) {
        console.error(err);
        setError(err.message === 'CITY_NOT_FOUND' ? 'city_not_found' : 'generic');
        showSection('error');
    }
}

// ============================================================
// Fetch — by geolocation
// ============================================================
async function fetchByGeolocation() {
    if (!navigator.geolocation) {
        setError('geo_failed');
        showSection('error');
        return;
    }

    showSection('loading');

    navigator.geolocation.getCurrentPosition(
        async position => {
            try {
                const { latitude, longitude } = position.coords;
                const q = new URLSearchParams({ lat: latitude, lon: longitude, units: currentUnit, lang: currentLang });
                const [currentRes, forecastRes] = await Promise.all([
                    fetch(`/api/weather/by-coords?${q}`),
                    fetch(`/api/forecast/by-coords?${q}`),
                ]);

                if (!currentRes.ok) throw new Error('API_ERROR');

                const currentData  = await currentRes.json();
                const forecastData = forecastRes.ok ? await forecastRes.json() : null;

                updateUI(currentData, forecastData);
                showSection('weather');
                addRecentCity(currentData.name);
                if (currentData.coord) fetchAQI(currentData.coord.lat, currentData.coord.lon);
            } catch {
                setError('geo_failed');
                showSection('error');
            }
        },
        () => {
            setError('geo_denied');
            showSection('error');
        }
    );
}

// ============================================================
// UI update
// ============================================================
function updateUI(data, forecastData) {
    const isMetric = currentUnit === 'metric';
    const tempUnit  = isMetric ? '°C' : '°F';
    const speedUnit = isMetric ? (currentLang === 'id' ? 'km/jam' : 'km/h') : 'mph';

    document.querySelector('.city').textContent = data.name;
    document.querySelector('.temp').textContent = `${Math.round(data.main.temp)}${tempUnit}`;

    const desc = data.weather[0].description;
    document.querySelector('.description').textContent = desc.charAt(0).toUpperCase() + desc.slice(1);

    document.querySelector('.humidity').textContent = `${data.main.humidity}%`;

    const windSpeed = isMetric ? Math.round(data.wind.speed * 3.6) : Math.round(data.wind.speed);
    document.querySelector('.wind').textContent = `${windSpeed} ${speedUnit}`;

    // Wind direction (Item 16)
    const windDirEl = document.querySelector('.wind-direction');
    windDirEl.textContent = data.wind?.deg != null ? getWindDirection(data.wind.deg) : '';

    document.querySelector('.feels-like').textContent =
        (currentLang === 'id' ? 'Terasa seperti ' : 'Feels like ') +
        `${Math.round(data.main.feels_like)}${tempUnit}`;

    document.querySelector('.pressure').textContent   = `${data.main.pressure} hPa`;
    document.querySelector('.visibility').textContent = `${convertVisibility(data.visibility)} km`;

    const tz = data.timezone;
    document.querySelector('.sunrise').textContent = formatTime(data.sys.sunrise, tz);
    document.querySelector('.sunset').textContent  = formatTime(data.sys.sunset,  tz);

    weatherIcon.src = getIconForWeather(data.weather[0].main);
    weatherIcon.alt = desc;

    // Dynamic card background (Item 11)
    setCardBackground(data.weather[0].main);

    // Dynamic page title (Item 13)
    document.title = `${data.name} — Weather App`;

    if (forecastData) buildDailyForecast(forecastData, tz);

    updateLanguageTexts();
}

// ============================================================
// Language texts
// ============================================================
function updateLanguageTexts() {
    const isID = currentLang === 'id';
    document.querySelector('.humidity-label').textContent   = isID ? 'Kelembapan'       : 'Humidity';
    document.querySelector('.wind-label').textContent       = isID ? 'Kecepatan angin'  : 'Wind speed';
    document.querySelector('.sunrise-label').textContent    = isID ? 'Matahari terbit'  : 'Sunrise';
    document.querySelector('.sunset-label').textContent     = isID ? 'Matahari terbenam': 'Sunset';
    document.querySelector('.pressure-label').textContent   = isID ? 'Tekanan'          : 'Pressure';
    document.querySelector('.visibility-label').textContent = isID ? 'Jarak pandang'    : 'Visibility';
    document.querySelector('.forecast-title').textContent   = isID ? 'Perkiraan cuaca (5 hari)' : '5-day forecast';
    loadingTextEl.textContent   = isID ? 'Mengambil data cuaca...' : 'Fetching weather data...';
    retryBtn.textContent        = isID ? 'Coba lagi' : 'Retry';
    searchInput.placeholder     = isID ? 'Cari kota...' : 'Search city...';
}

// ============================================================
// Autocomplete (Item 6)
// ============================================================
let autocompleteTimer = null;

function openAutocomplete(items) {
    if (!items.length) { closeAutocomplete(); return; }
    autocompleteDropdown.innerHTML = items.map(item =>
        `<div class="autocomplete-item" data-name="${item.name}">
            <span>📍</span>
            <span>${item.name}${item.state ? ', ' + item.state : ''}</span>
            <span class="ac-country">${item.country}</span>
        </div>`
    ).join('');
    autocompleteDropdown.classList.add('open');
    autocompleteDropdown.querySelectorAll('.autocomplete-item').forEach(el => {
        el.addEventListener('click', () => {
            searchInput.value = el.dataset.name;
            fetchWeather(el.dataset.name);
        });
    });
}

function closeAutocomplete() {
    autocompleteDropdown.classList.remove('open');
    autocompleteDropdown.innerHTML = '';
}

searchInput.addEventListener('input', () => {
    clearTimeout(autocompleteTimer);
    const q = searchInput.value.trim();
    if (q.length < 2) { closeAutocomplete(); return; }
    autocompleteTimer = setTimeout(async () => {
        try {
            const res = await fetch(`${geocodeUrl}?q=${encodeURIComponent(q)}&limit=5`);
            if (res.ok) openAutocomplete(await res.json());
        } catch { /* silent */ }
    }, 300);
});

document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) closeAutocomplete();
});

// ============================================================
// Event listeners
// ============================================================
searchBtn.addEventListener('click', () => {
    const val = searchInput.value.trim();
    if (val) fetchWeather(val);
});

searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && searchInput.value.trim()) fetchWeather(searchInput.value.trim());
});

locationBtn.addEventListener('click', fetchByGeolocation);

retryBtn.addEventListener('click', () => {
    if (lastCity) fetchWeather(lastCity);
    else showSection('weather');
});

unitToggleC.addEventListener('click', () => {
    if (currentUnit === 'metric') return;
    currentUnit = 'metric';
    unitToggleC.classList.add('active');
    unitToggleF.classList.remove('active');
    localStorage.setItem('unit', currentUnit);
    if (lastCity) fetchWeather(lastCity);
});

unitToggleF.addEventListener('click', () => {
    if (currentUnit === 'imperial') return;
    currentUnit = 'imperial';
    unitToggleF.classList.add('active');
    unitToggleC.classList.remove('active');
    localStorage.setItem('unit', currentUnit);
    if (lastCity) fetchWeather(lastCity);
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.querySelector('.theme-icon').textContent = isLight ? '☼' : '☾';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

languageSelect.addEventListener('change', () => {
    currentLang = languageSelect.value;
    document.documentElement.lang = currentLang;        // Item 3
    localStorage.setItem('lang', currentLang);
    updateLanguageTexts();
    if (lastCity) fetchWeather(lastCity);
});

// ============================================================
// Bootstrap
// ============================================================
init();