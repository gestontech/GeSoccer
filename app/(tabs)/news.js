import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useAppTheme } from "../../theme/useAppTheme";

export default function NewsScreen() {
  const { colors } = useAppTheme();

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
        Actualités
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color:
              colors.textSecondary,
          },
        ]}
      >
        Les actualités football seront
        affichées ici.
      </Text>
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
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
  },
});
