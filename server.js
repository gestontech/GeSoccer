const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const API_FOOTBALL_URL = "https://v3.football.api-sports.io";

const ALLOWED_ENDPOINTS = new Set([
  "fixtures",
  "live",
  "standings",
  "teams",
  "players",
  "topscorers",
  "transfers",
  "leagues"
]);

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

app.get("/api/football", async (req, res) => {
  const endpoint = getQueryValue(req.query.endpoint);

  if (!ALLOWED_ENDPOINTS.has(String(endpoint || ""))) {
    return res.status(400).json({
      error: "Invalid football endpoint"
    });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "API_FOOTBALL_KEY is not configured."
    });
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(req.query)) {
    if (
      key === "endpoint" ||
      value === undefined ||
      value === null ||
      value === ""
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (
          item !== undefined &&
          item !== null &&
          item !== ""
        ) {
          params.append(key, String(item));
        }
      }
    } else {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();

  const providerUrl =
    `${API_FOOTBALL_URL}/${endpoint}` +
    (queryString ? `?${queryString}` : "");

  try {
    const response = await fetch(providerUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-apisports-key": apiKey
      }
    });

    const body = await response.text();

    res.status(response.status);

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") ||
        "application/json"
    );

    return res.send(body);
  } catch (error) {
    return res.status(502).json({
      error: "Football provider unavailable",
      message: error?.message || "Unknown error"
    });
  }
});

app.use(express.static("dist"));

app.get(/.*/, (req, res) => {
  res.sendFile("index.html", {
    root: "dist"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`GeSoccer listening on port ${PORT}`);
});
