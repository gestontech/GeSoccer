import React from "react";
import {
  Link,
  Stack,
} from "expo-router";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Page introuvable",
        }}
      />

      <View style={styles.container}>
        <Text style={styles.code}>404</Text>

        <Text style={styles.title}>
          Page introuvable
        </Text>

        <Text style={styles.message}>
          Cette page n’existe pas ou n’est plus disponible.
        </Text>

        <Link href="/" style={styles.link}>
          Retour à l’accueil
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },

  code: {
    fontSize: 64,
    fontWeight: "800",
    marginBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  message: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 24,
  },

  link: {
    fontSize: 16,
    fontWeight: "700",
  },
});
