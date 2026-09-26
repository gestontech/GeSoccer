import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  process.env.EXPO_PUBLIC_GESOCCER_API_URL || "";

const DEFAULT_TTL = 5 * 60 * 1000;

const CACHE_PREFIX = "gesoccer:api:v1:";

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
      typeof cached.timestamp !== "number"
    ) {
      return null;
    }

    const age = Date.now() - cached.timestamp;

    if (age > cached.ttl) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
}

async function writeCache(key, data, ttl) {
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
    // Le cache ne doit jamais empêcher l'application
    // de fonctionner.
  }
}

function buildUrl(endpoint, params = {}) {
  const base = API_URL.replace(/\/$/, "");

  const query = Object.keys(params)
    .filter(
      (key) =>
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
    )
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          String(params[key])
        )}`
    )
    .join("&");

  return `${base}/football/${endpoint}${
    query ? `?${query}` : ""
  }`;
}

export async function footballRequest(
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

  const key = buildCacheKey(endpoint, params);

  if (!options.forceRefresh) {
    const cached = await readCache(key);

    if (cached !== null) {
      return cached;
    }
  }

  const url = buildUrl(endpoint, params);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let message = "";

    try {
      message = await response.text();
    } catch {
      message = "";
    }

    throw new Error(
      `GeSoccer API ${response.status}${
        message ? `: ${message}` : ""
      }`
    );
  }

  const data = await response.json();

  await writeCache(key, data, ttl);

  return data;
}

export const footballApi = {
  /**
   * Matchs d'une journée.
   *
   * Exemple:
   * footballApi.fixtures({
   *   date: "2026-09-27"
   * })
   */
  fixtures(params = {}, options = {}) {
    return footballRequest(
      "fixtures",
      params,
      {
        ttl: 5 * 60 * 1000,
        ...options,
      }
    );
  },

  /**
   * Matchs actuellement en direct.
   *
   * Cache très court pour limiter les requêtes.
   */
  live(options = {}) {
    return footballRequest(
      "fixtures",
      {
        live: "all",
      },
      {
        ttl: 30 * 1000,
        ...options,
      }
    );
  },

  /**
   * Détails d'un match.
   */
  fixture(id, options = {}) {
    return footballRequest(
      "fixtures",
      {
        id,
      },
      {
        ttl: 60 * 1000,
        ...options,
      }
    );
  },

  /**
   * Classement d'une compétition.
   */
  standings(params = {}, options = {}) {
    return footballRequest(
      "standings",
      params,
      {
        ttl: 60 * 60 * 1000,
        ...options,
      }
    );
  },

  /**
   * Équipes.
   */
  teams(params = {}, options = {}) {
    return footballRequest(
      "teams",
      params,
      {
        ttl: 24 * 60 * 60 * 1000,
        ...options,
      }
    );
  },

  /**
   * Joueurs.
   */
  players(params = {}, options = {}) {
    return footballRequest(
      "players",
      params,
      {
        ttl: 6 * 60 * 60 * 1000,
        ...options,
      }
    );
  },

  /**
   * Meilleurs buteurs.
   */
  topScorers(
    params = {},
    options = {}
  ) {
    return footballRequest(
      "topscorers",
      params,
      {
        ttl: 60 * 60 * 1000,
        ...options,
      }
    );
  },

  /**
   * Transferts d'un joueur ou d'une équipe.
   */
  transfers(
    params = {},
    options = {}
  ) {
    return footballRequest(
      "transfers",
      params,
      {
        ttl: 12 * 60 * 60 * 1000,
        ...options,
      }
    );
  },

  /**
   * Compétitions.
   */
  leagues(
    params = {},
    options = {}
  ) {
    return footballRequest(
      "leagues",
      params,
      {
        ttl: 24 * 60 * 60 * 1000,
        ...options,
      }
    );
  },
};
