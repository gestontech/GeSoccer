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

export default function PlayerDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors, dark } = useAppTheme();

  const playerName = String(id || "player")
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
          Joueur
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
            styles.profile,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: colors.green,
              },
            ]}
          >
            <Ionicons
              name="person"
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
            {playerName}
          </Text>

          <Text
            style={[
              styles.role,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Profil joueur
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
            Statistiques
          </Text>

          <Text
            style={[
              styles.empty,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Les statistiques détaillées seront disponibles
            avec les données football réelles.
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

  profile: {
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    padding: 28,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  name: {
    fontSize: 27,
    fontWeight: "900",
  },

  role: {
    marginTop: 5,
    fontSize: 13,
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
