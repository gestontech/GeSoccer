import React from "react";

import {
  Pressable,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useFavorites,
} from "../context/FavoritesContext";

import {
  useAppTheme,
} from "../theme/useAppTheme";

export default function FavoriteButton({
  type,
  item,
  size = 22,
}) {
  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const {
    colors,
    brand,
  } = useAppTheme();

  const active =
    isFavorite(
      type,
      item?.id
    );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        active
          ? "Retirer des favoris"
          : "Ajouter aux favoris"
      }
      hitSlop={10}
      onPress={() =>
        toggleFavorite(
          type,
          item
        )
      }
      style={[
        styles.button,
        {
          backgroundColor:
            colors.surfaceStrong,
        },
      ]}
    >
      <Ionicons
        name={
          active
            ? "star"
            : "star-outline"
        }
        size={size}
        color={
          active
            ? brand.yellow
            : colors.text
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
