const API_FOOTBALL_URL = "https://v3.football.api-sports.io";

const ALLOWED_ENDPOINTS = new Set([
  "fixtures",
  "live",
  "standings",
  "teams",
  "players",
  "topscorers",
  "transfers",
  "leagues",
]);

function getQueryValue(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function isAllowedEndpoint(endpoint) {
  return ALLOWED_ENDPOINTS.has(String(endpoint || ""));
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });

    return;
  }

  const endpoint = getQueryValue(req.query?.endpoint);

  if (!isAllowedEndpoint(endpoint)) {
    res.status(400).json({
      error: "Invalid football endpoint",
    });

    return;
  }

  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    res.status(500).json({
      error: "API_FOOTBALL_KEY is not configured.",
    });

    return;
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(req.query || {})) {
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
        "x-apisports-key": apiKey,
      },
    });

    const body = await response.text();

    res.status(response.status);

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json"
    );

    res.send(body);
  } catch (error) {
    res.status(502).json({
      error: "Football provider unavailable",
      message: error?.message || "Unknown error",
    });
  }
}
