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
import { router } from "expo-router";

import MatchCard from "../../components/matches/MatchCard";
import { footballApi } from "../../services/football";
import { useAppTheme } from "../../theme/useAppTheme";
import { getTranslations } from "../../locales/i18n";

function formatDate(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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
      league?.name ||
      "Football",

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
  const { colors, brand } =
    useAppTheme();

  const { t } =
    getTranslations();

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

  const [lastUpdate, setLastUpdate] =
    useState(null);

  const loadToday = useCallback(
    async ({
      forceRefresh = false,
    } = {}) => {
      try {
        setError("");

        const response =
          await footballApi.today(
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

        setMatches(
          list.map(normalizeFixture)
        );

        setLastUpdate(
          new Date()
        );
      } catch (err) {
        setError(
          err?.message ||
            "Impossible de charger les matchs."
        );
      }
    },
    []
  );

  const loadLive = useCallback(
    async ({
      forceRefresh = false,
    } = {}) => {
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

        setLastUpdate(
          new Date()
        );
      } catch (err) {
        console.log(
          "GeSoccer Live:",
          err?.message
        );
      }
    },
    []
  );

  const loadAll = useCallback(
    async ({
      forceRefresh = false,
    } = {}) => {
      setLoading(true);

      try {
        await Promise.all([
          loadToday({
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
    [loadToday, loadLive]
  );

  useEffect(() => {
    loadAll();

    const interval =
      setInterval(() => {
        loadLive({
          forceRefresh: true,
        });
      }, 60 * 1000);

    return () =>
      clearInterval(interval);
  }, [loadAll, loadLive]);

  const onRefresh =
    useCallback(async () => {
      setRefreshing(true);

      try {
        await loadAll({
          forceRefresh: true,
        });
      } finally {
        setRefreshing(false);
      }
    }, [loadAll]);

  const todayDate = useMemo(
    () => formatDate(new Date()),
    []
  );

  const sortedMatches =
    useMemo(() => {
      return [...matches].sort(
        (a, b) =>
          new Date(a.date || 0).getTime() -
          new Date(b.date || 0).getTime()
      );
    }, [matches]);

  const displayedMatches =
    sortedMatches.filter(
      (match) =>
        !liveMatches.some(
          (live) =>
            live.id === match.id
        )
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
            tintColor={brand.green}
          />
        }
      >
        <View
          style={[
            styles.hero,
            {
              backgroundColor:
                brand.green,
            },
          ]}
        >
          <View
            style={styles.heroTop}
          >
            <View>
              <Text
                style={
                  styles.heroSmall
                }
              >
                {t.homeToday ||
                  "AUJOURD'HUI"}
              </Text>

              <Text
                style={
                  styles.heroTitle
                }
              >
                {t.matches ||
                  "Matchs du jour"}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push(
                  "/calendar"
                )
              }
              style={
                styles.calendarButton
              }
            >
              <Ionicons
                name="calendar-outline"
                size={21}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <Text
            style={styles.heroDate}
          >
            {todayDate}
          </Text>
        </View>

        {liveMatches.length > 0 && (
          <View
            style={styles.section}
          >
            <View
              style={
                styles.sectionHeader
              }
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

              <Text
                style={[
                  styles.counter,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {liveMatches.length}
              </Text>
            </View>

            {liveMatches.map(
              (match) => (
                <MatchCard
                  key={`live-${match.id}`}
                  match={{
                    ...match,
                    status: "live",
                  }}
                />
              )
            )}
          </View>
        )}

        <View
          style={styles.section}
        >
          <View
            style={
              styles.sectionHeader
            }
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {t.matches ||
                "Matchs"}
            </Text>

            <Text
              style={[
                styles.counter,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {displayedMatches.length}
            </Text>
          </View>

          {loading && !hasData && (
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
                Chargement des matchs...
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
                  Impossible de charger
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
                  Aucun match disponible
                  pour aujourd'hui.
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

        {lastUpdate && (
          <Text
            style={[
              styles.lastUpdate,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Mis à jour à{" "}
            {lastUpdate.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </Text>
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
    paddingBottom: 120,
  },

  hero: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    padding: 20,
    borderRadius: 26,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  heroSmall: {
    color:
      "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 4,
  },

  heroDate: {
    color:
      "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
  },

  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor:
      "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    marginHorizontal: 16,
    marginBottom: 22,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: 10,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
  },

  counter: {
    fontSize: 13,
    fontWeight: "800",
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

  lastUpdate: {
    textAlign: "center",
    fontSize: 11,
    marginBottom: 10,
  },
});
