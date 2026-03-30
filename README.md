# ⛅ Weather App

A modern, fast, and feature-rich Weather Application built with Vanilla JavaScript, HTML, and CSS. It provides real-time weather data, a 5-day forecast, and Air Quality Index (AQI) information for any city worldwide using the **OpenWeather API**.

The app is built to be deployed seamlessly on **Vercel** via Serverless Functions, while also offering a robust **Node.js/Express** local development environment.

## ✨ Features

- **Real-Time Weather Updates:** Current temperature, humidity, wind speed, wind direction, pressure, sunrise/sunset times, and visibility.
- **5-Day Forecast:** Presented in horizontal, easy-to-read, scannable cards with daily high/low temperatures and weather condition icons.
- **Air Quality Index (AQI):** Color-coded real-time air pollution metrics.
- **Smart City Autocomplete:** Instantly fetches and suggests global city locations as you type using the Geocoding API.
- **Geolocation Support:** Instantly fetch weather for your current physical location at the click of a button.
- **Dynamic Theming:** The application card dynamically adjusts its gradient matching the actual weather conditions (e.g., moody gray for rain, crisp amber for sunny skies).
- **Dark/Light Mode:** Toggle between sleek dark interfaces and clean light UI themes.
- **Bilingual Support (ID/EN):** Fully translated UI strings toggleable between Indonesian and English.
- **Unit Toggling:** Switch seamlessly between Metric (°C, km/h) and Imperial (°F, mph).
- **Persistent State:** Saves your preferences (theme, units, language, and recently searched cities) securely inside your browser's `localStorage`.

## 🚀 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (No frameworks).
- **Backend (Local):** Node.js, Express.js, `express-rate-limit`, `node-fetch`.
- **Backend (Production):** Vercel Serverless Functions (`/api`), Edge Caching configuration (`vercel.json`).
- **Data Source:** [OpenWeather API](https://openweathermap.org/api).

---

## 🛠️ Local Development Setup

To run this application locally, you will need [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/khanifnaufal/Simple-Weather-App-JS.git
cd Simple-Weather-App-JS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of the project and insert your OpenWeather API Key:

```env
OPENWEATHER_API_KEY=your_actual_api_key_here
ALLOWED_ORIGIN=*
```
> **Note:** You can obtain a free API key by signing up at [OpenWeather](https://home.openweathermap.org/users/sign_up).

### 4. Run the Dev Server
```bash
npm run dev
```
The server will start locally — navigate to **http://localhost:3001** to view the app!

---

## ☁️ Deployment (Vercel)

This application comes pre-configured for **Vercel** serverless environments. 

1. Push your repository to GitHub.
2. Import the project directly inside your [Vercel Dashboard](https://vercel.com/new).
3. Ensure you add `OPENWEATHER_API_KEY` to the **Environment Variables** section within your Vercel Project Settings.
4. Deploy! Vercel will automatically hook into the `/api` directory serverless functions and apply the Edge Caching headers defined inside `vercel.json`.

---

## 👤 Author

Created with ❤️ by **[Khanif Naufal](https://github.com/khanifnaufal)**.
