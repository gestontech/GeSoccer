import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "gesoccer:favorites:v1";

const EMPTY_FAVORITES = {
  teams: [],
  players: [],
  competitions: [],
};

const FavoritesContext = createContext(null);

function normalizeItem(item = {}) {
  return {
    id: String(item.id ?? ""),
    name:
      item.name ||
      item.team?.name ||
      item.player?.name ||
      item.league?.name ||
      "Sans nom",

    logo:
      item.logo ||
      item.team?.logo ||
      item.player?.photo ||
      item.league?.logo ||
      null,

    country:
      item.country ||
      item.league?.country ||
      "",
  };
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] =
    useState(EMPTY_FAVORITES);

  const [ready, setReady] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) {
          return;
        }

        try {
          const parsed = raw
            ? JSON.parse(raw)
            : EMPTY_FAVORITES;

          setFavorites({
            teams: Array.isArray(parsed?.teams)
              ? parsed.teams
              : [],

            players: Array.isArray(parsed?.players)
              ? parsed.players
              : [],

            competitions: Array.isArray(
              parsed?.competitions
            )
              ? parsed.competitions
              : [],
          });
        } catch {
          setFavorites(EMPTY_FAVORITES);
        }
      })
      .finally(() => {
        if (mounted) {
          setReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favorites)
    ).catch(() => {});
  }, [favorites, ready]);

  const toggleFavorite = useCallback(
    (type, item) => {
      if (
        !["teams", "players", "competitions"].includes(
          type
        )
      ) {
        return;
      }

      const normalized =
        normalizeItem(item);

      if (!normalized.id) {
        return;
      }

      setFavorites((previous) => {
        const exists =
          previous[type].some(
            (favorite) =>
              String(favorite.id) ===
              normalized.id
          );

        return {
          ...previous,

          [type]: exists
            ? previous[type].filter(
                (favorite) =>
                  String(favorite.id) !==
                  normalized.id
              )
            : [
                ...previous[type],
                normalized,
              ],
        };
      });
    },
    []
  );

  const isFavorite = useCallback(
    (type, id) => {
      if (!id) {
        return false;
      }

      return (
        favorites[type] || []
      ).some(
        (item) =>
          String(item.id) ===
          String(id)
      );
    },
    [favorites]
  );

  const removeFavorite =
    useCallback(
      (type, id) => {
        setFavorites((previous) => ({
          ...previous,

          [type]: previous[type].filter(
            (item) =>
              String(item.id) !==
              String(id)
          ),
        }));
      },
      []
    );

  const clearFavorites =
    useCallback((type) => {
      setFavorites((previous) => ({
        ...previous,
        [type]: [],
      }));
    }, []);

  const value = useMemo(
    () => ({
      favorites,
      ready,
      toggleFavorite,
      isFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [
      favorites,
      ready,
      toggleFavorite,
      isFavorite,
      removeFavorite,
      clearFavorites,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context =
    useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoritesProvider"
    );
  }

  return context;
}
