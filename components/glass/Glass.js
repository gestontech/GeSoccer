import React from "react";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import { useAppTheme } from "../../theme/useAppTheme";

export default function Glass({
  children,
  style,
  intensity = 60,
}) {
  const { dark, colors } = useAppTheme();

  return (
    <BlurView
      intensity={intensity}
      tint={dark ? "dark" : "light"}
      style={[
        styles.base,
        {
          backgroundColor: dark
            ? "rgba(30,30,30,0.62)"
            : "rgba(255,255,255,0.72)",

          borderColor:
            colors.border,
        },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",

    borderWidth: 1,

    shadowColor: "#000",

    shadowOpacity: 0.12,

    shadowRadius: 14,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 4,
  },
});
