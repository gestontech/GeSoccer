import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Glass from "../glass/Glass";
import { useAppTheme } from "../../theme/useAppTheme";

export default function MatchCard({ match }) {
  const { colors, dark } = useAppTheme();

  const finished = match.status === "finished";

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/match/[id]",
          params: {
            id: match.id,
          },
        })
      }
      style={({ pressed }) => [
        styles.wrapper,
        pressed && styles.pressed,
      ]}
    >
      <Glass
        intensity={dark ? 35 : 55}
        style={[
          styles.card,
          {
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.top}>
          <Text
            numberOfLines={1}
            style={[
              styles.competition,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {match.competition}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textSecondary}
          />
        </View>

        <View style={styles.teams}>
          <Team
            name={match.homeTeam}
            colors={colors}
            dark={dark}
          />

          <View style={styles.scoreContainer}>
            {finished ? (
              <Text
                style={[
                  styles.score,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {match.homeScore} - {match.awayScore}
              </Text>
            ) : (
              <Text
                style={[
                  styles.time,
                  {
                    color: colors.green,
                  },
                ]}
              >
                {match.time}
              </Text>
            )}
          </View>

          <Team
            name={match.awayTeam}
            colors={colors}
            dark={dark}
          />
        </View>

        <View style={styles.bottom}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: finished
                  ? colors.textSecondary
                  : colors.green,
              },
            ]}
          />

          <Text
            style={[
              styles.status,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {finished ? "Terminé" : "À venir"}
          </Text>
        </View>
      </Glass>
    </Pressable>
  );
}

function Team({
  name,
  colors,
  dark,
}) {
  return (
    <View style={styles.team}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: dark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <Ionicons
          name="football"
          size={20}
          color={colors.green}
        />
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },

  pressed: {
    opacity: 0.78,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  card: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 22,
    padding: 16,
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  competition: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    marginRight: 10,
  },

  teams: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  team: {
    flex: 1,
    alignItems: "center",
  },

  badge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  teamName: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  scoreContainer: {
    minWidth: 80,
    alignItems: "center",
  },

  score: {
    fontSize: 23,
    fontWeight: "900",
  },

  time: {
    fontSize: 17,
    fontWeight: "900",
  },

  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  status: {
    fontSize: 11,
    fontWeight: "700",
  },
});
