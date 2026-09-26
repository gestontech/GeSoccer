import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useAppTheme } from "../../theme/useAppTheme";

export default function ExploreScreen() {
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
        Explorer
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
        Compétitions, équipes et joueurs
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
