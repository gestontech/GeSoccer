import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import {
  useAppTheme,
} from "../theme/useAppTheme";

import Glass from "../components/glass/Glass";

import {
  getTranslations,
} from "../locales/i18n";

export default function TeamsScreen() {
  const {
    colors,
    brand,
  } = useAppTheme();

  const {
    t,
  } = getTranslations();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {t.teams}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
      >
        <Glass
          intensity={70}
          style={[
            styles.emptyCard,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.icon,
              {
                backgroundColor:
                  `${brand.green}20`,
              },
            ]}
          >
            <Ionicons
              name="shield-outline"
              size={32}
              color={
                brand.greenLight
              }
            />
          </View>

          <Text
            style={[
              styles.emptyTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {t.teams}
          </Text>

          <Text
            style={[
              styles.emptyText,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {t.teamsDescription}
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
    height: 76,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  back: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
  },

  content: {
    padding: 16,
  },

  emptyCard: {
    minHeight: 220,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  icon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 19,
    fontWeight: "900",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
});
