import React from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Glass from "../components/glass/Glass";
import { useAppTheme } from "../theme/useAppTheme";
import { getTranslations } from "../locales/i18n";

export default function AboutScreen() {
  const { colors, brand } = useAppTheme();
  const { t } = getTranslations();

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
        <Pressable
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />
        </Pressable>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {t.about}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >
        <Glass
          intensity={65}
          style={[
            styles.card,
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
                  brand.green,
              },
            ]}
          >
            <Ionicons
              name="football"
              size={32}
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
            GeSoccer
          </Text>

          <Text
            style={[
              styles.text,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Une application de suivi du
            football pour consulter les
            matchs, compétitions,
            équipes, joueurs et
            transferts.
          </Text>

          <Text
            style={[
              styles.version,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Version 1.0.0
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
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
  },

  content: {
    padding: 18,
  },

  card: {
    borderRadius: 28,
    borderWidth:
      StyleSheet.hairlineWidth,
    padding: 28,
    alignItems: "center",
  },

  icon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    marginTop: 16,
    fontSize: 26,
    fontWeight: "900",
  },

  text: {
    marginTop: 10,
    textAlign: "center",
    lineHeight: 21,
    fontSize: 14,
  },

  version: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: "700",
  },
});
