import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY      = process.env.OPENWEATHER_API_KEY;
const OW_BASE      = "https://api.openweathermap.org/data/2.5";
const OW_GEO_BASE  = "http://api.openweathermap.org/geo/1.0";

if (!API_KEY) {
  console.warn("[WARN] OPENWEATHER_API_KEY belum di-set di file .env.");
}

// ── CORS (Item 20) ───────────────────────────────────────────
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));

// ── Rate limiting (Item 17) ──────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "too_many_requests" },
});
app.use("/api", limiter);

// ── Static files ─────────────────────────────────────────────
app.use(express.static(process.cwd()));
app.get("/", (req, res) => res.sendFile("index.html", { root: process.cwd() }));

// ── In-memory cache (Item 18) ────────────────────────────────
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const cache = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

async function proxyFetch(url, cacheKey, res) {
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) setCache(cacheKey, data);
    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}

// ── /api/weather — by city name ──────────────────────────────
app.get("/api/weather", async (req, res) => {
  const { city, units = "metric", lang = "id" } = req.query;
  if (!city) return res.status(400).json({ error: "city_required" });

  const url = `${OW_BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}&lang=${lang}`;
  const key = `weather:city:${city}:${units}:${lang}`;
  return proxyFetch(url, key, res);
});

// ── /api/forecast — by city name ─────────────────────────────
app.get("/api/forecast", async (req, res) => {
  const { city, units = "metric", lang = "id" } = req.query;
  if (!city) return res.status(400).json({ error: "city_required" });

  const url = `${OW_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}&lang=${lang}`;
  const key = `forecast:city:${city}:${units}:${lang}`;
  return proxyFetch(url, key, res);
});

// ── /api/weather/by-coords ───────────────────────────────────
app.get("/api/weather/by-coords", async (req, res) => {
  const { lat, lon, units = "metric", lang = "id" } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "coords_required" });

  const url = `${OW_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`;
  const key = `weather:coords:${lat}:${lon}:${units}:${lang}`;
  return proxyFetch(url, key, res);
});

// ── /api/forecast/by-coords ──────────────────────────────────
app.get("/api/forecast/by-coords", async (req, res) => {
  const { lat, lon, units = "metric", lang = "id" } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "coords_required" });

  const url = `${OW_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`;
  const key = `forecast:coords:${lat}:${lon}:${units}:${lang}`;
  return proxyFetch(url, key, res);
});

// ── /api/aqi (Item 10) ───────────────────────────────────────
app.get("/api/aqi", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "coords_required" });

  const url = `${OW_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const key = `aqi:${lat}:${lon}`;
  return proxyFetch(url, key, res);
});

// ── /api/geocode (Item 6 — autocomplete) ────────────────────
app.get("/api/geocode", async (req, res) => {
  const { q, limit = 5 } = req.query;
  if (!q) return res.status(400).json({ error: "q_required" });

  const url = `${OW_GEO_BASE}/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${API_KEY}`;
  const key = `geocode:${q}:${limit}`;
  return proxyFetch(url, key, res);
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Weather backend listening on http://localhost:${PORT}`);
});