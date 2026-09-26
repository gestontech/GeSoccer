const API_FOOTBALL_URL =
  "https://v3.football.api-sports.io";

const ALLOWED_ENDPOINTS = [
  "fixtures",
  "standings",
  "teams",
  "players",
  "topscorers",
  "transfers",
  "leagues",
];

function isAllowedEndpoint(endpoint) {
  return ALLOWED_ENDPOINTS.includes(
    String(endpoint)
  );
}

export default async function handler(
  req,
  res
) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });

    return;
  }

  const endpoint =
    req.query?.endpoint;

  if (!isAllowedEndpoint(endpoint)) {
    res.status(400).json({
      error: "Invalid football endpoint",
    });

    return;
  }

  const apiKey =
    process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    res.status(500).json({
      error:
        "API_FOOTBALL_KEY is not configured.",
    });

    return;
  }

  const params =
    new URLSearchParams();

  for (
    const [key, value] of Object.entries(
      req.query || {}
    )
  ) {
    if (
      key === "endpoint" ||
      value === undefined ||
      value === null
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        params.append(
          key,
          String(item)
        );
      });
    } else {
      params.set(
        key,
        String(value)
      );
    }
  }

  const url =
    `${API_FOOTBALL_URL}/${endpoint}` +
    `?${params.toString()}`;

  try {
    const response =
      await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            "application/json",

          "x-apisports-key":
            apiKey,
        },
      });

    const body =
      await response.text();

    res.status(
      response.status
    );

    res.setHeader(
      "Content-Type",
      response.headers.get(
        "content-type"
      ) ||
        "application/json"
    );

    res.send(body);
  } catch (error) {
    res.status(502).json({
      error:
        "Football provider unavailable",

      message:
        error?.message ||
        "Unknown error",
    });
  }
}
