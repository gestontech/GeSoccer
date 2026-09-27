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
            size={18}
            color={
              colors.textSecondary
            }
          />
        </View>
      )}

      <Text
        numberOfLines={2}
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
      pathname:
        "/competition/[id]",
      params: {
        id: String(
          match.leagueId
        ),
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
            borderColor: live
              ? "rgba(231,71,71,0.32)"
              : colors.border,
          },
        ]}
      >
        <View style={styles.top}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={
              openCompetition
            }
            style={styles.competition}
          >
            {match.competitionLogo ? (
              <Image
                source={{
                  uri:
                    match.competitionLogo,
                }}
                style={
                  styles.competitionLogo
                }
              />
            ) : (
              <Ionicons
                name="trophy-outline"
                size={15}
                color={
                  colors.textSecondary
                }
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
                style={
                  styles.statusDot
                }
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

        <View style={styles.teams}>
          <Team
            name={match.homeTeam}
            logo={match.homeLogo}
            score={match.homeScore}
            colors={colors}
            onPress={() =>
              openTeam(
                match.homeTeamId
              )
            }
          />

          <View
            style={styles.middle}
          >
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

            {match.venue && (
              <Text
                numberOfLines={1}
                style={[
                  styles.venue,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {match.venue}
              </Text>
            )}
          </View>

          <Team
            name={match.awayTeam}
            logo={match.awayLogo}
            score={match.awayScore}
            colors={colors}
            onPress={() =>
              openTeam(
                match.awayTeamId
              )
            }
          />
        </View>

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
            {match.country ||
              "Football"}
          </Text>

          <View
            style={styles.details}
          >
            <Text
              style={[
                styles.detailsText,
                {
                  color:
                    brand.green,
                },
              ]}
            >
              Détails
            </Text>

            <Ionicons
              name="chevron-forward"
              size={17}
              color={brand.green}
            />
          </View>
        </View>
      </Glass>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },

  card: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    padding: 15,
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  competition: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  competitionLogo: {
    width: 18,
    height: 18,
    marginRight: 7,
  },

  competitionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },

  status: {
    minHeight: 26,
    paddingHorizontal: 9,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E74747",
    marginRight: 5,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "900",
  },

  teams: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  team: {
    flex: 1,
    alignItems: "center",
  },

  logo: {
    width: 42,
    height: 42,
    marginBottom: 7,
  },

  logoFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  teamName: {
    width: "100%",
    minHeight: 34,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "800",
  },

  score: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 5,
  },

  middle: {
    width: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  vs: {
    fontSize: 10,
    fontWeight: "900",
  },

  venue: {
    width: 58,
    fontSize: 8,
    textAlign: "center",
    marginTop: 5,
  },

  bottom: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  country: {
    flex: 1,
    fontSize: 10,
    fontWeight: "600",
  },

  details: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailsText: {
    fontSize: 11,
    fontWeight: "800",
    marginRight: 2,
  },
});
