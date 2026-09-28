import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import Glass from "../../components/glass/Glass";

import FavoriteButton from "../../components/FavoriteButton";

import {
  footballApi,
} from "../../services/football";

import {
  useAppTheme,
} from "../../theme/useAppTheme";

const CURRENT_SEASON =
  new Date().getFullYear();

const TABS = [
  ["countries", "Pays"],
  ["competitions", "Compétitions"],
  ["teams", "Équipes"],
  ["players", "Joueurs"],
];

export default function ExploreScreen() {
  const {
    colors,
    brand,
  } = useAppTheme();

  const [
    tab,
    setTab,
  ] = useState("countries");

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    data,
    setData,
  ] = useState({
    countries: [],
    competitions: [],
    teams: [],
    players: [],
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        if (
          tab === "countries" ||
          tab === "competitions"
        ) {
          const response =
            await footballApi.leagues({
              season:
                CURRENT_SEASON,

              ...(query
                ? {
                    search:
                      query,
                  }
                : {}),
            });

          const leagues =
            Array.isArray(
              response?.response
            )
              ? response.response
              : [];

          const countries = [
            ...new Map(
              leagues
                .map((item) => {
                  const country =
                    item.country;

                  if (
                    !country?.name
                  ) {
                    return null;
                  }

                  return [
                    country.name,
                    {
                      id:
                        country.code ||
                        country.name,

                      name:
                        country.name,

                      code:
                        country.code,
                    },
                  ];
                })
                .filter(Boolean)
            ).values(),
          ].slice(0, 80);

          if (active) {
            setData(
              (previous) => ({
                ...previous,
                countries,
                competitions:
                  leagues.slice(
                    0,
                    80
                  ),
              })
            );
          }
        }

        if (tab === "teams") {
          const response =
            await footballApi.teams(
              query
                ? {
                    search:
                      query,
                  }
                : {
                    league: 39,
                    season:
                      CURRENT_SEASON,
                  }
            );

          if (active) {
            setData(
              (previous) => ({
                ...previous,
                teams:
                  Array.isArray(
                    response?.response
                  )
                    ? response.response.slice(
                        0,
                        50
                      )
                    : [],
              })
            );
          }
        }

        if (tab === "players") {
          const response =
            await footballApi.players(
              query
                ? {
                    search:
                      query,
                    season:
                      CURRENT_SEASON,
                  }
                : {
                    league: 39,
                    season:
                      CURRENT_SEASON,
                  }
            );

          if (active) {
            setData(
              (previous) => ({
                ...previous,
                players:
                  Array.isArray(
                    response?.response
                  )
                    ? response.response.slice(
                        0,
                        50
                      )
                    : [],
              })
            );
          }
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
              "Impossible de charger les données."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [tab, query]);

  const items =
    data[tab] || [];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <Text
          style={[
            styles.title,
            {
              color:
                colors.text,
            },
          ]}
        >
          Explorer
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          Pays • Compétitions • Équipes • Joueurs
        </Text>

        <Glass
          intensity={60}
          style={[
            styles.search,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={
              colors.textSecondary
            }
          />

          <TextInput
            value={query}
            onChangeText={
              setQuery
            }
            placeholder="Rechercher"
            placeholderTextColor={
              colors.textSecondary
            }
            style={[
              styles.input,
              {
                color:
                  colors.text,
              },
            ]}
          />
        </Glass>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.tabs
          }
        >
          {TABS.map(
            ([id, label]) => (
              <Pressable
                key={id}
                onPress={() => {
                  setTab(id);
                  setQuery("");
                }}
                style={[
                  styles.pill,
                  {
                    backgroundColor:
                      tab === id
                        ? brand.green
                        : colors.surface,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      tab === id
                        ? "#FFFFFF"
                        : colors.text,
                    fontWeight:
                      "800",
                    fontSize: 12,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            )
          )}
        </ScrollView>

        {loading ? (
          <View
            style={
              styles.center
            }
          >
            <ActivityIndicator
              color={
                brand.green
              }
            />
          </View>
        ) : null}

        {!!error && (
          <Text
            style={[
              styles.error,
              {
                color:
                  brand.red,
              },
            ]}
          >
            {error}
          </Text>
        )}

        {!loading &&
        !items.length &&
        !error ? (
          <Glass
            intensity={55}
            style={[
              styles.empty,
              {
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={30}
              color={
                colors.textSecondary
              }
            />

            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Aucun résultat.
            </Text>
          </Glass>
        ) : null}

        {items.map(
          (item, index) => {
            if (
              tab === "countries"
            ) {
              return (
                <Glass
                  key={item.id}
                  intensity={55}
                  style={[
                    styles.card,
                    {
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.icon,
                      {
                        backgroundColor:
                          `${brand.green}20`,
                      },
                    ]}
                  >
                    <Ionicons
                      name="flag-outline"
                      size={22}
                      color={
                        brand.greenLight
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.info
                    }
                  >
                    <Text
                      style={[
                        styles.name,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={[
                        styles.meta,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}
                    >
                      {item.code ||
                        "Pays"}
                    </Text>
                  </View>
                </Glass>
              );
            }

            if (
              tab ===
              "competitions"
            ) {
              const league =
                item.league ||
                {};

              return (
                <Pressable
                  key={
                    league.id ||
                    index
                  }
                  onPress={() =>
                    router.push(
                      `/competition/${league.id}`
                    )
                  }
                >
                  <Glass
                    intensity={55}
                    style={[
                      styles.card,
                      {
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    {league.logo ? (
                      <Image
                        source={{
                          uri:
                            league.logo,
                        }}
                        style={
                          styles.logo
                        }
                      />
                    ) : (
                      <View
                        style={[
                          styles.icon,
                          {
                            backgroundColor:
                              `${brand.green}20`,
                          },
                        ]}
                      >
                        <Ionicons
                          name="trophy-outline"
                          size={22}
                          color={
                            brand.greenLight
                          }
                        />
                      </View>
                    )}

                    <View
                      style={
                        styles.info
                      }
                    >
                      <Text
                        style={[
                          styles.name,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        {
                          league.name
                        }
                      </Text>

                      <Text
                        style={[
                          styles.meta,
                          {
                            color:
                              colors.textSecondary,
                          },
                        ]}
                      >
                        {
                          item.country
                            ?.name
                        }
                      </Text>
                    </View>

                    <FavoriteButton
                      type="competitions"
                      item={{
                        id:
                          league.id,
                        name:
                          league.name,
                        logo:
                          league.logo,
                        country:
                          item.country
                            ?.name,
                      }}
                    />

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={
                        colors.textSecondary
                      }
                    />
                  </Glass>
                </Pressable>
              );
            }

            if (
              tab === "teams"
            ) {
              const team =
                item.team ||
                {};

              return (
                <Pressable
                  key={
                    team.id ||
                    index
                  }
                  onPress={() =>
                    router.push(
                      `/team/${team.id}`
                    )
                  }
                >
                  <Glass
                    intensity={55}
                    style={[
                      styles.card,
                      {
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    {team.logo ? (
                      <Image
                        source={{
                          uri:
                            team.logo,
                        }}
                        style={
                          styles.logo
                        }
                      />
                    ) : (
                      <View
                        style={[
                          styles.icon,
                          {
                            backgroundColor:
                              `${brand.green}20`,
                          },
                        ]}
                      >
                        <Ionicons
                          name="shield-outline"
                          size={22}
                          color={
                            brand.greenLight
                          }
                        />
                      </View>
                    )}

                    <View
                      style={
                        styles.info
                      }
                    >
                      <Text
                        style={[
                          styles.name,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        {team.name}
                      </Text>

                      <Text
                        style={[
                          styles.meta,
                          {
                            color:
                              colors.textSecondary,
                          },
                        ]}
                      >
                        {
                          team.country
                        }
                      </Text>
                    </View>

                    <FavoriteButton
                      type="teams"
                      item={{
                        id:
                          team.id,
                        name:
                          team.name,
                        logo:
                          team.logo,
                        country:
                          team.country,
                      }}
                    />

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={
                        colors.textSecondary
                      }
                    />
                  </Glass>
                </Pressable>
              );
            }

            const player =
              item.player ||
              {};

            const team =
              item.statistics?.[0]
                ?.team;

            return (
              <Pressable
                key={
                  player.id ||
                  index
                }
                onPress={() =>
                  router.push(
                    `/player/${player.id}`
                  )
                }
              >
                <Glass
                  intensity={55}
                  style={[
                    styles.card,
                    {
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  {player.photo ? (
                    <Image
                      source={{
                        uri:
                          player.photo,
                      }}
                      style={
                        styles.avatar
                      }
                    />
                  ) : (
                    <View
                      style={[
                        styles.icon,
                        {
                          backgroundColor:
                            `${brand.green}20`,
                        },
                      ]}
                    >
                      <Ionicons
                        name="person-outline"
                        size={22}
                        color={
                          brand.greenLight
                        }
                      />
                    </View>
                  )}

                  <View
                    style={
                      styles.info
                    }
                  >
                    <Text
                      style={[
                        styles.name,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {player.name}
                    </Text>

                    <Text
                      style={[
                        styles.meta,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}
                    >
                      {team?.name ||
                        player.nationality ||
                        ""}
                    </Text>
                  </View>

                  <FavoriteButton
                    type="players"
                    item={{
                      id:
                        player.id,
                      name:
                        player.name,
                      logo:
                        player.photo,
                      country:
                        player.nationality,
                    }}
                  />

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={
                      colors.textSecondary
                    }
                  />
                </Glass>
              </Pressable>
            );
          }
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },

  search: {
    height: 50,
    borderRadius: 18,
    marginTop: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    marginLeft: 9,
    fontSize: 14,
  },

  tabs: {
    paddingVertical: 14,
    gap: 8,
  },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  center: {
    padding: 20,
    alignItems: "center",
  },

  error: {
    paddingVertical: 12,
    fontSize: 12,
  },

  empty: {
    padding: 30,
    borderRadius: 22,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 8,
  },

  card: {
    minHeight: 68,
    borderRadius: 20,
    padding: 10,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent:
      "center",
  },

  logo: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  info: {
    flex: 1,
    marginHorizontal: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: "800",
  },

  meta: {
    marginTop: 3,
    fontSize: 11,
  },
});
