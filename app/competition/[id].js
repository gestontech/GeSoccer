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

const CURRENT_SEASON =
  new Date().getFullYear();

function formatDate(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

function MatchRow({
  fixture,
  colors,
  brand,
  onPress,
}) {
  const home =
    fixture?.teams?.home || {};

  const away =
    fixture?.teams?.away || {};

  const goals =
    fixture?.goals || {};

  const finished = [
    "FT",
    "AET",
    "PEN",
  ].includes(
    fixture?.fixture?.status?.short
  );

  const live = [
    "1H",
    "2H",
    "ET",
    "P",
  ].includes(
    fixture?.fixture?.status?.short
  );

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.matchRow,
        {
          borderBottomColor:
            colors.border,
        },
      ]}
    >
      <View style={styles.matchDate}>
        <Text
          style={[
            styles.dateText,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {formatDate(
            fixture?.fixture?.date
          )}
        </Text>

        <Text
          style={[
            styles.roundText,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {fixture?.league
            ?.round || ""}
        </Text>
      </View>

      <View style={styles.teamColumn}>
        <TeamLine
          team={home}
          colors={colors}
        />

        <TeamLine
          team={away}
          colors={colors}
        />
      </View>

      <View style={styles.scoreColumn}>
        <Text
          style={[
            styles.score,
            {
              color: colors.text,
            },
          ]}
        >
          {finished || live
            ? goals.home ?? "-"
            : "-"}
        </Text>

        <Text
          style={[
            styles.score,
            {
              color: colors.text,
            },
          ]}
        >
          {finished || live
            ? goals.away ?? "-"
            : "-"}
        </Text>

        {live ? (
          <Text
            style={[
              styles.live,
              {
                color: brand.red,
              },
            ]}
          >
            LIVE
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function TeamLine({
  team,
  colors,
}) {
  return (
    <View style={styles.teamLine}>
      {team?.logo ? (
        <Image
          source={{
            uri: team.logo,
          }}
          style={styles.teamLogo}
        />
      ) : (
        <Ionicons
          name="football-outline"
          size={19}
          color={
            colors.textSecondary
          }
        />
      )}

      <Text
        numberOfLines={1}
        style={[
          styles.teamName,
          {
            color: colors.text,
          },
        ]}
      >
        {team?.name ||
          "Équipe"}
      </Text>
    </View>
  );
}

function TableRow({
  item,
  colors,
}) {
  const team =
    item?.team || {};

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => {
        if (!team.id) {
          return;
        }

        router.push({
          pathname: "/team/[id]",
          params: {
            id: String(team.id),
          },
        });
      }}
      style={[
        styles.tableRow,
        {
          borderBottomColor:
            colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.rank,
          {
            color: colors.text,
          },
        ]}
      >
        {item?.rank ?? "-"}
      </Text>

      {team.logo ? (
        <Image
          source={{
            uri: team.logo,
          }}
          style={styles.tableLogo}
        />
      ) : (
        <View style={styles.tableLogoSpace} />
      )}

      <Text
        numberOfLines={1}
        style={[
          styles.tableTeam,
          {
            color: colors.text,
          },
        ]}
      >
        {team.name ||
          "Équipe"}
      </Text>

      <Text
        style={[
          styles.tableValue,
          {
            color: colors.text,
          },
        ]}
      >
        {item?.all?.played ??
          0}
      </Text>

      <Text
        style={[
          styles.tableValue,
          {
            color: colors.text,
          },
        ]}
      >
        {item?.all?.win ??
          0}
      </Text>

      <Text
        style={[
          styles.tableValue,
          {
            color: colors.text,
          },
        ]}
      >
        {item?.all?.draw ??
          0}
      </Text>

      <Text
        style={[
          styles.tablePoints,
          {
            color: colors.text,
          },
        ]}
      >
        {item?.points ??
          0}
      </Text>
    </TouchableOpacity>
  );
}

export default function CompetitionDetailsScreen() {
  const { id } =
    useLocalSearchParams();

  const {
    colors,
    brand,
    dark,
  } = useAppTheme();

  const competitionId =
    Array.isArray(id)
      ? id[0]
      : id;

  const [competition, setCompetition] =
    useState(null);

  const [standings, setStandings] =
    useState([]);

  const [fixtures, setFixtures] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadCompetition =
    useCallback(
      async ({
        forceRefresh = false,
      } = {}) => {
        if (!competitionId) {
          setError(
            "Identifiant de compétition manquant."
          );
          setLoading(false);
          return;
        }

        try {
          setError("");

          const [
            leagueResponse,
            standingsResponse,
            fixturesResponse,
          ] = await Promise.all([
            footballApi.leagues(
              {
                id: String(
                  competitionId
                ),
                season:
                  CURRENT_SEASON,
              },
              {
                forceRefresh,
              }
            ),

            footballApi.standings(
              {
                league: String(
                  competitionId
                ),
                season:
                  CURRENT_SEASON,
              },
              {
                forceRefresh,
              }
            ),

            footballApi.fixtures(
              {
                league: String(
                  competitionId
                ),
                season:
                  CURRENT_SEASON,
              },
              {
                forceRefresh,
              }
            ),
          ]);

          const leagueResult =
            Array.isArray(
              leagueResponse?.response
            )
              ? leagueResponse.response[0]
              : null;

          const league =
            leagueResult?.league ||
            leagueResult;

          const leagueId =
            league?.id ||
            competitionId;

          if (
            !league &&
            !standingsResponse?.response
              ?.length &&
            !fixturesResponse?.response
              ?.length
          ) {
            throw new Error(
              "Compétition introuvable."
            );
          }

          setCompetition(
            league || {
              id: leagueId,
            }
          );

          const standingResponse =
            Array.isArray(
              standingsResponse?.response
            )
              ? standingsResponse.response
              : [];

          const allStandings = [];

          standingResponse.forEach(
            (entry) => {
              const groups =
                Array.isArray(
                  entry?.league
                    ?.standings
                )
                  ? entry.league.standings
                  : [];

              groups.forEach(
                (group) => {
                  if (
                    Array.isArray(
                      group
                    )
                  ) {
                    allStandings.push(
                      ...group
                    );
                  }
                }
              );
            }
          );

          setStandings(
            allStandings
          );

          const fixtureResults =
            Array.isArray(
              fixturesResponse?.response
            )
              ? fixturesResponse.response
              : [];

          fixtureResults.sort(
            (a, b) =>
              new Date(
                a?.fixture?.date || 0
              ) -
              new Date(
                b?.fixture?.date || 0
              )
          );

          setFixtures(
            fixtureResults
          );
        } catch (err) {
          setError(
            err?.message ||
              "Impossible de charger la compétition."
          );
        } finally {
          setLoading(false);
        }
      },
      [competitionId]
    );

  useEffect(() => {
    loadCompetition();
  }, [loadCompetition]);

  const refresh =
    useCallback(async () => {
      setRefreshing(true);

      try {
        await loadCompetition({
          forceRefresh: true,
        });
      } finally {
        setRefreshing(false);
      }
    }, [loadCompetition]);

  const upcoming =
    useMemo(
      () =>
        fixtures
          .filter(
            (item) =>
              ![
                "FT",
                "AET",
                "PEN",
              ].includes(
                item?.fixture
                  ?.status?.short
              )
          )
          .slice(0, 15),
      [fixtures]
    );

  const recent =
    useMemo(
      () =>
        fixtures
          .filter(
            (item) =>
              [
                "FT",
                "AET",
                "PEN",
              ].includes(
                item?.fixture
                  ?.status?.short
              )
          )
          .slice(-10)
          .reverse(),
      [fixtures]
    );

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
            styles.loading,
            {
              color: colors.text,
            },
          ]}
        >
          Chargement de la compétition...
        </Text>
      </View>
    );
  }

  if (!competition || error) {
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
          name="trophy-outline"
          size={48}
          color={brand.red}
        />

        <Text
          style={[
            styles.errorTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Compétition indisponible
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
            loadCompetition({
              forceRefresh: true,
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
          <Text style={styles.retryText}>
            Réessayer
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const logo =
    competition.logo;

  const name =
    competition.name ||
    "Compétition";

  const country =
    competition.country ||
    "";

  function openMatch(fixtureId) {
    if (!fixtureId) {
      return;
    }

    router.push({
      pathname: "/match/[id]",
      params: {
        id: String(fixtureId),
      },
    });
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
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            router.back()
          }
          style={[
            styles.back,
            {
              backgroundColor: dark
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
              color: colors.text,
            },
          ]}
        >
          Compétition
        </Text>

        <Pressable
          onPress={refresh}
          style={[
            styles.back,
            {
              backgroundColor: dark
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
            styles.hero,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          {logo ? (
            <Image
              source={{
                uri: logo,
              }}
              style={styles.competitionLogo}
            />
          ) : (
            <View
              style={[
                styles.icon,
                {
                  backgroundColor:
                    brand.green,
                },
              ]}
            >
              <Ionicons
                name="trophy"
                size={42}
                color="#FFFFFF"
              />
            </View>
          )}

          <Text
            style={[
              styles.name,
              {
                color: colors.text,
              },
            ]}
          >
            {name}
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
            {country || "Football"}
            {" · "}
            Saison {CURRENT_SEASON}
          </Text>
        </Glass>

        <Section
          title="Classement"
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
          {standings.length === 0 ? (
            <Empty
              text="Le classement n'est pas disponible pour cette compétition."
              colors={colors}
            />
          ) : (
            <>
              <View
                style={
                  styles.tableHeader
                }
              >
                <Text
                  style={[
                    styles.rank,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  #
                </Text>

                <Text
                  style={[
                    styles.tableTeam,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  Équipe
                </Text>

                <Text
                  style={[
                    styles.tableHeaderValue,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  MJ
                </Text>

                <Text
                  style={[
                    styles.tableHeaderValue,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  V
                </Text>

                <Text
                  style={[
                    styles.tableHeaderValue,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  N
                </Text>

                <Text
                  style={[
                    styles.tableHeaderPoints,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  Pts
                </Text>
              </View>

              {standings.map(
                (item, index) => (
                  <TableRow
                    key={
                      item?.team?.id ||
                      index
                    }
                    item={item}
                    colors={colors}
                  />
                )
              )}
            </>
          )}
        </Glass>

        <Section
          title="Prochains matchs"
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
          {upcoming.length === 0 ? (
            <Empty
              text="Aucun prochain match disponible."
              colors={colors}
            />
          ) : (
            upcoming.map(
              (fixture) => (
                <MatchRow
                  key={
                    fixture?.fixture
                      ?.id
                  }
                  fixture={fixture}
                  colors={colors}
                  brand={brand}
                  onPress={() =>
                    openMatch(
                      fixture
                        ?.fixture
                        ?.id
                    )
                  }
                />
              )
            )
          )}
        </Glass>

        <Section
          title="Derniers résultats"
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
          {recent.length === 0 ? (
            <Empty
              text="Aucun résultat disponible."
              colors={colors}
            />
          ) : (
            recent.map(
              (fixture) => (
                <MatchRow
                  key={
                    fixture?.fixture
                      ?.id
                  }
                  fixture={fixture}
                  colors={colors}
                  brand={brand}
                  onPress={() =>
                    openMatch(
                      fixture
                        ?.fixture
                        ?.id
                    )
                  }
                />
              )
            )
          )}
        </Glass>
      </ScrollView>
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
    <Text
      style={[
        styles.empty,
        {
          color:
            colors.textSecondary,
        },
      ]}
    >
      {text}
    </Text>
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
    padding: 24,
  },

  loading: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
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
    justifyContent: "space-between",
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

  hero: {
    alignItems: "center",
    padding: 28,
    borderRadius: 28,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  competitionLogo: {
    width: 90,
    height: 90,
    marginBottom: 15,
  },

  icon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  name: {
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "900",
  },

  card: {
    padding: 12,
    borderRadius: 24,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  empty: {
    padding: 10,
    lineHeight: 20,
    fontSize: 13,
  },

  tableHeader: {
    minHeight: 35,
    flexDirection: "row",
    alignItems: "center",
  },

  rank: {
    width: 25,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "800",
  },

  tableTeam: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
  },

  tableHeaderValue: {
    width: 28,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "900",
  },

  tableHeaderPoints: {
    width: 38,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "900",
  },

  tableRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth:
      StyleSheet.hairlineWidth,
  },

  tableLogo: {
    width: 25,
    height: 25,
    marginRight: 7,
  },

  tableLogoSpace: {
    width: 25,
    height: 25,
    marginRight: 7,
  },

  tableValue: {
    width: 28,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "700",
  },

  tablePoints: {
    width: 38,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "900",
  },

  matchRow: {
    minHeight: 72,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth:
      StyleSheet.hairlineWidth,
  },

  matchDate: {
    width: 62,
  },

  dateText: {
    fontSize: 10,
    fontWeight: "800",
  },

  roundText: {
    marginTop: 3,
    fontSize: 8,
  },

  teamColumn: {
    flex: 1,
    paddingHorizontal: 7,
  },

  teamLine: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
  },

  teamLogo: {
    width: 21,
    height: 21,
    marginRight: 7,
  },

  teamName: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
  },

  scoreColumn: {
    width: 32,
    alignItems: "center",
  },

  score: {
    fontSize: 13,
    lineHeight: 22,
    fontWeight: "900",
  },

  live: {
    fontSize: 7,
    fontWeight: "900",
  },
});
