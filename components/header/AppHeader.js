import React from "react";

import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { router } from "expo-router";

import { useAppTheme } from "../../theme/useAppTheme";

export default function AppHeader() {
  const { brand } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: brand.green,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.75}
        onPress={() => router.push("/settings")}
      >
        <View style={styles.menu}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.75}
          onPress={() => router.push("/calendar")}
        >
          <Ionicons
            name="calendar-outline"
            size={25}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.75}
          onPress={() => router.push("/search")}
        >
          <Ionicons
            name="search-outline"
            size={25}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    elevation: 8,
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  button: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  menu: {
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  line: {
    width: 26,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
});
