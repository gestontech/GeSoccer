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

export default function BottomNavigation() {
  const pathname = usePathname();

  const { dark, colors, brand } =
    useAppTheme();

  const items = [
    {
      id: "matches",
      route: "/",
      label: "matches",
      icon: "football-outline",
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
      id: "news",
      route: "/news",
      label: "news",
      icon: "newspaper-outline",
    },

    {
      id: "favorites",
      route: "/favorites",
      label: "favorites",
      icon: "star-outline",
    },
  ];

  const labels = {
    matches: "Matchs",
    explore: "Explorer",
    transfers: "Transferts",
    news: "Actualités",
    favorites: "Favoris",
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
            : pathname.startsWith(
                item.route
              );

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
              <Ionicons
                name={item.icon}
                size={27}
                color={
                  selected
                    ? brand.greenLight
                    : colors.icon
                }
              />
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
});
