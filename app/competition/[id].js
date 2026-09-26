import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import Glass from "../../components/glass/Glass";
import { useAppTheme } from "../../theme/useAppTheme";

export default function CompetitionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors, dark } = useAppTheme();

  const competitionName = String(
    id || "competition"
  )
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.back,
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
            {
              color: colors.text,
            },
          ]}
        >
          Compétition
        </Text>

        <View style={styles.space} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Glass
          intensity={dark ? 35 : 55}
          style={[
            styles.hero,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.icon,
              {
                backgroundColor: colors.green,
              },
            ]}
          >
            <Ionicons
              name="trophy"
              size={42}
              color="#FFFFFF"
            />
          </View>

          <Text
            style={[
              styles.name,
              {
                color: colors.text,
              },
            ]}
          >
            {competitionName}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Résultats, classement et matchs
          </Text>
        </Glass>

        <Glass
          intensity={dark ? 30 : 50}
          style={[
            styles.section,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Classement
          </Text>

          <Text
            style={[
              styles.empty,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Le classement sera alimenté par les données
            réelles de la compétition.
          </Text>
        </Glass>

        <Glass
          intensity={dark ? 30 : 50}
          style={[
            styles.section,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Matchs
          </Text>

          <Text
            style={[
              styles.empty,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Les matchs de cette compétition apparaîtront ici.
          </Text>
        </Glass>
      </ScrollView>
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

  back: {
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

  space: {
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

  icon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  name: {
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
  },

  section: {
    marginTop: 14,
    padding: 20,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  empty: {
    marginTop: 10,
    lineHeight: 20,
  },
});
