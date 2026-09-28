import React, {
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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

export default function FindMatchScreen() {
  const {
    colors,
    brand,
  } = useAppTheme();

  const {
    t,
  } = getTranslations();

  const [
    query,
    setQuery,
  ] = useState("");

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
          {t.findMatch}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >
        <Glass
          intensity={70}
          style={[
            styles.searchCard,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={21}
            color={
              colors.textSecondary
            }
          />

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={
              t.findMatchPlaceholder
            }
            placeholderTextColor={
              colors.textSecondary
            }
            style={[
              styles.input,
              {
                color: colors.text,
              },
            ]}
          />
        </Glass>

        <View
          style={styles.quickRow}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.quickButton,
              {
                backgroundColor:
                  brand.green,
              },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.quickText
              }
            >
              {t.calendar}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.quickButton,
              {
                backgroundColor:
                  `${brand.green}20`,
              },
            ]}
          >
            <Ionicons
              name="football-outline"
              size={19}
              color={
                brand.greenLight
              }
            />

            <Text
              style={[
                styles.quickText,
                {
                  color: colors.text,
                },
              ]}
            >
              {t.matches}
            </Text>
          </TouchableOpacity>
        </View>
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

  searchCard: {
    height: 58,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  quickRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },

  quickButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 17,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  quickText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
