import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
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

import MatchCard from "../../components/matches/MatchCard";
import GeSoccerLogo from "../../components/logo/GeSoccerLogo";

import {
  footballApi,
} from "../../services/football";

import {
  useAppTheme,
} from "../../theme/useAppTheme";

import {
  getTranslations,
} from "../../locales/i18n";

import {
  useDateSelection,
} from "../../context/DateSelectionContext";

function normalizeFixture(item) {
  const fixture = item?.fixture || {};
  const teams = item?.teams || {};
  const goals = item?.goals || {};
  const league = item?.league || {};
  const status = fixture?.status || {};

  return {
    id: String(
      fixture.id ||
        `${teams?.home?.id || "home"}-${teams?.away?.id || "away"}`
    ),

    homeTeam:
      teams?.home?.name ||
      "Équipe domicile",

    awayTeam:
      teams?.away?.name ||
      "Équipe extérieure",

    homeTeamId:
      teams?.home?.id || null,

    awayTeamId:
      teams?.away?.id || null,

    homeWinner:
      teams?.home?.winner ?? null,

    awayWinner:
      teams?.away?.winner ?? null,

    homeLogo:
      teams?.home?.logo || null,

    awayLogo:
      teams?.away?.logo || null,

    homeScore:
      goals?.home ?? null,

    awayScore:
      goals?.away ?? null,

    halftimeHome:
      goals?.halftime?.home ?? null,

    halftimeAway:
      goals?.halftime?.away ?? null,

    competition:
      league?.name || "Football",

    leagueId:
      league?.id || null,

    competitionLogo:
      league?.logo || null,

    country:
      league?.country || "",

    season:
      league?.season || null,

    round:
      league?.round || null,

    date:
      fixture?.date || null,

    timestamp:
      fixture?.timestamp || null,

    timezone:
      fixture?.timezone || null,

    elapsed:
      status?.elapsed ?? null,

    shortStatus:
      status?.short || "",

    longStatus:
      status?.long || "",

    venue:
      fixture?.venue?.name || null,

    venueId:
      fixture?.venue?.id || null,

    city:
      fixture?.venue?.city || null,

    referee:
      fixture?.referee || null,
  };
}

function isLiveMatch(match) {
  return [
    "1H",
    "2H",
    "ET",
    "P",
    "LIVE",
  ].includes(match.shortStatus);
}

function isFinished(match) {
  return [
    "FT",
    "AET",
    "PEN",
  ].includes(match.shortStatus);
}

export default function HomeScreen() {
  const {
    colors,
    brand,
  } = useAppTheme();

  const { t } = getTranslations();

  const {
    selectedDate,
    liveMode,
  } = useDateSelection();

  const [
    matches,
    setMatches,
  ] = useState([]);

  const [
    liveMatches,
    setLiveMatches,
  ] = useState([]);

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

  const loadMatchesForDate =
    useCallback(
      async ({
        forceRefresh = false,
      } = {}) => {
        if (liveMode) {
          setMatches([]);
          return;
        }

        try {
          setError("");

          const response =
            await footballApi.fixtures(
              {
                date: selectedDate,
              },
              {
                forceRefresh,
              }
            );

          const list =
            Array.isArray(
              response?.response
            )
              ? response.response
              : [];

          setMatches(
            list.map(normalizeFixture)
          );
        } catch (err) {
          setMatches([]);

          setError(
            err?.message ||
              "Impossible de charger les matchs."
          );
        }
      },
      [
        selectedDate,
        liveMode,
      ]
    );

  const loadLive =
    useCallback(
      async ({
        forceRefresh = false,
      } = {}) => {
        if (!liveMode) {
          setLiveMatches([]);
          return;
        }

        try {
          const response =
            await footballApi.live(
              {},
              {
                forceRefresh,
              }
            );

          const list =
            Array.isArray(
              response?.response
            )
              ? response.response
              : [];

          setLiveMatches(
            list
              .map(normalizeFixture)
              .filter(isLiveMatch)
          );
        } catch {
          setLiveMatches([]);
        }
      },
      [liveMode]
    );

  const loadAll =
    useCallback(
      async ({
        forceRefresh = false,
      } = {}) => {
        setLoading(true);

        try {
          await Promise.all([
            loadMatchesForDate({
              forceRefresh,
            }),

            loadLive({
              forceRefresh,
            }),
          ]);
        } finally {
          setLoading(false);
        }
      },
      [
        loadMatchesForDate,
        loadLive,
      ]
    );

  useEffect(() => {
    loadAll();
  }, [
    selectedDate,
    liveMode,
    loadAll,
  ]);

  useEffect(() => {
    const interval =
      setInterval(() => {
        if (liveMode) {
          loadLive({
            forceRefresh: true,
          });
        }
      }, 60 * 1000);

    return () =>
      clearInterval(interval);
  }, [
    liveMode,
    loadLive,
  ]);

  const onRefresh =
    useCallback(
      async () => {
        setRefreshing(true);

        try {
          await loadAll({
            forceRefresh: true,
          });
        } finally {
          setRefreshing(false);
        }
      },
      [loadAll]
    );

  const displayedMatches =
    useMemo(() => {
      return [
        ...matches,
      ]
        .sort(
          (a, b) =>
            new Date(
              a.date || 0
            ).getTime() -
            new Date(
              b.date || 0
            ).getTime()
        )
        .filter(
          (match) =>
            !liveMatches.some(
              (live) =>
                live.id === match.id
            )
        );
    }, [
      matches,
      liveMatches,
    ]);

  const hasData =
    liveMatches.length > 0 ||
    displayedMatches.length > 0;

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
          styles.scrollContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#63BFE8"
          />
        }
      >
        {/* Logo GeSoccer */}
        <View style={styles.logoArea}>
          <GeSoccerLogo
            size={82}
            showShadow
          />
        </View>

        <View
          style={styles.matchesHeader}
        >
          <View>
            <Text
              style={[
                styles.matchesSmall,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {liveMode
                ? "EN DIRECT"
                : "MATCHS"}
            </Text>

            <Text
              style={[
                styles.matchesTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {t.matches ||
                "Matchs"}
            </Text>
          </View>

          <Text
            style={[
              styles.counter,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {liveMode
              ? liveMatches.length
              : displayedMatches.length}
          </Text>
        </View>

        {liveMode &&
          liveMatches.length >
            0 && (
            <View
              style={styles.section}
            >
              <View
                style={
                  styles.sectionTitleRow
                }
              >
                <View
                  style={styles.liveDot}
                />

                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {t.live ||
                    "En direct"}
                </Text>
              </View>

              {liveMatches.map(
                (match) => (
                  <MatchCard
                    key={`live-${match.id}`}
                    match={{
                      ...match,
                      status:
                        "live",
                    }}
                  />
                )
              )}
            </View>
          )}

        {!liveMode && (
          <View
            style={styles.section}
          >
            {loading &&
              !hasData && (
                <View
                  style={styles.center}
                >
                  <ActivityIndicator
                    size="large"
                    color="#63BFE8"
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
                    Chargement des
                    matchs...
                  </Text>
                </View>
              )}

            {!loading &&
              error &&
              !hasData && (
                <View
                  style={[
                    styles.errorBox,
                    {
                      backgroundColor:
                        colors.surface,
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="cloud-offline-outline"
                    size={32}
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
                    Impossible de
                    charger
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
                    {error}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      loadAll({
                        forceRefresh:
                          true,
                      })
                    }
                    style={
                      styles.retryButton
                    }
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
              )}

            {!loading &&
              !error &&
              displayedMatches.length ===
                0 && (
                <View
                  style={[
                    styles.emptyBox,
                    {
                      backgroundColor:
                        colors.surface,
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="football-outline"
                    size={40}
                    color={
                      colors.textSecondary
                    }
                  />

                  <Text
                    style={[
                      styles.emptyTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    Aucun match
                  </Text>

                  <Text
                    style={[
                      styles.emptyText,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    Aucun match
                    disponible pour
                    cette date.
                  </Text>
                </View>
              )}

            {displayedMatches.map(
              (match) => (
                <MatchCard
                  key={match.id}
                  match={{
                    ...match,
                    status:
                      isFinished(match)
                        ? "finished"
                        : "upcoming",
                  }}
                />
              )
            )}
          </View>
        )}

        {liveMode &&
          !loading &&
          liveMatches.length ===
            0 && (
            <View
              style={[
                styles.emptyBox,
                {
                  backgroundColor:
                    colors.surface,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="radio-outline"
                size={40}
                color={
                  colors.textSecondary
                }
              />

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Aucun match en direct
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                Aucun match n'est
                actuellement en direct.
              </Text>
            </View>
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 4,
    paddingBottom: 120,
  },

  logoArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 4,
  },

  matchesHeader: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  matchesSmall: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  matchesTitle: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "900",
  },

  counter: {
    fontSize: 13,
    fontWeight: "800",
  },

  section: {
    marginHorizontal: 16,
    marginBottom: 22,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  liveDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E74747",
    marginRight: 8,
  },

  center: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },

  errorBox: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },

  errorTitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "800",
  },

  errorText: {
    textAlign: "center",
    marginTop: 7,
    lineHeight: 20,
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: "#63BFE8",
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  emptyBox: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },
});
