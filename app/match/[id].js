import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import Glass from "../../components/glass/Glass";
import { footballApi } from "../../services/football";
import { useAppTheme } from "../../theme/useAppTheme";

function formatDate(value) {
  if (!value) {
    return "Date inconnue";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date inconnue";
  }

  return date.toLocaleDateString(
    [],
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function formatTime(value) {
  if (!value) {
    return "--:--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function isLive(status) {
  return [
    "1H",
    "2H",
    "ET",
    "P",
    "LIVE",
  ].includes(status?.short);
}

function getStatusLabel(status) {
  if (isLive(status)) {
    return status?.elapsed != null
      ? `${status.elapsed}'`
      : "EN DIRECT";
  }

  if (
    ["FT", "AET", "PEN"].includes(
      status?.short
    )
  ) {
    return "TERMINÉ";
  }

  if (status?.short === "HT") {
    return "MI-TEMPS";
  }

  return status?.long || "À venir";
}

export default function MatchDetailsScreen() {
  const { id } =
    useLocalSearchParams();

  const {
    colors,
    brand,
    dark,
  } = useAppTheme();

  const [fixture, setFixture] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadMatch =
    useCallback(
      async ({
        forceRefresh = false,
      } = {}) => {
        if (!id) {
          return;
        }

        try {
          setError("");

          const response =
            await footballApi.fixtures(
              {
                id: String(id),
              },
              {
                forceRefresh,
              }
            );

          const result =
            Array.isArray(
              response?.response
            )
              ? response.response[0]
              : null;

          if (!result) {
            throw new Error(
              "Match introuvable."
            );
          }

          setFixture(result);
        } catch (err) {
          setError(
            err?.message ||
              "Impossible de charger le match."
          );
        } finally {
          setLoading(false);
        }
      },
      [id]
    );

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  useEffect(() => {
    if (
      !fixture ||
      !isLive(
        fixture?.fixture?.status
      )
    ) {
      return undefined;
    }

    const interval =
      setInterval(() => {
        loadMatch({
          forceRefresh: true,
        });
      }, 30 * 1000);

    return () =>
      clearInterval(interval);
  }, [
    fixture,
    loadMatch,
  ]);

  const refresh =
    useCallback(async () => {
      setRefreshing(true);

      try {
        await loadMatch({
          forceRefresh: true,
        });
      } finally {
        setRefreshing(false);
      }
    }, [loadMatch]);

  const home =
    fixture?.teams?.home || {};

  const away =
    fixture?.teams?.away || {};

  const goals =
    fixture?.goals || {};

  const status =
    fixture?.fixture?.status || {};

  const league =
    fixture?.league || {};

  const venue =
    fixture?.fixture?.venue || {};

  const events =
    fixture?.events || [];

  const statistics =
    fixture?.statistics || [];

  const lineups =
    fixture?.lineups || [];

  const homeStats =
    statistics.find(
      (item) =>
        item?.team?.id ===
        home?.id
    );

  const awayStats =
    statistics.find(
      (item) =>
        item?.team?.id ===
        away?.id
    );

  const statRows =
    useMemo(() => {
      const rows =
        homeStats?.statistics ||
        [];

      return rows
        .map((row) => {
          const other =
            awayStats?.statistics?.find(
              (item) =>
                item?.type ===
                row?.type
            );

          return {
            type: row?.type,
            home: row?.value,
            away: other?.value,
          };
        })
        .filter(
          (row) =>
            row.home != null ||
            row.away != null
        );
    }, [
      homeStats,
      awayStats,
    ]);

  function openTeam(teamId) {
    if (!teamId) {
      return;
    }

    router.push({
      pathname: "/team/[id]",
      params: {
        id: String(teamId),
      },
    });
  }

  function openCompetition() {
    if (!league?.id) {
      return;
    }

    router.push({
      pathname:
        "/competition/[id]",
      params: {
        id: String(
          league.id
        ),
      },
    });
  }

  if (loading) {
    return (
      <Centered
        colors={colors}
        brand={brand}
        text="Chargement du match..."
      />
    );
  }

  if (!fixture || error) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color={brand.red}
        />

        <Text
          style={[
            styles.errorTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Match indisponible
        </Text>

        <Text
          style={[
            styles.errorText,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {error ||
            "Impossible de récupérer les informations."}
        </Text>

        <TouchableOpacity
          onPress={() =>
            loadMatch({
              forceRefresh:
                true,
            })
          }
          style={[
            styles.retry,
            {
              backgroundColor:
                brand.green,
            },
          ]}
        >
          <Text
            style={
              styles.retryText
            }
          >
            Réessayer
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
      <View
        style={styles.header}
      >
        <Pressable
          onPress={() =>
            router.back()
          }
          style={[
            styles.back,
            {
              backgroundColor:
                dark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.text}
          />
        </Pressable>

        <Text
          style={[
            styles.headerTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Match
        </Text>

        <Pressable
          onPress={refresh}
          style={[
            styles.back,
            {
              backgroundColor:
                dark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={colors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={refresh}
            tintColor={
              brand.green
            }
          />
        }
      >
        <Glass
          intensity={
            dark ? 35 : 55
          }
          style={[
            styles.scoreCard,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={
              openCompetition
            }
            style={
              styles.competition
            }
          >
            {league.logo ? (
              <Image
                source={{
                  uri: league.logo,
                }}
                style={
                  styles.competitionLogo
                }
              />
            ) : (
              <Ionicons
                name="trophy-outline"
                size={18}
                color={
                  brand.green
                }
              />
            )}

            <Text
              numberOfLines={1}
              style={[
                styles.competitionName,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {league.name ||
                "Football"}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={16}
              color={
                colors.textSecondary
              }
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.date,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {formatDate(
              fixture.fixture?.date
            )}
          </Text>

          <View
            style={styles.teams}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                openTeam(home.id)
              }
              style={
                styles.team
              }
            >
              {home.logo ? (
                <Image
                  source={{
                    uri: home.logo,
                  }}
                  style={
                    styles.teamLogo
                  }
                />
              ) : (
                <View
                  style={[
                    styles.teamFallback,
                    {
                      backgroundColor:
                        colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="football-outline"
                    size={25}
                    color={
                      colors.textSecondary
                    }
                  />
                </View>
              )}

              <Text
                style={[
                  styles.teamName,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {home.name ||
                  "Domicile"}
              </Text>
            </TouchableOpacity>

            <View
              style={
                styles.scoreBox
              }
            >
              <Text
                style={[
                  styles.score,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {goals.home ??
                  "-"}
                {" : "}
                {goals.away ??
                  "-"}
              </Text>

              <Text
                style={[
                  styles.status,
                  {
                    color:
                      isLive(status)
                        ? brand.red
                        : colors.textSecondary,
                  },
                ]}
              >
                {getStatusLabel(
                  status
                )}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                openTeam(away.id)
              }
              style={
                styles.team
              }
            >
              {away.logo ? (
                <Image
                  source={{
                    uri: away.logo,
                  }}
                  style={
                    styles.teamLogo
                  }
                />
              ) : (
                <View
                  style={[
                    styles.teamFallback,
                    {
                      backgroundColor:
                        colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="football-outline"
                    size={25}
                    color={
                      colors.textSecondary
                    }
                  />
                </View>
              )}

              <Text
                style={[
                  styles.teamName,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {away.name ||
                  "Extérieur"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.kickoff,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {formatTime(
              fixture.fixture?.date
            )}
          </Text>
        </Glass>

        <Section
          title="Informations"
          colors={colors}
        />

        <Glass
          intensity={
            dark ? 30 : 50
          }
          style={[
            styles.card,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <InfoRow
            icon="location-outline"
            label="Stade"
            value={
              venue.name ||
              "Non renseigné"
            }
            colors={colors}
          />

          <InfoRow
            icon="business-outline"
            label="Ville"
            value={
              venue.city ||
              "Non renseignée"
            }
            colors={colors}
          />

          <InfoRow
            icon="person-outline"
            label="Arbitre"
            value={
              fixture.fixture
                ?.referee ||
              "Non renseigné"
            }
            colors={colors}
          />
        </Glass>

        <Section
          title="Événements"
          colors={colors}
        />

        {events.length === 0 ? (
          <Empty
            text="Aucun événement disponible."
            colors={colors}
          />
        ) : (
          <Glass
            intensity={
              dark ? 30 : 50
            }
            style={[
              styles.card,
              {
                borderColor:
                  colors.border,
              },
            ]}
          >
            {events.map(
              (event, index) => (
                <View
                  key={`${index}-${event.player?.id || ""}`}
                  style={
                    styles.event
                  }
                >
                  <Text
                    style={[
                      styles.minute,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    {event.time
                      ?.elapsed ??
                      "-"}
                    '
                  </Text>

                  <View
                    style={[
                      styles.eventIcon,
                      {
                        backgroundColor:
                          brand.green,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        event.type ===
                        "subst"
                          ? "swap-horizontal"
                          : event.type ===
                            "Card"
                          ? "square"
                          : "football"
                      }
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>

                  <View
                    style={
                      styles.eventBody
                    }
                  >
                    <Text
                      style={[
                        styles.eventPlayer,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {event.player
                        ?.name ||
                        event.type}
                    </Text>

                    <Text
                      style={[
                        styles.eventDetail,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}
                    >
                      {event.detail ||
                        ""}
                      {event.assist?.name
                        ? ` · ${event.assist.name}`
                        : ""}
                    </Text>
                  </View>
                </View>
              )
            )}
          </Glass>
        )}

        <Section
          title="Statistiques"
          colors={colors}
        />

        {statRows.length === 0 ? (
          <Empty
            text="Les statistiques ne sont pas disponibles."
            colors={colors}
          />
        ) : (
          <Glass
            intensity={
              dark ? 30 : 50
            }
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
                styles.statsHeader
              }
            >
              <Text
                style={[
                  styles.statsTeam,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {home.name}
              </Text>

              <Text
                style={[
                  styles.statsTeam,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {away.name}
              </Text>
            </View>

            {statRows.map(
              (row) => (
                <View
                  key={row.type}
                  style={
                    styles.statRow
                  }
                >
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {row.home ??
                      "-"}
                  </Text>

                  <Text
                    style={[
                      styles.statType,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    {row.type}
                  </Text>

                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {row.away ??
                      "-"}
                  </Text>
                </View>
              )
            )}
          </Glass>
        )}

        <Section
          title="Compositions"
          colors={colors}
        />

        {lineups.length === 0 ? (
          <Empty
            text="Les compositions ne sont pas encore disponibles."
            colors={colors}
          />
        ) : (
          lineups.map(
            (lineup) => (
              <Lineup
                key={
                  lineup.team?.id
                }
                lineup={lineup}
                colors={colors}
              />
            )
          )
        )}
      </ScrollView>
    </View>
  );
}

function Centered({
  colors,
  brand,
  text,
}) {
  return (
    <View
      style={[
        styles.center,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ActivityIndicator
        size="large"
        color={brand.green}
      />

      <Text
        style={[
          styles.loading,
          {
            color:
              colors.textSecondary,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

function Section({
  title,
  colors,
}) {
  return (
    <Text
      style={[
        styles.sectionTitle,
        {
          color: colors.text,
        },
      ]}
    >
      {title}
    </Text>
  );
}

function Empty({
  text,
  colors,
}) {
  return (
    <View
      style={[
        styles.empty,
        {
          backgroundColor:
            colors.surface,
          borderColor:
            colors.border,
        },
      ]}
    >
      <Ionicons
        name="information-circle-outline"
        size={25}
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
        {text}
      </Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  colors,
}) {
  return (
    <View
      style={styles.infoRow}
    >
      <Ionicons
        name={icon}
        size={19}
        color={
          colors.textSecondary
        }
      />

      <View
        style={styles.infoBody}
      >
        <Text
          style={[
            styles.infoLabel,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.infoValue,
            {
              color:
                colors.text,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function Lineup({
  lineup,
  colors,
}) {
  const players =
    lineup?.startXI || [];

  return (
    <Glass
      intensity={30}
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
          styles.lineupHeader
        }
      >
        {lineup.team?.logo && (
          <Image
            source={{
              uri:
                lineup.team.logo,
            }}
            style={
              styles.lineupLogo
            }
          />
        )}

        <Text
          style={[
            styles.lineupName,
            {
              color:
                colors.text,
            },
          ]}
        >
          {lineup.team?.name ||
            "Équipe"}
        </Text>

        <Text
          style={[
            styles.formation,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {lineup.formation ||
            ""}
        </Text>
      </View>

      {players.map(
        (item, index) => {
          const player =
            item?.player || {};

          return (
            <TouchableOpacity
              key={
                player.id ||
                index
              }
              activeOpacity={0.75}
              onPress={() => {
                if (!player.id) {
                  return;
                }

                router.push({
                  pathname:
                    "/player/[id]",
                  params: {
                    id: String(
                      player.id
                    ),
                  },
                });
              }}
              style={
                styles.player
              }
            >
              <Text
                style={[
                  styles.number,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {player.number ??
                  ""}
              </Text>

              <Text
                style={[
                  styles.playerName,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {player.name ||
                  "Joueur"}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={15}
                color={
                  colors.textSecondary
                }
              />
            </TouchableOpacity>
          );
        }
      )}
    </Glass>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  loading: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
  },

  errorTitle: {
    marginTop: 14,
    fontSize: 21,
    fontWeight: "900",
  },

  errorText: {
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
  },

  retry: {
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 15,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  header: {
    height: 70,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  content: {
    padding: 18,
    paddingBottom: 70,
  },

  scoreCard: {
    padding: 20,
    borderRadius: 28,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  competition: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },

  competitionLogo: {
    width: 22,
    height: 22,
    marginRight: 7,
  },

  competitionName: {
    maxWidth: 240,
    fontSize: 14,
    fontWeight: "800",
    marginHorizontal: 6,
  },

  date: {
    textAlign: "center",
    marginTop: 9,
    fontSize: 12,
    textTransform:
      "capitalize",
  },

  teams: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },

  team: {
    flex: 1,
    alignItems: "center",
  },

  teamLogo: {
    width: 68,
    height: 68,
    marginBottom: 10,
  },

  teamFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  teamName: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "900",
  },

  scoreBox: {
    width: 100,
    alignItems: "center",
  },

  score: {
    fontSize: 28,
    fontWeight: "900",
  },

  status: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },

  kickoff: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "800",
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "900",
  },

  card: {
    padding: 17,
    borderRadius: 24,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  infoBody: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
  },

  infoValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "800",
  },

  empty: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    fontSize: 13,
  },

  event: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
  },

  minute: {
    width: 35,
    fontSize: 11,
    fontWeight: "800",
  },

  eventIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  eventBody: {
    flex: 1,
  },

  eventPlayer: {
    fontSize: 13,
    fontWeight: "800",
  },

  eventDetail: {
    marginTop: 2,
    fontSize: 10,
  },

  statsHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 8,
  },

  statsTeam: {
    width: "45%",
    fontSize: 11,
    fontWeight: "900",
  },

  statRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      "rgba(128,128,128,0.18)",
  },

  statValue: {
    width: "25%",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "900",
  },

  statType: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "700",
  },

  lineupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  lineupLogo: {
    width: 30,
    height: 30,
    marginRight: 9,
  },

  lineupName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
  },

  formation: {
    fontSize: 11,
    fontWeight: "800",
  },

  player: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      "rgba(128,128,128,0.18)",
  },

  number: {
    width: 28,
    fontSize: 11,
  },

  playerName: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },
});
