import React from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

import { useAppTheme } from "../theme/useAppTheme";

export default function SearchScreen() {
  const { colors } =
    useAppTheme();

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
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Rechercher
      </Text>

      <TextInput
        placeholder="Équipe, joueur, compétition..."
        placeholderTextColor={
          colors.textSecondary
        }
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor:
              colors.surface,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 20,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
  },
});
