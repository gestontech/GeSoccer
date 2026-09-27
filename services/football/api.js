import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_GESOCCER_API_URL || "";

const CACHE_PREFIX = "gesoccer:football:v2:";
const DEFAULT_TTL = 5 * 60 * 1000;

const CACHE_TTLS = {
  live: 60 * 1000,
  fixtures: 60 * 1000,
  today: 5 * 60 * 1000,
  standings: 60 * 60 * 1000,
  topscorers: 60 * 60 * 1000,
  teams: 24 * 60 * 60 * 1000,
  leagues: 24 * 60 * 60 * 1000,
  players: 6 * 60 * 60 * 1000,
  transfers: 12 * 60 * 60 * 1000,
};

function getTtl(endpoint) {
  return CACHE_TTLS[endpoint] || DEFAULT_TTL;
}

function buildUrl(endpoint, params = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      "EXPO_PUBLIC_GESOCCER_API_URL is not configured."
    );
  }

  const searchParams = new URLSearchParams();

  searchParams.set("endpoint", endpoint);

  for (const [key, value] of Object.entries(params)) {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, String(item));
      }
    } else {
      searchParams.set(key, String(value));
    }
  }

  return `${API_BASE_URL}?${searchParams.toString()}`;
}

async function readCache(cacheKey) {
  try {
    const raw = await AsyncStorage.getItem(cacheKey);

    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw);

    if (
      !cached ||
      typeof cached !== "object" ||
      !cached.timestamp
    ) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return cached;
  } catch {
    return null;
  }
}

async function writeCache(cacheKey, data) {
  try {
    await AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // Cache failures must never break the application.
  }
}

async function requestJson(url) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    const text = await response.text();

    let body;

    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(
        "The football API returned invalid JSON."
      );
    }

    if (!response.ok) {
      const providerMessage =
        body?.message ||
        body?.error ||
        `HTTP ${response.status}`;

      throw new Error(providerMessage);
    }

    if (
      body?.errors &&
      typeof body.errors === "object" &&
      Object.keys(body.errors).length > 0
    ) {
      throw new Error(
        Object.values(body.errors)
          .map(String)
          .join(", ")
      );
    }

    return body;
  } finally {
    clearTimeout(timeout);
  }
}

export async function footballRequest(
  endpoint,
  params = {},
  options = {}
) {
  const {
    forceRefresh = false,
    useCache = true,
  } = options;

  const cacheKey =
    `${CACHE_PREFIX}${endpoint}:` +
    JSON.stringify(params);

  const ttl = getTtl(endpoint);

  if (useCache && !forceRefresh) {
    const cached = await readCache(cacheKey);

    if (cached) {
      const age = Date.now() - cached.timestamp;

      if (age < ttl) {
        return cached.data;
      }
    }
  }

  const url = buildUrl(endpoint, params);

  const data = await requestJson(url);

  if (useCache) {
    await writeCache(cacheKey, data);
  }

  return data;
}

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const footballApi = {
  fixtures(params = {}, options = {}) {
    return footballRequest(
      "fixtures",
      params,
      options
    );
  },

  today(params = {}, options = {}) {
    return footballRequest(
      "fixtures",
      {
        date: getTodayDate(),
        ...params,
      },
      options
    );
  },

  live(params = {}, options = {}) {
    return footballRequest(
      "live",
      params,
      options
    );
  },

  standings(params = {}, options = {}) {
    return footballRequest(
      "standings",
      params,
      options
    );
  },

  teams(params = {}, options = {}) {
    return footballRequest(
      "teams",
      params,
      options
    );
  },

  players(params = {}, options = {}) {
    return footballRequest(
      "players",
      params,
      options
    );
  },

  topscorers(params = {}, options = {}) {
    return footballRequest(
      "topscorers",
      params,
      options
    );
  },

  transfers(params = {}, options = {}) {
    return footballRequest(
      "transfers",
      params,
      options
    );
  },

  leagues(params = {}, options = {}) {
    return footballRequest(
      "leagues",
      params,
      options
    );
  },
};
