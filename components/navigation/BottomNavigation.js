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

function StadiumIcon({ color }) {
  return (
    <View
      style={[
        styles.stadium,
        {
          backgroundColor: color,
        },
      ]}
    >
      <View style={styles.stadiumRoof} />

      <View style={styles.field}>
        <View style={styles.fieldLineVertical} />

        <View style={styles.fieldCenterCircle}>
          <View style={styles.fieldCenterDot} />
        </View>

        <View style={styles.fieldBoxLeft} />
        <View style={styles.fieldBoxRight} />
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
      stadium: true,
    },

    {
      id: "favorites",
      route: "/favorites",
      label: "favorites",
      icon: "star-outline",
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
      id: "info",
      route: "/news",
      label: "info",
      icon: "newspaper-outline",
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

        const iconColor = selected
          ? brand.greenLight
          : colors.icon;

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            activeOpacity={0.75}
            onPress={() =>
              router.replace(item.route)
            }
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
              {item.stadium ? (
                <StadiumIcon color={iconColor} />
              ) : (
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={iconColor}
                />
              )}
            </View>

            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: iconColor,
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

  stadium: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    paddingBottom: 2,
  },

  stadiumRoof: {
    position: "absolute",
    top: 0,
    left: 2,
    right: 2,
    height: 4,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#FFFFFF",
  },

  field: {
    width: 15,
    height: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 1,
    position: "relative",
  },

  fieldLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 1,
    backgroundColor: "#FFFFFF",
  },

  fieldCenterCircle: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: "#FFFFFF",
    left: 4.5,
    top: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },

  fieldCenterDot: {
    width: 1.5,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: "#FFFFFF",
  },

  fieldBoxLeft: {
    position: "absolute",
    width: 3,
    height: 6,
    left: -1,
    top: 2,
    borderWidth: 0.8,
    borderColor: "#FFFFFF",
    borderLeftWidth: 0,
  },

  fieldBoxRight: {
    position: "absolute",
    width: 3,
    height: 6,
    right: -1,
    top: 2,
    borderWidth: 0.8,
    borderColor: "#FFFFFF",
    borderRightWidth: 0,
  },
});
