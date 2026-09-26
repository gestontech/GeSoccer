import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import Glass from "../../components/glass/Glass";
import { useAppTheme } from "../../theme/useAppTheme";

export default function TeamDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors, dark } = useAppTheme();

  const teamName = String(id || "team")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              backgroundColor: dark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.text}
          />
        </Pressable>

        <Text
          style={[
            styles.headerTitle,
            { color: colors.text },
          ]}
        >
          Équipe
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Glass
          intensity={dark ? 35 : 55}
          style={[
            styles.hero,
            { borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.logo,
              {
                backgroundColor: dark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Ionicons
              name="football"
              size={42}
              color={colors.green}
            />
          </View>

          <Text
            style={[
              styles.teamName,
              { color: colors.text },
            ]}
          >
            {teamName}
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            Informations de l'équipe
          </Text>
        </Glass>

        <View style={styles.grid}>
          <Stat title="Matchs" value="0" colors={colors} />
          <Stat title="Victoires" value="0" colors={colors} />
          <Stat title="Nuls" value="0" colors={colors} />
          <Stat title="Défaites" value="0" colors={colors} />
        </View>

        <Glass
          intensity={dark ? 30 : 50}
          style={[
            styles.section,
            { borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Prochains matchs
          </Text>

          <Text
            style={[
              styles.empty,
              { color: colors.textSecondary },
            ]}
          >
            Aucun match disponible pour le moment.
          </Text>
        </Glass>
      </ScrollView>
    </View>
  );
}

function Stat({ title, value, colors }) {
  return (
    <View
      style={[
        styles.stat,
        { backgroundColor: colors.surface },
      ]}
    >
      <Text style={[styles.statValue, { color: colors.text }]}>
        {value}
      </Text>

      <Text
        style={[
          styles.statTitle,
          { color: colors.textSecondary },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 70,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  headerSpace: {
    width: 42,
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    padding: 28,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
  },

  logo: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  teamName: {
    fontSize: 27,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },

  stat: {
    width: "48%",
    padding: 18,
    borderRadius: 20,
  },

  statValue: {
    fontSize: 25,
    fontWeight: "900",
  },

  statTitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
  },

  section: {
    marginTop: 12,
    padding: 18,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  empty: {
    marginTop: 10,
    fontSize: 13,
  },
});
