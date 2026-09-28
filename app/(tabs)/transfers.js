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
  useAppTheme,
} from "../../theme/useAppTheme";

export default function TransfersScreen() {
  const {
    colors,
    brand,
  } = useAppTheme();

  const [
    tab,
    setTab,
  ] = useState("latest");

  const [
    items,
    setItems,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

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
        const response =
          await footballApi.transfers(
            {}
          );

        const rows =
          Array.isArray(
            response?.response
          )
            ? response.response
            : [];

        const mapped =
          rows
            .map((item) => ({
              ...item,
              transfer:
                item.transfers?.[0] ||
                item.transfer ||
                {},
            }))
            .filter(
              (item) =>
                item.player?.id
            );

        if (active) {
          setItems(mapped);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
              "Impossible de charger les transferts."
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
  }, []);

  const filtered =
    items.filter((item) => {
      const transfer =
        item.transfer || {};

      const text =
        `${transfer.type || ""} ${
          transfer.reason || ""
        }`.toLowerCase();

      if (tab === "official") {
        return /official|completed|signed|transfer/.test(
          text
        );
      }

      if (tab === "rumors") {
        return /rumor|loan|interest|possible/.test(
          text
        );
      }

      return true;
    });

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
          Transferts
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
          Dernières • Officiels • Rumeurs
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
          {[
            [
              "latest",
              "Dernières",
            ],
            [
              "official",
              "Officiels",
            ],
            [
              "rumors",
              "Rumeurs",
            ],
          ].map(
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

        {loading ? (
          <ActivityIndicator
            color={brand.green}
            style={{
              margin: 25,
            }}
          />
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
        !filtered.length &&
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
              name="swap-horizontal-outline"
              size={32}
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
              Aucun transfert disponible
              pour ces critères.
            </Text>
          </Glass>
        ) : null}

        {filtered
          .slice(0, 80)
          .map((item, index) => {
            const player =
              item.player ||
              {};

            const transfer =
              item.transfer ||
              {};

            const from =
              transfer.teams
                ?.out ||
              transfer.from ||
              {};

            const to =
              transfer.teams
                ?.in ||
              transfer.to ||
              {};

            return (
              <Pressable
                key={`${player.id}-${index}`}
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
                      {player.name ||
                        "Joueur"}
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
                      {from.name ||
                        "—"}{" "}
                      →{" "}
                      {to.name ||
                        "—"}
                    </Text>

                    <Text
                      style={[
                        styles.reason,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}
                    >
                      {transfer.type ||
                        transfer.reason ||
                        "Transfert"}
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
          })}
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  card: {
    minHeight: 74,
    borderRadius: 20,
    padding: 10,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  icon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent:
      "center",
  },

  info: {
    flex: 1,
    marginHorizontal: 11,
  },

  name: {
    fontSize: 14,
    fontWeight: "900",
  },

  meta: {
    marginTop: 3,
    fontSize: 11,
  },

  reason: {
    marginTop: 3,
    fontSize: 10,
  },

  error: {
    paddingVertical: 12,
  },

  empty: {
    padding: 28,
    borderRadius: 22,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 13,
  },
});
