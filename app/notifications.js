import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useAppTheme } from "../theme/useAppTheme";

export default function NotificationsScreen() {
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
        Notifications
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
        Aucune notification pour le moment.
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
    marginTop: 10,
    fontSize: 15,
  },
});
