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

import Glass from "../glass/Glass";
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

  return value.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function getMatchState(match) {
  if (
    match.status === "live" ||
    LIVE_STATUSES.includes(
      match.shortStatus
    )
  ) {
    return "live";
  }

  if (
    match.status === "finished" ||
    FINISHED_STATUSES.includes(
      match.shortStatus
    )
  ) {
    return "finished";
  }

  return "upcoming";
}

function TeamRow({
  name,
  logo,
  score,
  winner,
  colors,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.team}
    >
      {logo ? (
        <Image
          source={{
            uri: logo,
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <View
          style={[
            styles.logoFallback,
            {
              backgroundColor:
                colors.border,
            },
          ]}
        >
          <Ionicons
            name="football-outline"
            size={13}
            color={
              colors.textSecondary
            }
          />
        </View>
      )}

      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.teamName,
          {
            color: colors.text,
            fontWeight:
              winner === true
                ? "900"
                : "700",
          },
        ]}
      >
        {name}
      </Text>

      <Text
        style={[
          styles.score,
          {
            color: colors.text,
          },
        ]}
      >
        {score !== null &&
        score !== undefined
          ? score
          : "-"}
      </Text>
    </TouchableOpacity>
  );
}

export default function MatchCard({
  match,
}) {
  const { colors, brand } =
    useAppTheme();

  const state =
    getMatchState(match);

  const isFinished =
    state === "finished";

  const isLive =
    state === "live";

  function openMatch() {
    if (!match?.id) {
      return;
    }

    router.push({
      pathname:
        "/match/[id]",
      params: {
        id: String(
          match.id
        ),
      },
    });
  }

  function openTeam(id) {
    if (!id) {
      return;
    }

    router.push({
      pathname:
        "/team/[id]",
      params: {
        id: String(id),
      },
    });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={openMatch}
      style={styles.wrapper}
    >
      <Glass
        intensity={35}
        style={[
          styles.card,
          {
            borderColor: isLive
              ? "rgba(231,71,71,0.35)"
              : colors.border,
          },
        ]}
      >
        <View
          style={styles.matchRow}
        >
          {/* ÉQUIPE DOMICILE */}
          <TeamRow
            name={
              match.homeTeam
            }
            logo={
              match.homeLogo
            }
            score={
              match.homeScore
            }
            winner={
              match.homeWinner
            }
            colors={colors}
            onPress={() =>
              openTeam(
                match.homeTeamId
              )
            }
          />

          {/* CENTRE */}
          <View
            style={
              styles.center
            }
          >
            {isFinished ||
            isLive ? (
              <Text
                style={[
                  styles.scoreSeparator,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                -
              </Text>
            ) : (
              <Text
                style={[
                  styles.time,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {formatKickoff(
                  match.date
                )}
              </Text>
            )}
          </View>

          {/* ÉQUIPE EXTÉRIEURE */}
          <TeamRow
            name={
              match.awayTeam
            }
            logo={
              match.awayLogo
            }
            score={
              match.awayScore
            }
            winner={
              match.awayWinner
            }
            colors={colors}
            onPress={() =>
              openTeam(
                match.awayTeamId
              )
            }
          />

          {/* STATUT */}
          <View
            style={[
              styles.statusBox,
              isLive &&
                styles.liveStatusBox,
            ]}
          >
            {isLive ? (
              <>
                <View
                  style={
                    styles.liveDot
                  }
                />

                <Text
                  style={
                    styles.liveText
                  }
                >
                  {match.elapsed !==
                    null &&
                  match.elapsed !==
                    undefined
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
      </Glass>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 5,
  },

  card: {
    minHeight: 57,
    borderRadius: 15,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 7,
    paddingVertical: 6,
  },

  matchRow: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
  },

  team: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 25,
    height: 25,
    marginRight: 6,
  },

  logoFallback: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  teamName: {
    flex: 1,
    minWidth: 0,
    fontSize: 10,
  },

  score: {
    width: 20,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 4,
  },

  center: {
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  scoreSeparator: {
    fontSize: 14,
    fontWeight: "900",
  },

  time: {
    fontSize: 11,
    fontWeight: "900",
  },

  statusBox: {
    width: 28,
    minHeight: 23,
    marginLeft: 3,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  liveStatusBox: {
    width: 38,
    backgroundColor:
      "rgba(231,71,71,0.10)",
    flexDirection: "row",
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor:
      "#E74747",
    marginRight: 3,
  },

  liveText: {
    color: "#E74747",
    fontSize: 8,
    fontWeight: "900",
  },

  finishedText: {
    fontSize: 9,
    fontWeight: "900",
  },
});
