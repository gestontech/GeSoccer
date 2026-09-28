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

import { Ionicons } from "@expo/vector-icons";

import MatchCard from "../../components/matches/MatchCard";
import { footballApi } from "../../services/football";
import { useAppTheme } from "../../theme/useAppTheme";
import { getTranslations } from "../../locales/i18n";
import { useDateSelection } from "../../context/DateSelectionContext";

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
      teams?.home?.name || "Équipe domicile",

    awayTeam:
      teams?.away?.name || "Équipe extérieure",

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

function getCompetitionKey(match) {
  return [
    match.leagueId || match.competition,
    match.competition || "Football",
    match.country || "",
  ].join("::");
}

function groupMatchesByCompetition(list) {
  const groups = new Map();

  list.forEach((match) => {
    const key = getCompetitionKey(match);

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        competition:
          match.competition || "Football",
        country:
          match.country || "",
        competitionLogo:
          match.competitionLogo || null,
        leagueId:
          match.leagueId || null,
        season:
          match.season || null,
        round:
          match.round || null,
        matches: [],
      });
    }

    groups.get(key).matches.push(match);
  });

  return Array.from(groups.values());
}

function formatCompetitionTitle(group) {
  if (
    group.competition &&
    group.country
  ) {
    return `${group.competition.toUpperCase()} · ${group.country.toUpperCase()}`;
  }

  return (
    group.competition ||
    "FOOTBALL"
  ).toUpperCase();
}

export default function HomeScreen() {
  const { colors, brand } =
    useAppTheme();

  const { t } =
    getTranslations();

  const {
    selectedDate,
    liveMode,
  } = useDateSelection();

  const [matches, setMatches] =
    useState([]);

  const [liveMatches, setLiveMatches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

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

          const normalized =
            list
              .map(normalizeFixture)
              .filter(isLiveMatch);

          setLiveMatches(
            normalized
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
          if (liveMode) {
            await loadLive({
              forceRefresh,
            });
          } else {
            await loadMatchesForDate({
              forceRefresh,
            });
          }
        } finally {
          setLoading(false);
        }
      },
      [
        liveMode,
        loadLive,
        loadMatchesForDate,
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
    if (!liveMode) {
      return undefined;
    }

    const interval =
      setInterval(() => {
        loadLive({
          forceRefresh: true,
        });
      }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
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
      return [...matches]
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

  const competitionGroups =
    useMemo(
      () =>
        groupMatchesByCompetition(
          displayedMatches
        ),
      [displayedMatches]
    );

  const liveGroups =
    useMemo(
      () =>
        groupMatchesByCompetition(
          liveMatches
        ),
      [liveMatches]
    );

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
            tintColor={
              brand.green
            }
          />
        }
      >
        {/* TITRE DE LA LISTE */}
        <View
          style={
            styles.matchesHeader
          }
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
                : "AUJOURD'HUI"}
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
              {liveMode
                ? "Matchs en direct"
                : t.matches ||
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

        {/* CHARGEMENT */}
        {loading &&
          !hasData && (
            <View
              style={styles.center}
            >
              <ActivityIndicator
                size="large"
                color={
                  brand.green
                }
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

        {/* ERREUR */}
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
                size={34}
                color={
                  brand.red
                }
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
                    forceRefresh: true,
                  })
                }
                style={[
                  styles.retryButton,
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
          )}

        {/* ======================== */}
        {/* EN DIRECT */}
        {/* ======================== */}

        {!loading &&
          liveMode &&
          liveGroups.length > 0 &&
          liveGroups.map(
            (group) => (
              <CompetitionSection
                key={group.key}
                group={group}
                colors={colors}
                brand={brand}
                live
              />
            )
          )}

        {/* ======================== */}
        {/* MATCHS PAR COMPÉTITION */}
        {/* ======================== */}

        {!loading &&
          !liveMode &&
          competitionGroups.map(
            (group) => (
              <CompetitionSection
                key={group.key}
                group={group}
                colors={colors}
                brand={brand}
              />
            )
          )}

        {/* ======================== */}
        {/* AUCUN MATCH EN DIRECT */}
        {/* ======================== */}

        {!loading &&
          liveMode &&
          liveMatches.length === 0 && (
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
                Aucun match en
                direct
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
                actuellement en
                direct.
              </Text>
            </View>
          )}

        {/* ======================== */}
        {/* AUCUN MATCH */}
        {/* ======================== */}

        {!loading &&
          !liveMode &&
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
      </ScrollView>
    </View>
  );
}

function CompetitionSection({
  group,
  colors,
  brand,
  live = false,
}) {
  return (
    <View
      style={styles.competitionSection}
    >
      {/* NOM DE LA COMPÉTITION */}
      <View
        style={
          styles.competitionHeader
        }
      >
        <View
          style={
            styles.competitionTitleWrap
          }
        >
          {group.competitionLogo ? (
            <View
              style={
                styles.competitionLogoWrap
              }
            >
              <Text
                style={{
                  fontSize: 12,
                }}
              >
                ⚽
              </Text>
            </View>
          ) : (
            <View
              style={
                styles.competitionLogoWrap
              }
            >
              <Ionicons
                name="trophy-outline"
                size={14}
                color={
                  brand.green
                }
              />
            </View>
          )}

          <Text
            numberOfLines={1}
            style={[
              styles.competitionTitle,
              {
                color:
                  colors.text,
              },
            ]}
          >
            {formatCompetitionTitle(
              group
            )}
          </Text>
        </View>

        {live && (
          <View
            style={
              styles.liveLabel
            }
          >
            <View
              style={
                styles.liveDot
              }
            />

            <Text
              style={
                styles.liveLabelText
              }
            >
              LIVE
            </Text>
          </View>
        )}
      </View>

      {/* LIGNE DE SÉPARATION */}
      <View
        style={[
          styles.separator,
          {
            backgroundColor:
              colors.border,
          },
        ]}
      />

      {/* MATCHS */}
      {group.matches.map(
        (match) => (
          <MatchCard
            key={match.id}
            match={{
              ...match,
              status: live
                ? "live"
                : isFinished(match)
                ? "finished"
                : "upcoming",
            }}
          />
        )
      )}

      {/* APERÇU DE COMPÉTITION */}
      {group.leagueId && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.competitionPreview,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View
            style={
              styles.previewIcon
            }
          >
            <Ionicons
              name="trophy-outline"
              size={20}
              color={
                brand.green
              }
            />
          </View>

          <View
            style={
              styles.previewTextWrap
            }
          >
            <Text
              style={[
                styles.previewTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {group.competition}
            </Text>

            {group.country ? (
              <Text
                style={[
                  styles.previewCountry,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {group.country}
              </Text>
            ) : null}
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={
              colors.textSecondary
            }
          />
        </TouchableOpacity>
      )}
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

  matchesHeader: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 14,
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

  competitionSection: {
    marginHorizontal: 12,
    marginBottom: 20,
  },

  competitionHeader: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },

  competitionTitleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  competitionLogoWrap: {
    width: 27,
    height: 27,
    borderRadius: 9,
    marginRight: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(75,132,47,0.10)",
  },

  competitionTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  separator: {
    height: 1,
    width: "100%",
    marginTop: 5,
    marginBottom: 6,
  },

  liveLabel: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor:
      "rgba(231,71,71,0.10)",
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor:
      "#E74747",
    marginRight: 4,
  },

  liveLabelText: {
    color: "#E74747",
    fontSize: 8,
    fontWeight: "900",
  },

  competitionPreview: {
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(75,132,47,0.10)",
  },

  previewTextWrap: {
    flex: 1,
    marginLeft: 10,
  },

  previewTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  previewCountry: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "600",
  },

  center: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },

  errorBox: {
    marginHorizontal: 16,
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
    marginTop: 7,
    textAlign: "center",
    lineHeight: 20,
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 14,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  emptyBox: {
    marginHorizontal: 16,
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
