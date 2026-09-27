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

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import Glass from "../../components/glass/Glass";
import {
  footballApi,
} from "../../services/football";
import {
  useAppTheme,
} from "../../theme/useAppTheme";

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

function getStatusLabel(status) {
  const short =
    status?.short || "";

  if (
    ["1H", "2H", "ET", "P", "LIVE"].includes(
      short
    )
  ) {
    if (
      status?.elapsed !== null &&
      status?.elapsed !== undefined
    ) {
      return `${status.elapsed}'`;
    }

    return "EN DIRECT";
  }

  if (
    ["FT", "AET", "PEN"].includes(
      short
    )
  ) {
    return "TERMINÉ";
  }

  if (short === "HT") {
    return "MI-TEMPS";
  }

  return (
    status?.long ||
    "À venir"
  );
}

function EventIcon({
  type,
  detail,
}) {
  let icon = "football-outline";

  if (type === "Card") {
    icon =
      detail === "Yellow Card"
        ? "square"
        : "square";
  }

  if (type === "subst") {
    icon =
      "swap-horizontal";
  }

  if (type === "Goal") {
    icon = "football";
  }

  return (
    <Ionicons
      name={icon}
      size={20}
      color="#FFFFFF"
    />
  );
}

export default function MatchDetailsScreen() {
  const {
    id,
  } = useLocalSearchParams();

  const {
    colors,
    brand,
    dark,
  } = useAppTheme();

  const [
    fixture,
    setFixture,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

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

    const interval =
      setInterval(() => {
        if (
          fixture?.fixture?.status?.short &&
          [
            "1H",
            "2H",
            "ET",
            "P",
            "LIVE",
          ].includes(
            fixture.fixture.status.short
          )
        ) {
          loadMatch({
            forceRefresh: true,
          });
        }
      }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [
    loadMatch,
    fixture?.fixture?.status?.short,
  ]);

  const onRefresh =
    useCallback(
      async () => {
        setRefreshing(true);

        try {
          await loadMatch({
            forceRefresh: true,
          });
        } finally {
          setRefreshing(false);
        }
      },
      [loadMatch]
    );

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

  const referee =
    fixture?.fixture?.referee;

  const events =
    Array.isArray(
      fixture?.events
    )
      ? fixture.events
      : [];

  const statistics =
    Array.isArray(
      fixture?.statistics
    )
      ? fixture.statistics
      : [];

  const lineups =
    Array.isArray(
      fixture?.lineups
    )
      ? fixture.lineups
      : [];

  const homeStats =
    statistics.find(
      (item) =>
        item?.team?.id === home?.id
    );

  const awayStats =
    statistics.find(
      (item) =>
        item?.team?.id === away?.id
    );

  const statRows =
    useMemo(() => {
      const homeValues =
        homeStats?.statistics || [];

      return homeValues
        .map((homeItem) => {
          const awayItem =
            awayStats?.statistics?.find(
              (item) =>
                item?.type ===
                homeItem?.type
            );

          return {
            type: homeItem?.type,
            home:
              homeItem?.value,
            away:
              awayItem?.value,
          };
        })
        .filter(
          (item) =>
            item.home !== null ||
            item.away !== null
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
            styles.loadingText,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          Chargement du match...
        </Text>
      </View>
    );
  }

  if (error || !fixture) {
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
          onPress={onRefresh}
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
            onRefresh={onRefresh}
            tintColor={
              brand.green
            }
          />
        }
      >
        <Glass
          intensity={
            dark ? 38 : 60
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
            activeOpacity={0.7}
            onPress={
              openCompetition
            }
            style={
              styles.leagueButton
            }
          >
            {league.logo ? (
              <Image
                source={{
                  uri: league.logo,
                }}
                style={
                  styles.leagueLogo
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
                styles.leagueName,
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
              fixture.fixture
                ?.date
            )}
          </Text>

          <View
            style={
              styles.scoreTeams
            }
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                openTeam(
                  home.id
                )
              }
              style={styles.scoreTeam}
            >
              {home.logo ? (
                <Image
                  source={{
                    uri: home.logo,
                  }}
                  style={
                    styles.teamLogo
                  }
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={[
                    styles.teamLogoFallback,
                    {
                      backgroundColor:
                        colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="football-outline"
                    size={26}
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
                styles.mainScore
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
                {"  "}
                :
                {"  "}
                {goals.away ??
                  "-"}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      status.short ===
                      "FT"
                        ? "rgba(128,128,128,0.12)"
                        : "rgba(105,169,81,0.14)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color:
                        status.short ===
                        "FT"
                          ? colors.textSecondary
                          : brand.green,
                    },
                  ]}
                >
                  {getStatusLabel(
                    status
                  )}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                openTeam(
                  away.id
                )
              }
              style={styles.scoreTeam}
            >
              {away.logo ? (
                <Image
                  source={{
                    uri: away.logo,
                  }}
                  style={
                    styles.teamLogo
                  }
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={[
                    styles.teamLogoFallback,
                    {
                      backgroundColor:
                        colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="football-outline"
                    size={26}
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
              fixture.fixture
                ?.date
            )}
          </Text>
        </Glass>

        <Glass
          intensity={
            dark ? 30 : 50
          }
          style={[
            styles.infoCard,
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
              venue?.name ||
              "Non renseigné"
            }
            colors={colors}
          />

          <InfoRow
            icon="person-outline"
            label="Arbitre"
            value={
              referee ||
              "Non renseigné"
            }
            colors={colors}
          />

          <InfoRow
            icon="flag-outline"
            label="Pays"
            value={
              league?.country ||
              "Non renseigné"
            }
            colors={colors}
          />
        </Glass>

        <SectionTitle
          title="Événements"
          colors={colors}
        />

        {events.length === 0 ? (
          <EmptyCard
            text="Aucun événement disponible pour ce match."
            colors={colors}
          />
        ) : (
          <Glass
            intensity={
              dark ? 30 : 50
            }
            style={[
              styles.eventsCard,
              {
                borderColor:
                  colors.border,
              },
            ]}
          >
            {events.map(
              (event, index) => (
                <View
                  key={`${event.time?.elapsed || 0}-${event.player?.id || index}`}
                  style={
                    styles.eventRow
                  }
                >
                  <Text
                    style={[
                      styles.eventTime,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    {event.time?.elapsed ??
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
                    <EventIcon
                      type={
                        event.type
                      }
                      detail={
                        event.detail
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.eventContent
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
                        "Événement"}
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
                        event.type ||
                        ""}
                      {event.assist?.name
                        ? ` · Passe : ${event.assist.name}`
                        : ""}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.eventTeam,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    {event.team
                      ?.name ||
                      ""}
                  </Text>
                </View>
              )
            )}
          </Glass>
        )}

        <SectionTitle
          title="Statistiques"
          colors={colors}
        />

        {statRows.length === 0 ? (
          <EmptyCard
            text="Les statistiques ne sont pas disponibles pour ce match."
            colors={colors}
          />
        ) : (
          <Glass
            intensity={
              dark ? 30 : 50
            }
            style={[
              styles.statsCard,
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
                numberOfLines={1}
                style={[
                  styles.statsTeam,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {home.name ||
                  "Domicile"}
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
                {away.name ||
                  "Extérieur"}
              </Text>
            </View>

            {statRows.map(
              (stat) => (
                <StatRow
                  key={stat.type}
                  stat={stat}
                  colors={colors}
                  brand={brand}
                />
              )
            )}
          </Glass>
        )}

        <SectionTitle
          title="Compositions"
          colors={colors}
        />

        {lineups.length === 0 ? (
          <EmptyCard
            text="Les compositions ne sont pas encore disponibles."
            colors={colors}
          />
        ) : (
          lineups.map(
            (lineup) => (
              <LineupCard
                key={
                  lineup.team?.id
                }
                lineup={
                  lineup
                }
                colors={
                  colors
                }
                brand={
                  brand
                }
              />
            )
          )
        )}
      </ScrollView>
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
        color={colors.textSecondary}
      />

      <View
        style={styles.infoText}
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
          numberOfLines={2}
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

function SectionTitle({
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

function EmptyCard({
  text,
  colors,
}) {
  return (
    <View
      style={[
        styles.emptyCard,
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

function StatRow({
  stat,
  colors,
  brand,
}) {
  return (
    <View
      style={styles.statRow}
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
        {stat.home ?? "-"}
      </Text>

      <View
        style={
          styles.statCenter
        }
      >
        <Text
          style={[
            styles.statLabel,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {stat.type}
        </Text>
      </View>

      <Text
        style={[
          styles.statValue,
          {
            color:
              colors.text,
          },
        ]}
      >
        {stat.away ?? "-"}
      </Text>
    </View>
  );
}

function LineupCard({
  lineup,
  colors,
  brand,
}) {
  const players =
    Array.isArray(
      lineup?.startXI
    )
      ? lineup.startXI
      : [];

  return (
    <Glass
      intensity={30}
      style={[
        styles.lineupCard,
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
        {lineup.team?.logo ? (
          <Image
            source={{
              uri:
                lineup.team.logo,
            }}
            style={
              styles.lineupLogo
            }
          />
        ) : null}

        <Text
          style={[
            styles.lineupTeam,
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
                brand.green,
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
            item?.player ||
            {};

          return (
            <TouchableOpacity
              key={
                player.id ||
                index
              }
              activeOpacity={0.75}
              onPress={() => {
                if (
                  !player.id
                ) {
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
                styles.playerRow
              }
            >
              <Text
                style={[
                  styles.playerNumber,
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

  loadingText: {
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
    paddingBottom: 60,
  },

  scoreCard: {
    padding: 20,
    borderRadius: 28,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  leagueButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },

  leagueLogo: {
    width: 22,
    height: 22,
    marginRight: 7,
  },

  leagueName: {
    fontSize: 14,
    fontWeight: "800",
    maxWidth: 250,
  },

  date: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    textTransform:
      "capitalize",
  },

  scoreTeams: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },

  scoreTeam: {
    flex: 1,
    alignItems: "center",
  },

  teamLogo: {
    width: 68,
    height: 68,
    marginBottom: 10,
  },

  teamLogoFallback: {
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

  mainScore: {
    width: 105,
    alignItems: "center",
  },

  score: {
    fontSize: 29,
    fontWeight: "900",
  },

  statusBadge: {
    marginTop: 9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  statusBadgeText: {
    fontSize: 10,
    fontWeight: "900",
  },

  kickoff: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
    fontWeight: "800",
  },

  infoCard: {
    marginTop: 14,
    padding: 18,
    borderRadius: 24,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  infoText: {
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

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "900",
  },

  eventsCard: {
    padding: 16,
    borderRadius: 24,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  eventRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
  },

  eventTime: {
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

  eventContent: {
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

  eventTeam: {
    maxWidth: 75,
    fontSize: 9,
    textAlign: "right",
  },

  statsCard: {
    padding: 16,
    borderRadius: 24,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  statsHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 8,
  },

  statsTeam: {
    width: "42%",
    fontSize: 11,
    fontWeight: "900",
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      "rgba(128,128,128,0.18)",
  },

  statValue: {
    width: "25%",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },

  statCenter: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },

  lineupCard: {
    padding: 16,
    borderRadius: 24,
    borderWidth:
      StyleSheet.hairlineWidth,
    marginBottom: 10,
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

  lineupTeam: {
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
  },

  formation: {
    fontSize: 11,
    fontWeight: "900",
  },

  playerRow: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      "rgba(128,128,128,0.18)",
  },

  playerNumber: {
    width: 28,
    fontSize: 11,
    fontWeight: "700",
  },

  playerName: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },

  emptyCard: {
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
});
