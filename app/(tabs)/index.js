import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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

function getCompetitionKey(match) {
  return [
    match.leagueId ||
      match.competition,
    match.competition ||
      "Football",
    match.country || "",
  ].join("::");
}

function groupMatchesByCompetition(
  list
) {
  const groups = new Map();

  list.forEach((match) => {
    const key =
      getCompetitionKey(match);

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        competition:
          match.competition ||
          "Football",
        country:
          match.country || "",
        competitionLogo:
          match.competitionLogo ||
          null,
        leagueId:
          match.leagueId || null,
        season:
          match.season || null,
        round:
          match.round || null,
        matches: [],
      });
    }

    groups
      .get(key)
      .matches.push(match);
  });

  return Array.from(
    groups.values()
  );
}

function formatCompetitionTitle(
  group
) {
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
            list.map(
              normalizeFixture
            )
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
              .map(
                normalizeFixture
              )
              .filter(
                isLiveMatch
              )
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

        {loading &&
          !hasData && (
            <View
              style={styles.loadingContainer}
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

        {!loading &&
          error &&
          !hasData && (
            <View
              style={[
                styles.messageBox,
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
                color={brand.red}
              />

              <Text
                style={[
                  styles.messageTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Impossible de charger
              </Text>

              <Text
                style={[
                  styles.messageText,
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
                  style={styles.retryText}
                >
                  Réessayer
                </Text>
              </TouchableOpacity>
            </View>
          )}

        {!loading &&
          liveMode &&
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

        {!loading &&
          liveMode &&
          liveMatches.length === 0 && (
            <EmptyState
              icon="radio-outline"
              title="Aucun match en direct"
              text="Aucun match n'est actuellement en direct."
              colors={colors}
            />
          )}

        {!loading &&
          !liveMode &&
          !error &&
          displayedMatches.length ===
            0 && (
            <EmptyState
              icon="football-outline"
              title="Aucun match"
              text="Aucun match disponible pour cette date."
              colors={colors}
            />
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
  function openCompetition() {
    if (!group?.leagueId) {
      return;
    }

    router.push({
      pathname:
        "/competition/[id]",
      params: {
        id: String(
          group.leagueId
        ),
      },
    });
  }

  return (
    <View
      style={
        styles.competitionSection
      }
    >
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={openCompetition}
        disabled={!group.leagueId}
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
            <Image
              source={{
                uri: group.competitionLogo,
              }}
              style={
                styles.competitionLogo
              }
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.competitionFallback,
                {
                  backgroundColor:
                    "rgba(75,132,47,0.10)",
                },
              ]}
            >
              <Ionicons
                name="trophy-outline"
                size={15}
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
      </TouchableOpacity>

      <View
        style={[
          styles.separator,
          {
            backgroundColor:
              colors.border,
          },
        ]}
      />

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

      {group.leagueId && (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={openCompetition}
          style={[
            styles.competitionPreview,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          {group.competitionLogo ? (
            <Image
              source={{
                uri: group.competitionLogo,
              }}
              style={
                styles.previewLogo
              }
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.previewFallback,
                {
                  backgroundColor:
                    "rgba(75,132,47,0.10)",
                },
              ]}
            >
              <Ionicons
                name="trophy-outline"
                size={20}
                color={
                  brand.green
                }
              />
            </View>
          )}

          <View
            style={
              styles.previewTextWrap
            }
          >
            <Text
              numberOfLines={1}
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
                numberOfLines={1}
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

function EmptyState({
  icon,
  title,
  text,
  colors,
}) {
  return (
    <View
      style={[
        styles.messageBox,
        {
          backgroundColor:
            colors.surface,
          borderColor:
            colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={40}
        color={colors.textSecondary}
      />

      <Text
        style={[
          styles.messageTitle,
          {
            color: colors.text,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.messageText,
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
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },

  competitionTitleWrap: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  competitionLogo: {
    width: 26,
    height: 26,
    marginRight: 8,
  },

  competitionFallback: {
    width: 26,
    height: 26,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 3,
    marginBottom: 0,
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
    backgroundColor: "#E74747",
    marginRight: 4,
  },

  liveLabelText: {
    color: "#E74747",
    fontSize: 8,
    fontWeight: "900",
  },

  competitionPreview: {
    minHeight: 62,
    marginTop: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  previewLogo: {
    width: 34,
    height: 34,
    marginHorizontal: 4,
  },

  previewFallback: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  previewTextWrap: {
    flex: 1,
    minWidth: 0,
    marginLeft: 9,
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

  loadingContainer: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },

  messageBox: {
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
  },

  messageTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

  messageText: {
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
});
