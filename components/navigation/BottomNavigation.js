import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  usePathname,
  router,
} from "expo-router";

import Glass from "../glass/Glass";

import { useAppTheme } from "../../theme/useAppTheme";

/**
 * Petit stade vert avec marquages blancs.
 * Taille totale : 20 x 20 px.
 */
function StadiumIcon({ active = false }) {
  return (
    <View
      style={[
        styles.stadium,
        {
          opacity: active ? 1 : 0.9,
        },
      ]}
    >
      <View style={styles.stadiumField}>
        {/* Ligne centrale */}
        <View style={styles.centerLine} />

        {/* Cercle central */}
        <View style={styles.centerCircle} />

        {/* Surface gauche */}
        <View style={styles.leftBox} />

        {/* Surface droite */}
        <View style={styles.rightBox} />
      </View>
    </View>
  );
}

export default function BottomNavigation() {
  const pathname = usePathname();

  const { colors, brand } = useAppTheme();

  const items = [
    {
      id: "matches",
      route: "/",
      label: "matches",
      type: "stadium",
    },

    {
      id: "favorites",
      route: "/favorites",
      label: "favorites",
      icon: "heart-outline",
    },

    {
      id: "explore",
      route: "/explore",
      label: "explore",
      icon: "compass-outline",
    },

    {
      id: "transfers",
      route: "/transfers",
      label: "transfers",
      icon: "swap-horizontal-outline",
    },

    {
      id: "infos",
      route: "/news",
      label: "infos",
      icon: "information-circle-outline",
    },
  ];

  const labels = {
    matches: "Matchs",
    favorites: "Favoris",
    explore: "Explorer",
    transfers: "Transferts",
    info: "Info",
  };

  return (
    <Glass
      intensity={70}
      style={styles.container}
    >
      {items.map((item) => {
        const selected =
          item.route === "/"
            ? pathname === "/"
            : pathname.startsWith(item.route);

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            activeOpacity={0.75}
            onPress={() => router.replace(item.route)}
          >
            <View
              style={[
                styles.iconContainer,
                selected && {
                  backgroundColor:
                    "rgba(105,169,81,0.14)",
                },
              ]}
            >
              {item.type === "stadium" ? (
                <StadiumIcon active={selected} />
              ) : (
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={
                    selected
                      ? brand.greenLight
                      : colors.icon
                  }
                />
              )}
            </View>

            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: selected
                    ? brand.greenLight
                    : colors.icon,
                },
              ]}
            >
              {labels[item.label]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Glass>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 82,

    borderRadius: 0,

    borderTopWidth: 1,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-around",
  },

  item: {
    flex: 1,

    height: "100%",

    alignItems: "center",

    justifyContent: "center",
  },

  iconContainer: {
    width: 43,

    height: 34,

    borderRadius: 18,

    alignItems: "center",

    justifyContent: "center",
  },

  label: {
    fontSize: 11,

    marginTop: 4,

    fontWeight: "600",
  },

  /* =========================
     STADE 20 x 20
     ========================= */

  stadium: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: "#69A951",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  stadiumField: {
    width: 15,
    height: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 2,
    position: "relative",
  },

  centerLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 1,
    backgroundColor: "#FFFFFF",
  },

  centerCircle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 0.8,
    borderColor: "#FFFFFF",
    top: 3.2,
    left: 4.8,
  },

  leftBox: {
    position: "absolute",
    width: 3,
    height: 6,
    borderWidth: 0.8,
    borderColor: "#FFFFFF",
    borderLeftWidth: 0,
    top: 2,
    left: 0,
  },

  rightBox: {
    position: "absolute",
    width: 3,
    height: 6,
    borderWidth: 0.8,
    borderColor: "#FFFFFF",
    borderRightWidth: 0,
    top: 2,
    right: 0,
  },
});
