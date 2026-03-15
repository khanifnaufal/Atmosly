import fetch from "node-fetch";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";

export default async function handler(req, res) {
  const { city, units = "metric", lang = "id" } = req.query;

  if (!city) {
    return res.status(400).json({ error: "city_required" });
  }

  if (!OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: "api_key_missing" });
  }

  const url = `${OPENWEATHER_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=${units}&lang=${lang}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
