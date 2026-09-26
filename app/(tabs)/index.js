import React from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  router,
} from "expo-router";

import Glass from "../../components/glass/Glass";

import { useAppTheme } from "../../theme/useAppTheme";

export default function MatchesScreen() {
  const { dark, colors, brand } =
    useAppTheme();

  const matches = [
    {
      id: "slovenia-scotland",
      home: "Slovenia",
      away: "Scotland",
      homeScore: "0",
      awayScore: "0",
    },

    {
      id: "faroe-kazakhstan",
      home: "Faroe Islands",
      away: "Kazakhstan",
      homeScore: "1",
      awayScore: "1",
    },

    {
      id: "iceland-estonia",
      home: "Iceland",
      away: "Estonia",
      homeScore: "1",
      awayScore: "1",
    },

    {
      id: "san-marino-finland",
      home: "San Marino",
      away: "Finland",
      homeScore: "0",
      awayScore: "7",
    },

    {
      id: "bulgaria-luxembourg",
      home: "Bulgaria",
      away: "Luxembourg",
      homeScore: "1",
      awayScore: "2",
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        styles.content
      }
    >
      <Glass
        intensity={45}
        style={styles.promotion}
      >
        <Text
          style={[
            styles.promotionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Toute l'actualité du football
        </Text>

        <Text
          style={[
            styles.promotionDescription,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          Scores • Résultats • Classements
          {" • "}Transferts
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.promotionButton,
            {
              backgroundColor:
                brand.yellow,
            },
          ]}
          onPress={() =>
            router.push("/explore")
          }
        >
          <Text
            style={[
              styles.promotionButtonText,
              {
                color: brand.green,
              },
            ]}
          >
            Découvrir GeSoccer
          </Text>
        </TouchableOpacity>
      </Glass>

      <Glass
        intensity={30}
        style={styles.competition}
      >
        <View
          style={[
            styles.trophy,
            {
              backgroundColor:
                "rgba(75,132,47,0.12)",
            },
          ]}
        >
          <Text style={styles.trophyText}>
            🏆
          </Text>
        </View>

        <Text
          style={[
            styles.competitionText,
            {
              color: colors.text,
            },
          ]}
        >
          UEFA NATIONS LEAGUE
        </Text>
      </Glass>

      {matches.map((match) => (
        <TouchableOpacity
          key={match.id}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname:
                "/match/[id]",
              params: {
                id: match.id,
              },
            })
          }
        >
          <View
            style={[
              styles.match,
              {
                backgroundColor:
                  dark
                    ? "rgba(30,30,30,0.72)"
                    : "rgba(255,255,255,0.80)",

                borderBottomColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={styles.team}
            >
              <Text
                style={[
                  styles.teamName,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {match.home}
              </Text>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      brand.green,
                  },
                ]}
              >
                <Text
                  style={styles.badgeText}
                >
                  {match.home[0]}
                </Text>
              </View>
            </View>

            <View
              style={styles.score}
            >
              <Text
                style={[
                  styles.scoreText,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {match.homeScore}
                {" - "}
                {match.awayScore}
              </Text>

              <Text
                style={[
                  styles.ft,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                FIN
              </Text>
            </View>

            <View
              style={[
                styles.team,
                styles.away,
              ]}
            >
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      brand.greenLight,
                  },
                ]}
              >
                <Text
                  style={styles.badgeText}
                >
                  {match.away[0]}
                </Text>
              </View>

              <Text
                style={[
                  styles.teamName,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {match.away}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View
        style={styles.bottomSpace}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 1,
    paddingBottom: 20,
  },

  promotion: {
    margin: 12,
    borderRadius: 20,
    padding: 16,
  },

  promotionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  promotionDescription: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
  },

  promotionButton: {
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  promotionButtonText: {
    fontSize: 16,
    fontWeight: "900",
  },

  competition: {
    marginHorizontal: 10,
    height: 70,
    borderRadius: 18,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  trophy: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  trophyText: {
    fontSize: 20,
  },

  competitionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "900",
  },

  match: {
    minHeight: 105,
    marginHorizontal: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },

  team: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  away: {
    justifyContent: "flex-start",
  },

  teamName: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "right",
  },

  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  score: {
    width: 88,
    alignItems: "center",
  },

  scoreText: {
    fontSize: 24,
    fontWeight: "700",
  },

  ft: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },

  bottomSpace: {
    height: 20,
  },
});
