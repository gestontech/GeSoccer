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

const SKY_BLUE = "#63BFE8";

export default function AppHeader() {
  const { brand } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: SKY_BLUE,
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
            size={20}
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
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 88,
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
    width: 20,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  line: {
    width: 20,
    height: 2.5,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
});
