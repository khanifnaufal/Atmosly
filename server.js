import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";

if (!OPENWEATHER_API_KEY) {
  console.warn(
    "[WARN] OPENWEATHER_API_KEY belum di-set di file .env. Tambahkan OPENWEATHER_API_KEY=... agar backend bisa jalan."
  );
}

app.use(cors());

// Endpoint untuk current weather berdasarkan nama kota
app.get("/api/weather", async (req, res) => {
  const { city, units = "metric", lang = "id" } = req.query;

  if (!city) {
    return res.status(400).json({ error: "city_required" });
  }

  try {
    const url = `${OPENWEATHER_BASE}/weather?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_API_KEY}&units=${units}&lang=${lang}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
});

// Endpoint untuk forecast (5 hari / 3 jam) berdasarkan nama kota
app.get("/api/forecast", async (req, res) => {
  const { city, units = "metric", lang = "id" } = req.query;

  if (!city) {
    return res.status(400).json({ error: "city_required" });
  }

  try {
    const url = `${OPENWEATHER_BASE}/forecast?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_API_KEY}&units=${units}&lang=${lang}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
});

// Endpoint current weather berdasarkan koordinat
app.get("/api/weather/by-coords", async (req, res) => {
  const { lat, lon, units = "metric", lang = "id" } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "coords_required" });
  }

  try {
    const url = `${OPENWEATHER_BASE}/weather?lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&appid=${OPENWEATHER_API_KEY}&units=${units}&lang=${lang}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
});

// Endpoint forecast berdasarkan koordinat
app.get("/api/forecast/by-coords", async (req, res) => {
  const { lat, lon, units = "metric", lang = "id" } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "coords_required" });
  }

  try {
    const url = `${OPENWEATHER_BASE}/forecast?lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&appid=${OPENWEATHER_API_KEY}&units=${units}&lang=${lang}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
});

app.listen(PORT, () => {
  console.log(`Weather backend listening on http://localhost:${PORT}`);
});


