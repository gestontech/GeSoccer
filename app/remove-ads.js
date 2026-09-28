import React from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Glass from "../components/glass/Glass";
import { useAppTheme } from "../theme/useAppTheme";
import { getTranslations } from "../locales/i18n";

export default function RemoveAdsScreen() {
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
          {t.removeAds}
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
              name="sparkles"
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
            GeSoccer sans publicité
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
            Cette page prépare l'offre
            sans publicité. Le paiement
            et la restauration d'achat
            seront ajoutés avec le
            système de boutique de
            l'application.
          </Text>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Bientôt disponible",
                "L'achat sans publicité n'est pas encore activé."
              )
            }
            style={[
              styles.button,
              {
                backgroundColor:
                  brand.green,
              },
            ]}
          >
            <Text
              style={styles.buttonText}
            >
              Bientôt disponible
            </Text>
          </Pressable>
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
    fontSize: 21,
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
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  text: {
    marginTop: 10,
    textAlign: "center",
    lineHeight: 21,
    fontSize: 14,
  },

  button: {
    marginTop: 20,
    minHeight: 50,
    paddingHorizontal: 24,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
