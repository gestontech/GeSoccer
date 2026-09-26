import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";

import AppHeader from "../../components/header/AppHeader";
import BottomNavigation from "../../components/navigation/BottomNavigation";
import { useAppTheme } from "../../theme/useAppTheme";

export default function TabsLayout() {
  const { dark } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: dark ? "#101010" : "#F2F2F2",
        },
      ]}
    >
      <AppHeader />

      <View style={styles.content}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="explore" />
          <Tabs.Screen name="transfers" />
          <Tabs.Screen name="news" />
          <Tabs.Screen name="favorites" />
        </Tabs>
      </View>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});
