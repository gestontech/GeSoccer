import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  process.env.EXPO_PUBLIC_GESOCCER_API_URL || "";

const CACHE_PREFIX = "gesoccer:football:v2:";

const DEFAULT_TTL = 5 * 60 * 1000;

function cleanBaseUrl(url) {
  return String(url || "").replace(/\/+$/, "");
}

function buildCacheKey(endpoint, params = {}) {
  const query = Object.keys(params)
    .sort()
    .map(
      (key) =>
        `${key}=${encodeURIComponent(
          String(params[key])
        )}`
    )
    .join("&");

  return `${CACHE_PREFIX}${endpoint}?${query}`;
}

async function readCache(key) {
  try {
    const raw = await AsyncStorage.getItem(key);

    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw);

    if (
      !cached ||
      typeof cached.timestamp !== "number" ||
      typeof cached.ttl !== "number"
    ) {
      return null;
    }

    const age =
      Date.now() - cached.timestamp;

    if (age > cached.ttl) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
}

async function writeCache(
  key,
  data,
  ttl
) {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        ttl,
        data,
      })
    );
  } catch {
    // Le cache ne doit jamais bloquer l'application.
  }
}

function buildUrl(params = {}) {
  const base = cleanBaseUrl(API_URL);

  const query = Object.keys(params)
    .filter(
      (key) =>
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
    )
    .map(
      (key) =>
        `${encodeURIComponent(
          key
        )}=${encodeURIComponent(
          String(params[key])
        )}`
    )
    .join("&");

  return `${base}${query ? `?${query}` : ""}`;
}

function getLocalDate() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function request(
  endpoint,
  params = {},
  options = {}
) {
  if (!API_URL) {
    throw new Error(
      "EXPO_PUBLIC_GESOCCER_API_URL n'est pas configurée."
    );
  }

  const ttl =
    options.ttl !== undefined
      ? options.ttl
      : DEFAULT_TTL;

  const cacheKey = buildCacheKey(
    endpoint,
    params
  );

  if (!options.forceRefresh) {
    const cached =
      await readCache(cacheKey);

    if (cached !== null) {
      return cached;
    }
  }

  const url = buildUrl({
    endpoint,
    ...params,
  });

  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => {
      controller.abort();
    },
    options.timeout || 15000
  );

  try {
    const response =
      await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            "application/json",
        },
        signal:
          controller.signal,
      });

    const text =
      await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        error:
          text ||
          "Réponse invalide du serveur.",
      };
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          data?.message ||
          `GeSoccer API ${response.status}`
      );
    }

    if (
      data &&
      data.errors &&
      Object.keys(data.errors).length > 0
    ) {
      throw new Error(
        Object.values(
          data.errors
        )
          .map(String)
          .join(", ")
      );
    }

    await writeCache(
      cacheKey,
      data,
      ttl
    );

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function footballRequest(
  endpoint,
  params = {},
  options = {}
) {
  return request(
    endpoint,
    params,
    options
  );
}

export const footballApi = {
  fixtures(
    params = {},
    options = {}
  ) {
    return request(
      "fixtures",
      params,
      {
        ttl:
          5 * 60 * 1000,
        ...options,
      }
    );
  },

  today(options = {}) {
    const date =
      options.date ||
      getLocalDate();

    return request(
      "fixtures",
      { date },
      {
        ttl:
          5 * 60 * 1000,
        ...options,
      }
    );
  },

  live(options = {}) {
    return request(
      "fixtures",
      { live: "all" },
      {
        ttl:
          60 * 1000,
        ...options,
      }
    );
  },

  fixture(
    id,
    options = {}
  ) {
    return request(
      "fixtures",
      { id },
      {
        ttl:
          60 * 1000,
        ...options,
      }
    );
  },

  standings(
    params = {},
    options = {}
  ) {
    return request(
      "standings",
      params,
      {
        ttl:
          60 * 60 * 1000,
        ...options,
      }
    );
  },

  teams(
    params = {},
    options = {}
  ) {
    return request(
      "teams",
      params,
      {
        ttl:
          24 * 60 * 60 * 1000,
        ...options,
      }
    );
  },

  players(
    params = {},
    options = {}
  ) {
    return request(
      "players",
      params,
      {
        ttl:
          6 * 60 * 60 * 1000,
        ...options,
      }
    );
  },

  topScorers(
    params = {},
    options = {}
  ) {
    return request(
      "topscorers",
      params,
      {
        ttl:
          60 * 60 * 1000,
        ...options,
      }
    );
  },

  transfers(
    params = {},
    options = {}
  ) {
    return request(
      "transfers",
      params,
      {
        ttl:
          12 * 60 * 60 * 1000,
        ...options,
      }
    );
  },

  leagues(
    params = {},
    options = {}
  ) {
    return request(
      "leagues",
      params,
      {
        ttl:
          24 * 60 * 60 * 1000,
        ...options,
      }
    );
  },
};
