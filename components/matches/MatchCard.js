import React from "react";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAppTheme } from "../../theme/useAppTheme";

const LIVE_STATUSES = [
  "1H",
  "2H",
  "ET",
  "P",
  "LIVE",
];

const FINISHED_STATUSES = [
  "FT",
  "AET",
  "PEN",
];

function formatKickoff(date) {
  if (!date) {
    return "--:--";
  }

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "--:--";
  }

  return value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMatchState(match) {
  if (
    match?.status === "live" ||
    LIVE_STATUSES.includes(match?.shortStatus)
  ) {
    return "live";
  }

  if (
    match?.status === "finished" ||
    FINISHED_STATUSES.includes(match?.shortStatus)
  ) {
    return "finished";
  }

  return "upcoming";
}

function TeamLogo({
  logo,
  colors,
}) {
  if (logo) {
    return (
      <Image
        source={{ uri: logo }}
        style={styles.logo}
        resizeMode="contain"
      />
    );
  }

  return (
    <View
      style={[
        styles.logoFallback,
        {
          backgroundColor: colors.border,
        },
      ]}
    >
      <Ionicons
        name="football-outline"
        size={13}
        color={colors.textSecondary}
      />
    </View>
  );
}

export default function MatchCard({
  match,
}) {
  const { colors } = useAppTheme();

  const state = getMatchState(match);

  const isFinished = state === "finished";
  const isLive = state === "live";

  function openMatch() {
    if (!match?.id) {
      return;
    }

    router.push({
      pathname: "/match/[id]",
      params: {
        id: String(match.id),
      },
    });
  }

  function openTeam(id) {
    if (!id) {
      return;
    }

    router.push({
      pathname: "/team/[id]",
      params: {
        id: String(id),
      },
    });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.72}
      onPress={openMatch}
      style={[
        styles.wrapper,
        {
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.matchRow}>
        {/* DOMICILE */}
        <TouchableOpacity
          activeOpacity={0.72}
          onPress={() =>
            openTeam(match.homeTeamId)
          }
          style={styles.homeTeam}
        >
          <TeamLogo
            logo={match.homeLogo}
            colors={colors}
          />

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.teamName,
              {
                color: colors.text,
                fontWeight:
                  match.homeWinner === true
                    ? "900"
                    : "700",
              },
            ]}
          >
            {match.homeTeam}
          </Text>
        </TouchableOpacity>

        {/* SCORE / HEURE */}
        <View style={styles.result}>
          {isFinished || isLive ? (
            <View style={styles.scoreLine}>
              <Text
                style={[
                  styles.score,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {match.homeScore ??
                  "-"}
              </Text>

              <Text
                style={[
                  styles.separator,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                -
              </Text>

              <Text
                style={[
                  styles.score,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {match.awayScore ??
                  "-"}
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.time,
                {
                  color: colors.text,
                },
              ]}
            >
              {formatKickoff(
                match.date
              )}
            </Text>
          )}
        </View>

        {/* EXTÉRIEUR */}
        <TouchableOpacity
          activeOpacity={0.72}
          onPress={() =>
            openTeam(match.awayTeamId)
          }
          style={styles.awayTeam}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.teamName,
              {
                color: colors.text,
                fontWeight:
                  match.awayWinner === true
                    ? "900"
                    : "700",
              },
            ]}
          >
            {match.awayTeam}
          </Text>

          <TeamLogo
            logo={match.awayLogo}
            colors={colors}
          />
        </TouchableOpacity>

        {/* STATUT */}
        <View
          style={[
            styles.status,
            isLive && styles.liveStatus,
          ]}
        >
          {isLive ? (
            <>
              <View style={styles.liveDot} />

              <Text style={styles.liveText}>
                {match.elapsed !== null &&
                match.elapsed !== undefined
                  ? `${match.elapsed}'`
                  : "LIVE"}
              </Text>
            </>
          ) : isFinished ? (
            <Text
              style={[
                styles.finishedText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              TF
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 62,
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  matchRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  homeTeam: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  awayTeam: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  logo: {
    width: 24,
    height: 24,
    marginHorizontal: 6,
  },

  logoFallback: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  teamName: {
    flexShrink: 1,
    fontSize: 11,
    lineHeight: 15,
  },

  result: {
    width: 62,
    alignItems: "center",
    justifyContent: "center",
  },

  scoreLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  score: {
    minWidth: 17,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900",
  },

  separator: {
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: "800",
  },

  time: {
    fontSize: 12,
    fontWeight: "900",
  },

  status: {
    width: 38,
    height: 28,
    marginLeft: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  liveStatus: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor:
      "rgba(231,71,71,0.10)",
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E74747",
    marginRight: 3,
  },

  liveText: {
    color: "#E74747",
    fontSize: 9,
    fontWeight: "900",
  },

  finishedText: {
    fontSize: 10,
    fontWeight: "900",
  },
});
