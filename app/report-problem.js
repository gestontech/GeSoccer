import React, { useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Glass from "../components/glass/Glass";
import { useAppTheme } from "../theme/useAppTheme";
import { getTranslations } from "../locales/i18n";

export default function ReportProblemScreen() {
  const { colors, brand } = useAppTheme();
  const { t } = getTranslations();

  const [message, setMessage] =
    useState("");

  function submit() {
    if (!message.trim()) {
      Alert.alert(
        t.reportProblem ||
          "Soumettre un problème",
        "Décrivez le problème avant d'envoyer."
      );
      return;
    }

    Alert.alert(
      "Merci",
      "Votre signalement est prêt à être transmis."
    );

    setMessage("");
  }

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
          {t.reportProblem}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
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
          <Ionicons
            name="flag-outline"
            size={34}
            color={brand.greenLight}
          />

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.text,
              },
            ]}
          >
            Aidez-nous à améliorer
            GeSoccer.
          </Text>

          <TextInput
            multiline
            value={message}
            onChangeText={setMessage}
            placeholder="Décrivez le problème rencontré..."
            placeholderTextColor={
              colors.textSecondary
            }
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor:
                  colors.border,
              },
            ]}
          />

          <Pressable
            onPress={submit}
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
              Envoyer
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
    padding: 22,
  },

  subtitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "800",
  },

  input: {
    minHeight: 150,
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderRadius: 18,
    textAlignVertical: "top",
    fontSize: 14,
  },

  button: {
    marginTop: 16,
    minHeight: 50,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
