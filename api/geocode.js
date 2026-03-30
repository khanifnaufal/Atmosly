import fetch from "node-fetch";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_GEO_BASE = "http://api.openweathermap.org/geo/1.0";

export default async function handler(req, res) {
  const { q, limit = 5 } = req.query;

  if (!q) {
    return res.status(400).json({ error: "q_required" });
  }

  if (!OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: "api_key_missing" });
  }

  const url = `${OPENWEATHER_GEO_BASE}/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${OPENWEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
