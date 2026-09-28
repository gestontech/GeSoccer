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
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import Glass from "../../components/glass/Glass";

import {
  footballApi,
} from "../../services/football";

import {
  useFavorites,
} from "../../context/FavoritesContext";

import {
  useAppTheme,
} from "../../theme/useAppTheme";

const CURRENT_SEASON =
  new Date().getFullYear();

export default function NewsScreen() {
  const {
    colors,
    brand,
  } = useAppTheme();

  const {
    favorites,
  } = useFavorites();

  const [
    tab,
    setTab,
  ] = useState("mine");

  const [
    items,
    setItems,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        if (
          tab === "transfers"
        ) {
          const response =
            await footballApi.transfers(
              {}
            );

          if (active) {
            setItems(
              (
                response?.response ||
                []
              )
                .slice(0, 60)
                .map(
                  (item) => ({
                    kind: "transfer",
                    ...item,
                  })
                )
            );
          }

          return;
        }

        if (
          tab === "competitions"
        ) {
          const response =
            await footballApi.leagues({
              season:
                CURRENT_SEASON,
            });

          if (active) {
            setItems(
              (
                response?.response ||
                []
              )
                .slice(0, 60)
                .map(
                  (item) => ({
                    kind: "competition",
                    ...item,
                  })
                )
            );
          }

          return;
        }

        const date =
          new Date()
            .toISOString()
            .slice(0, 10);

        const response =
          await footballApi.fixtures({
            date,
          });

        let rows =
          response?.response ||
          [];

        if (tab === "mine") {
          const favoriteIds =
            new Set(
              favorites.teams.map(
                (item) =>
                  String(item.id)
              )
            );

          rows =
            rows.filter(
              (item) =>
                favoriteIds.has(
                  String(
                    item.teams
                      ?.home
                      ?.id
                  )
                ) ||
                favoriteIds.has(
                  String(
                    item.teams
                      ?.away
                      ?.id
                  )
                )
            );
        }

        if (
          tab === "featured"
        ) {
          rows =
            rows.slice(
              0,
              20
            );
        }

        if (
          tab === "latest"
        ) {
          rows =
            rows
              .slice()
              .sort(
                (a, b) =>
                  new Date(
                    b.fixture?.date
                  ) -
                  new Date(
                    a.fixture?.date
                  )
              )
              .slice(
                0,
                40
              );
        }

        if (active) {
          setItems(
            rows.map(
              (item) => ({
                kind: "fixture",
                ...item,
              })
            )
          );
        }
      } catch {
        if (active) {
          setItems([]);
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
  }, [
    tab,
    favorites.teams.length,
  ]);

  const tabs = [
    [
      "mine",
      "Mes nouvelles",
    ],
    [
      "featured",
      "Mis en avant",
    ],
    [
      "transfers",
      "Transferts",
    ],
    [
      "latest",
      "Dernières",
    ],
    [
      "competitions",
      "Compétitions",
    ],
  ];

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
          Info
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
          Actualités et informations football
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.tabs
          }
        >
          {tabs.map(
            ([id, label]) => (
              <Pressable
                key={id}
                onPress={() =>
                  setTab(id)
                }
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

        {tab === "mine" &&
        favorites.teams
          .length === 0 ? (
          <Glass
            intensity={55}
            style={[
              styles.notice,
              {
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="star-outline"
              size={28}
              color={
                brand.yellow
              }
            />

            <Text
              style={[
                styles.noticeText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Ajoute des équipes
              aux favoris pour
              personnaliser
              « Mes nouvelles ».
            </Text>
          </Glass>
        ) : null}

        {loading ? (
          <ActivityIndicator
            color={brand.green}
            style={{
              margin: 25,
            }}
          />
        ) : null}

        {!loading &&
        items.length === 0 &&
        !(
          tab === "mine" &&
          favorites.teams
            .length === 0
        ) ? (
          <Text
            style={[
              styles.empty,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Aucune information
            disponible.
          </Text>
        ) : null}

        {items.map(
          (item, index) => {
            if (
              item.kind ===
              "competition"
            ) {
              const league =
                item.league ||
                {};

              return (
                <Pressable
                  key={`league-${league.id || index}`}
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
              item.kind ===
              "transfer"
            ) {
              const player =
                item.player ||
                {};

              return (
                <Pressable
                  key={`transfer-${player.id || index}`}
                  onPress={() => {
                    if (
                      player.id
                    ) {
                      router.push(
                        `/player/${player.id}`
                      );
                    }
                  }}
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
                        name="swap-horizontal-outline"
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
                        {player.name ||
                          "Transfert"}
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
                        {item.transfers?.[0]
                          ?.type ||
                          "Mouvement de joueur"}
                      </Text>
                    </View>

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

            const fixture =
              item.fixture ||
              {};

            const teams =
              item.teams ||
              {};

            const league =
              item.league ||
              {};

            const status =
              fixture.status ||
              {};

            return (
              <Pressable
                key={`fixture-${fixture.id || index}`}
                onPress={() =>
                  router.push(
                    `/match/${fixture.id}`
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
                  <View
                    style={
                      styles.date
                    }
                  >
                    <Text
                      style={[
                        styles.time,
                        {
                          color:
                            brand.greenLight,
                        },
                      ]}
                    >
                      {fixture.date
                        ? new Date(
                            fixture.date
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute:
                                "2-digit",
                            }
                          )
                        : "--:--"}
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
                        status.short
                      }
                    </Text>
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
                      {teams.home
                        ?.name ||
                        "Équipe"}{" "}
                      —{" "}
                      {teams.away
                        ?.name ||
                        "Équipe"}
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
                        league.name
                      }
                    </Text>
                  </View>

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

  tabs: {
    paddingVertical: 14,
    gap: 8,
  },

  pill: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 18,
  },

  notice: {
    padding: 22,
    borderRadius: 22,
    alignItems: "center",
  },

  noticeText: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
  },

  empty: {
    textAlign: "center",
    padding: 30,
  },

  card: {
    minHeight: 70,
    borderRadius: 20,
    padding: 11,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent:
      "center",
  },

  date: {
    width: 55,
  },

  time: {
    fontSize: 12,
    fontWeight: "900",
  },

  info: {
    flex: 1,
    marginHorizontal: 10,
  },

  name: {
    fontSize: 13,
    fontWeight: "800",
  },

  meta: {
    marginTop: 3,
    fontSize: 10,
  },
});
