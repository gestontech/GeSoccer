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
        onPress={() =>
          router.push("/settings")
        }
      >
        <View style={styles.menu}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.75}
        onPress={() =>
          router.push("/calendar")
        }
      >
        <Ionicons
          name="football-outline"
          size={29}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.75}
        onPress={() =>
          router.push("/calendar")
        }
      >
        <Ionicons
          name="calendar-outline"
          size={29}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.75}
        onPress={() =>
          router.push("/notifications")
        }
      >
        <Ionicons
          name="notifications-outline"
          size={29}
          color="#FFFFFF"
        />

        <View style={styles.badge}>
          <View style={styles.badgeDot} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.75}
        onPress={() =>
          router.push("/calendar")
        }
      >
        <Ionicons
          name="calendar"
          size={28}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.75}
        onPress={() =>
          router.push("/search")
        }
      >
        <Ionicons
          name="search"
          size={30}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 74,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-around",

    paddingHorizontal: 7,

    elevation: 8,
  },

  button: {
    width: 45,

    height: 45,

    alignItems: "center",

    justifyContent: "center",
  },

  menu: {
    gap: 6,
  },

  line: {
    width: 32,

    height: 4,

    borderRadius: 4,

    backgroundColor: "#FFFFFF",
  },

  badge: {
    position: "absolute",

    right: 1,

    top: 0,

    width: 12,

    height: 12,

    borderRadius: 8,

    backgroundColor: "#FFFFFF",

    alignItems: "center",

    justifyContent: "center",
  },

  badgeDot: {
    width: 7,

    height: 7,

    borderRadius: 5,

    backgroundColor: "#E74747",
  },
});
