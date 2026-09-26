import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Glass from "../../components/glass/Glass";
import MatchCard from "../../components/matches/MatchCard";
import { matches } from "../../data/matches";
import { getTranslations } from "../../locales/i18n";
import { useAppTheme } from "../../theme/useAppTheme";

export default function HomeScreen() {
  const { colors, dark } = useAppTheme();
  const { t } = getTranslations();

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heading}>
        <View>
          <Text
            style={[
              styles.eyebrow,
              {
                color: colors.green,
              },
            ]}
          >
            GE SOCCER
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            {t.matches || "Matchs"}
          </Text>
        </View>

        <View
          style={[
            styles.livePill,
            {
              backgroundColor: dark
                ? "rgba(75,132,47,0.18)"
                : "rgba(75,132,47,0.10)",
            },
          ]}
        >
          <View
            style={[
              styles.liveDot,
              {
                backgroundColor: colors.green,
              },
            ]}
          />

          <Text
            style={[
              styles.liveText,
              {
                color: colors.green,
              },
            ]}
          >
            LIVE
          </Text>
        </View>
      </View>

      <Glass
        intensity={dark ? 40 : 60}
        style={[
          styles.promo,
          {
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.promoTitle,
            {
              color: colors.text,
            },
          ]}
        >
          {t.promotionTitle ||
            "Toute l'actualité football"}
        </Text>

        <Text
          style={[
            styles.promoDescription,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {t.promotionDescription ||
            "Résultats, matchs, équipes et compétitions au même endroit."}
        </Text>
      </Glass>

      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          {t.today || "Aujourd'hui"}
        </Text>

        <Text
          style={[
            styles.sectionCount,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {matches.length} matchs
        </Text>
      </View>

      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 120,
  },

  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  title: {
    marginTop: 3,
    fontSize: 32,
    fontWeight: "900",
  },

  livePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  liveText: {
    fontSize: 10,
    fontWeight: "900",
  },

  promo: {
    borderRadius: 25,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    marginBottom: 22,
  },

  promoTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  promoDescription: {
    marginTop: 6,
    lineHeight: 19,
    fontSize: 13,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
  },

  sectionCount: {
    fontSize: 12,
    fontWeight: "700",
  },
});
