import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import {
  useLocalSearchParams,
} from "expo-router";

import {
  useAppTheme,
} from "../../theme/useAppTheme";

export default function PlayerDetailsScreen() {
  const { id } = useLocalSearchParams();
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
        Joueur
      </Text>

      <Text
        style={[
          styles.id,
          {
            color:
              colors.textSecondary,
          },
        ]}
      >
        {String(id ?? "")}
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

  id: {
    marginTop: 8,
    fontSize: 15,
  },
});
