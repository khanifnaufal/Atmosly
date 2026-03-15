// Base URL backend Node.js (proxy OpenWeather)
const apiBaseUrl = "http://localhost:3001";
const apiUrl = `${apiBaseUrl}/api/weather`;
const forecastUrl = `${apiBaseUrl}/api/forecast`;

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".btn-search");
const locationBtn = document.querySelector(".btn-location");
const weatherIcon = document.querySelector(".weather-icon");
const weatherSection = document.querySelector(".weather");
const errorSection = document.querySelector(".error");
const loadingSection = document.querySelector(".loading");
const errorMessageEl = document.querySelector(".error-message");
const retryBtn = document.querySelector(".btn-retry");
const quickCityButtons = document.querySelectorAll(".quick-city");
const unitToggleC = document.querySelector(".unit-c");
const unitToggleF = document.querySelector(".unit-f");
const themeToggle = document.querySelector(".theme-toggle");
const languageSelect = document.querySelector(".language-select");
const forecastList = document.querySelector(".forecast-list");

let currentUnit = "metric"; // metric = °C, imperial = °F
let currentLang = "id";
let lastCity = "Jakarta";

function showSection(section) {
    weatherSection.style.display = "none";
    errorSection.style.display = "none";
    loadingSection.style.display = "none";

    if (section === "weather") weatherSection.style.display = "block";
    if (section === "error") errorSection.style.display = "block";
    if (section === "loading") loadingSection.style.display = "flex";
}

function formatTime(timestamp, timezoneOffset, use24Hour = true) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    const hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    if (use24Hour) {
        return `${String(hours).padStart(2, "0")}:${minutes}`;
    } else {
        const suffix = hours >= 12 ? "PM" : "AM";
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes} ${suffix}`;
    }
}

function convertVisibility(meters) {
    return (meters / 1000).toFixed(1);
}

function getIconForWeather(main) {
    if (main === "Clouds") return "images/clouds.png";
    if (main === "Clear") return "images/clear.png";
    if (main === "Rain") return "images/rain.png";
    if (main === "Drizzle") return "images/drizzle.png";
    if (main === "Mist" || main === "Fog" || main === "Haze") return "images/mist.png";
    if (main === "Snow") return "images/snow.png";
    return "images/clear.png";
}

function buildDailyForecast(forecastData, timezoneOffset) {
    // Group by day
    const days = {};
    forecastData.list.forEach((item) => {
        const localTimestamp = item.dt + timezoneOffset;
        const date = new Date(localTimestamp * 1000);
        const dayKey = date.toISOString().slice(0, 10);

        if (!days[dayKey]) {
            days[dayKey] = [];
        }
        days[dayKey].push(item);
    });

    const entries = Object.keys(days)
        .slice(0, 5)
        .map((dayKey) => {
            const group = days[dayKey];
            const temps = group.map((g) => g.main.temp);
            const min = Math.round(Math.min(...temps));
            const max = Math.round(Math.max(...temps));
            const mainWeather = group[Math.floor(group.length / 2)].weather[0];

            const date = new Date((group[0].dt + timezoneOffset) * 1000);
            const dayName = date.toLocaleDateString(
                currentLang === "id" ? "id-ID" : "en-US",
                { weekday: "short", day: "numeric", month: "short" }
            );

            return {
                dateLabel: dayName,
                min,
                max,
                main: mainWeather.main,
                description: mainWeather.description,
            };
        });

    forecastList.innerHTML = "";

    entries.forEach((entry) => {
        const item = document.createElement("div");
        item.className = "forecast-item";
        item.innerHTML = `
            <div class="forecast-day">${entry.dateLabel}</div>
            <div class="forecast-main">${entry.description}</div>
            <div class="forecast-temps">
                <span class="max">↑ ${entry.max}°</span>
                <span class="min">↓ ${entry.min}°</span>
            </div>
        `;
        forecastList.appendChild(item);
    });
}

async function fetchWeather(city) {
    if (!city) return;
    lastCity = city;
    showSection("loading");
    try {
        const queryParams = new URLSearchParams({
            city,
            units: currentUnit,
            lang: currentLang,
        });

        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${apiUrl}?${queryParams.toString()}`),
            fetch(`${forecastUrl}?${queryParams.toString()}`),
        ]);

        if (!currentRes.ok) {
            throw new Error(currentRes.status === 404 ? "CITY_NOT_FOUND" : "API_ERROR");
        }

        const currentData = await currentRes.json();
        const forecastData = forecastRes.ok ? await forecastRes.json() : null;

        updateUI(currentData, forecastData);
        showSection("weather");
    } catch (err) {
        console.error(err);
        if (err.message === "CITY_NOT_FOUND") {
            errorMessageEl.textContent =
                currentLang === "id"
                    ? "Kota tidak ditemukan. Coba nama lain."
                    : "City not found. Try another name.";
        } else {
            errorMessageEl.textContent =
                currentLang === "id"
                    ? "Terjadi kesalahan saat mengambil data. Periksa koneksi internet kamu."
                    : "Something went wrong while fetching data. Check your internet connection.";
        }
        showSection("error");
    }
}

function updateUI(data, forecastData) {
    const isMetric = currentUnit === "metric";
    const tempUnit = isMetric ? "°C" : "°F";
    const speedUnit = isMetric ? "km/jam" : "mph";

    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}${tempUnit}`;

    const description = data.weather[0].description;
    document.querySelector(".description").textContent =
        description.charAt(0).toUpperCase() + description.slice(1);

    document.querySelector(".humidity").textContent = `${data.main.humidity}%`;

    const windSpeed = isMetric ? Math.round(data.wind.speed * 3.6) : Math.round(data.wind.speed);
    document.querySelector(".wind").textContent = `${windSpeed} ${speedUnit}`;

    document.querySelector(".feels-like").textContent =
        (currentLang === "id" ? "Terasa seperti " : "Feels like ") +
        `${Math.round(data.main.feels_like)}${tempUnit}`;

    document.querySelector(".pressure").textContent = `${data.main.pressure} hPa`;
    document.querySelector(".visibility").textContent = `${convertVisibility(data.visibility)} km`;

    const timezoneOffset = data.timezone;
    const use24Hour = true;
    document.querySelector(".sunrise").textContent = formatTime(
        data.sys.sunrise,
        timezoneOffset,
        use24Hour
    );
    document.querySelector(".sunset").textContent = formatTime(
        data.sys.sunset,
        timezoneOffset,
        use24Hour
    );

    weatherIcon.src = getIconForWeather(data.weather[0].main);

    if (forecastData) {
        buildDailyForecast(forecastData, timezoneOffset);
    }

    updateLanguageTexts();
}

function updateLanguageTexts() {
    const isID = currentLang === "id";
    document.querySelector(".humidity-label").textContent = isID ? "Kelembapan" : "Humidity";
    document.querySelector(".wind-label").textContent = isID ? "Kecepatan angin" : "Wind speed";
    document.querySelector(".sunrise-label").textContent = isID ? "Matahari terbit" : "Sunrise";
    document.querySelector(".sunset-label").textContent = isID ? "Matahari terbenam" : "Sunset";
    document.querySelector(".pressure-label").textContent = isID ? "Tekanan" : "Pressure";
    document.querySelector(".visibility-label").textContent = isID ? "Jarak pandang" : "Visibility";
    document.querySelector(".forecast-title").textContent = isID
        ? "Perkiraan cuaca (5 hari)"
        : "5-day forecast";
    document.querySelector(".loading-text").textContent = isID
        ? "Mengambil data cuaca..."
        : "Fetching weather data...";
    retryBtn.textContent = isID ? "Coba lagi" : "Retry";
    searchBox.placeholder = isID ? "Cari kota..." : "Search city...";
}

async function fetchByGeolocation() {
    if (!navigator.geolocation) {
        alert(
            currentLang === "id"
                ? "Geolokasi tidak didukung di browser ini."
                : "Geolocation not supported."
        );
        return;
    }

    showSection("loading");

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const params = new URLSearchParams({
                    lat: latitude,
                    lon: longitude,
                    units: currentUnit,
                    lang: currentLang,
                });

                const [currentRes, forecastRes] = await Promise.all([
                    fetch(`${apiBaseUrl}/api/weather/by-coords?${params.toString()}`),
                    fetch(`${apiBaseUrl}/api/forecast/by-coords?${params.toString()}`),
                ]);

                if (!currentRes.ok) {
                    throw new Error("API_ERROR");
                }

                const currentData = await currentRes.json();
                const forecastData = forecastRes.ok ? await forecastRes.json() : null;

                updateUI(currentData, forecastData);
                showSection("weather");
            } catch (err) {
                console.error(err);
                errorMessageEl.textContent =
                    currentLang === "id"
                        ? "Gagal mengambil cuaca berdasarkan lokasi."
                        : "Failed to get weather by location.";
                showSection("error");
            }
        },
        (error) => {
            console.error(error);
            errorMessageEl.textContent =
                currentLang === "id"
                    ? "Izin lokasi ditolak. Gunakan pencarian kota."
                    : "Location permission denied. Please search by city.";
            showSection("error");
        }
    );
}

// Event listeners
searchBtn.addEventListener("click", () => {
    if (searchBox.value.trim() === "") return;
    fetchWeather(searchBox.value.trim());
});

searchBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && searchBox.value.trim() !== "") {
        fetchWeather(searchBox.value.trim());
    }
});

locationBtn.addEventListener("click", () => {
    fetchByGeolocation();
});

retryBtn.addEventListener("click", () => {
    if (lastCity) {
        fetchWeather(lastCity);
    } else {
        showSection("weather");
    }
});

quickCityButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const city = btn.getAttribute("data-city");
        fetchWeather(city);
    });
});

unitToggleC.addEventListener("click", () => {
    if (currentUnit === "metric") return;
    currentUnit = "metric";
    unitToggleC.classList.add("active");
    unitToggleF.classList.remove("active");
    if (lastCity) fetchWeather(lastCity);
});

unitToggleF.addEventListener("click", () => {
    if (currentUnit === "imperial") return;
    currentUnit = "imperial";
    unitToggleF.classList.add("active");
    unitToggleC.classList.remove("active");
    if (lastCity) fetchWeather(lastCity);
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    themeToggle.querySelector(".theme-icon").textContent = isLight ? "☼" : "☾";
});

languageSelect.addEventListener("change", () => {
    currentLang = languageSelect.value;
    updateLanguageTexts();
    if (lastCity) fetchWeather(lastCity);
});

// Initial language texts and default city
updateLanguageTexts();
fetchWeather(lastCity);


