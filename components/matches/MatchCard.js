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

function getStatusLabel(match) {
  if (
    match.status === "live" ||
    ["1H", "2H", "ET", "P", "LIVE"].includes(
      match.shortStatus
    )
  ) {
    if (
      match.elapsed !== null &&
      match.elapsed !== undefined
    ) {
      return `${match.elapsed}'`;
    }

    return "LIVE";
  }

  if (
    ["FT", "AET", "PEN"].includes(
      match.shortStatus
    )
  ) {
    return "TERMINÉ";
  }

  return formatKickoff(match.date);
}

function Team({
  name,
  logo,
  score,
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
          source={{ uri: logo }}
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
            size={14}
            color={colors.textSecondary}
          />
        </View>
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

  const live =
    match.status === "live" ||
    ["1H", "2H", "ET", "P", "LIVE"].includes(
      match.shortStatus
    );

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
    if (!match?.leagueId) {
      return;
    }

    router.push({
      pathname: "/competition/[id]",
      params: {
        id: String(match.leagueId),
      },
    });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={openMatch}
      style={styles.wrapper}
    >
      <Glass
        intensity={35}
        style={[
          styles.card,
          {
            borderColor: live
              ? "rgba(231,71,71,0.32)"
              : colors.border,
          },
        ]}
      >
        {/* COMPÉTITION + STATUT */}
        <View style={styles.top}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openCompetition}
            style={styles.competition}
          >
            {match.competitionLogo ? (
              <Image
                source={{
                  uri: match.competitionLogo,
                }}
                style={styles.competitionLogo}
                resizeMode="contain"
              />
            ) : (
              <Ionicons
                name="trophy-outline"
                size={13}
                color={colors.textSecondary}
              />
            )}

            <Text
              numberOfLines={1}
              style={[
                styles.competitionText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {match.competition ||
                "Football"}
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.status,
              {
                backgroundColor: live
                  ? "rgba(231,71,71,0.13)"
                  : "rgba(128,128,128,0.10)",
              },
            ]}
          >
            {live && (
              <View
                style={styles.statusDot}
              />
            )}

            <Text
              style={[
                styles.statusText,
                {
                  color: live
                    ? brand.red
                    : colors.textSecondary,
                },
              ]}
            >
              {getStatusLabel(match)}
            </Text>
          </View>
        </View>

        {/* ÉQUIPES */}
        <View style={styles.teams}>
          <Team
            name={match.homeTeam}
            logo={match.homeLogo}
            score={match.homeScore}
            colors={colors}
            onPress={() =>
              openTeam(match.homeTeamId)
            }
          />

          <View style={styles.middle}>
            <Text
              style={[
                styles.vs,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              VS
            </Text>
          </View>

          <Team
            name={match.awayTeam}
            logo={match.awayLogo}
            score={match.awayScore}
            colors={colors}
            onPress={() =>
              openTeam(match.awayTeamId)
            }
          />
        </View>

        {/* BAS DE CARTE */}
        <View
          style={[
            styles.bottom,
            {
              borderTopColor:
                colors.border,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.country,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {match.country || "Football"}
          </Text>

          {/* Aucun texte "Détails" :
              la carte entière reste cliquable */}
          <Ionicons
            name="chevron-forward"
            size={14}
            color={brand.green}
          />
        </View>
      </Glass>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 6,
  },

  card: {
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 8,
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 20,
  },

  competition: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },

  competitionLogo: {
    width: 14,
    height: 14,
    marginRight: 4,
  },

  competitionText: {
    flex: 1,
    fontSize: 9,
    fontWeight: "700",
  },

  status: {
    minHeight: 19,
    paddingHorizontal: 6,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E74747",
    marginRight: 3,
  },

  statusText: {
    fontSize: 8,
    fontWeight: "900",
  },

  teams: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  team: {
    flex: 1,
    alignItems: "center",
  },

  logo: {
    width: 27,
    height: 27,
    marginBottom: 3,
  },

  logoFallback: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },

  teamName: {
    width: "100%",
    textAlign: "center",
    fontSize: 9,
    fontWeight: "800",
  },

  score: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 1,
  },

  middle: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  vs: {
    fontSize: 8,
    fontWeight: "900",
  },

  bottom: {
    marginTop: 6,
    paddingTop: 5,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  country: {
    flex: 1,
    fontSize: 8,
    fontWeight: "600",
  },
});
