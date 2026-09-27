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

const SKY_BLUE = "#63BFE8";

const MONTHS = [
  "JAN.",
  "FÉV.",
  "MAR.",
  "AVR.",
  "MAI",
  "JUIN",
  "JUIL.",
  "AOÛT",
  "SEPT.",
  "OCT.",
  "NOV.",
  "DÉC.",
];

const WEEKDAYS = [
  "DIM.",
  "LUN.",
  "MAR.",
  "MER.",
  "JEU.",
  "VEN.",
  "SAM.",
];

function formatApiDate(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateKey(date) {
  return formatApiDate(date);
}

function addDays(date, amount) {
  const result = new Date(date);

  result.setDate(
    result.getDate() + amount
  );

  return result;
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

function formatDateLabel(date) {
  return `${WEEKDAYS[date.getDay()]} ${String(
    date.getDate()
  ).padStart(2, "0")} ${MONTHS[date.getMonth()]}`;
}

function createDateItems() {
  const today = new Date();

  const start = addDays(today, -7);
  const end = addDays(today, 7);

  const result = [];

  for (
    let date = start;
    date <= end;
    date = addDays(date, 1)
  ) {
    const key = getDateKey(date);

    result.push({
      key,
      date: new Date(date),
      label: formatDateLabel(date),
      day: date.getDate(),
    });
  }

  return result;
}

export default function HomeScreen() {
  const { colors, brand } =
    useAppTheme();

  const { t } =
    getTranslations();

  const dates = useMemo(
    () => createDateItems(),
    []
  );

  const todayKey = useMemo(
    () => getDateKey(new Date()),
    []
  );

  const [selectedDate, setSelectedDate] =
    useState(todayKey);

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

  const selectedDateObject =
    useMemo(
      () =>
        dates.find(
          (item) =>
            item.key === selectedDate
        )?.date ||
        new Date(),
      [dates, selectedDate]
    );

  const isToday =
    selectedDate === todayKey;

  const loadMatchesForDate =
    useCallback(
      async ({
        forceRefresh = false,
      } = {}) => {
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
      [selectedDate]
    );

  const loadLive =
    useCallback(
      async ({
        forceRefresh = false,
      } = {}) => {
        if (!isToday) {
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
      [isToday]
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
    loadAll,
  ]);

  useEffect(() => {
    const interval =
      setInterval(() => {
        loadLive({
          forceRefresh: true,
        });
      }, 60 * 1000);

    return () =>
      clearInterval(interval);
  }, [loadLive]);

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

  const displayedMatches =
    useMemo(() => {
      const sorted = [
        ...matches,
      ].sort(
        (a, b) =>
          new Date(
            a.date || 0
          ).getTime() -
          new Date(
            b.date || 0
          ).getTime()
      );

      return sorted.filter(
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

  const selectedLabel =
    isToday
      ? "AUJOURD'HUI"
      : formatDateLabel(
          selectedDateObject
        );

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
              SKY_BLUE
            }
          />
        }
      >
        <View
          style={[
            styles.topBlock,
            {
              backgroundColor:
                SKY_BLUE,
            },
          ]}
        >
          <View
            style={styles.topActions}
          >
            <Text
              style={styles.appTitle}
            >
              GeSoccer
            </Text>

            <View
              style={
                styles.topRight
              }
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#FFFFFF"
              />

              <Ionicons
                name="search-outline"
                size={20}
                color="#FFFFFF"
              />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.dateScroller
            }
          >
            {dates.map((item) => {
              const selected =
                item.key ===
                selectedDate;

              const itemIsToday =
                item.key ===
                todayKey;

              const itemIsYesterday =
                item.key ===
                getDateKey(
                  addDays(
                    new Date(),
                    -1
                  )
                );

              const itemIsTomorrow =
                item.key ===
                getDateKey(
                  addDays(
                    new Date(),
                    1
                  )
                );

              let specialLabel = "";

              if (itemIsToday) {
                specialLabel =
                  "AUJOURD'HUI";
              } else if (
                itemIsYesterday
              ) {
                specialLabel =
                  "HIER";
              } else if (
                itemIsTomorrow
              ) {
                specialLabel =
                  "DEMAIN";
              }

              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.8}
                  onPress={() =>
                    setSelectedDate(
                      item.key
                    )
                  }
                  style={[
                    styles.dateItem,
                    selected &&
                      styles.dateItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      selected &&
                        styles.dateTextSelected,
                    ]}
                  >
                    {specialLabel ||
                      item.label}
                  </Text>

                  {selected && (
                    <View
                      style={
                        styles.dateIndicator
                      }
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
              {selectedLabel}
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
            {displayedMatches.length +
              liveMatches.length}
          </Text>
        </View>

        {liveMatches.length >
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
                  color={
                    SKY_BLUE
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
                  style={[
                    styles.retryButton,
                    {
                      backgroundColor:
                        SKY_BLUE,
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
              0 &&
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

  topBlock: {
    paddingTop: 8,
    paddingBottom: 0,
  },

  topActions: {
    minHeight: 74,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  appTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  dateScroller: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },

  dateItem: {
    minWidth: 76,
    height: 42,
    marginHorizontal: 3,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: "center",
    justifyContent:
      "center",
  },

  dateItemSelected: {
    backgroundColor:
      "rgba(255,255,255,0.22)",
  },

  dateText: {
    color:
      "rgba(255,255,255,0.78)",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  dateTextSelected: {
    color: "#FFFFFF",
  },

  dateIndicator: {
    position: "absolute",
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor:
      "#FFFFFF",
  },

  matchesHeader: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent:
      "space-between",
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
    backgroundColor:
      "#E74747",
    marginRight: 8,
  },

  center: {
    minHeight: 180,
    alignItems: "center",
    justifyContent:
      "center",
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
});
