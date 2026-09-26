import React from "react";

import {
  Stack,
} from "expo-router";

import {
  StatusBar,
} from "expo-status-bar";

import {
  useAppTheme,
} from "../theme/useAppTheme";

export default function RootLayout() {
  const { dark, brand } =
    useAppTheme();

  return (
    <>
      <StatusBar
        style="light"
        backgroundColor={
          brand.green
        }
      />

      <Stack
        screenOptions={{
          headerShown: false,

          contentStyle: {
            backgroundColor: dark
              ? "#101010"
              : "#F2F2F2",
          },

          animation:
            "slide_from_right",
        }}
      >
        <Stack.Screen
          name="(tabs)"
        />

        <Stack.Screen
          name="match/[id]"
        />

        <Stack.Screen
          name="team/[id]"
        />

        <Stack.Screen
          name="player/[id]"
        />

        <Stack.Screen
          name="competition/[id]"
        />

        <Stack.Screen
          name="search"
        />

        <Stack.Screen
          name="calendar"
        />

        <Stack.Screen
          name="notifications"
        />

        <Stack.Screen
          name="settings"
        />
      </Stack>
    </>
  );
}
