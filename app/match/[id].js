import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  useLocalSearchParams,
  router,
} from "expo-router";

import { useAppTheme } from "../../theme/useAppTheme";

export default function MatchDetailsScreen() {
  const { id } =
    useLocalSearchParams();

  const { colors, brand } =
    useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text
          style={[
            styles.back,
            {
              color: brand.greenLight,
            },
          ]}
        >
          ← Retour
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Détail du match
      </Text>

      <Text
        style={[
          styles.id,
          {
            color:
              colors.textSecondary,
          },
        ]}
      >
        Match : {id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  back: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 35,
  },

  id: {
    marginTop: 10,
    fontSize: 15,
  },
});
