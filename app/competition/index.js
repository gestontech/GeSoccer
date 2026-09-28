import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import {
  useAppTheme,
} from "../../theme/useAppTheme";

import Glass from "../../components/glass/Glass";

import {
  getTranslations,
} from "../../locales/i18n";

export default function CompetitionsScreen() {
  const {
    colors,
    brand,
  } = useAppTheme();

  const {
    t,
  } = getTranslations();

  const competitions = [
    {
      id: 39,
      name: "Premier League",
      country: "Angleterre",
    },
    {
      id: 140,
      name: "LaLiga",
      country: "Espagne",
    },
    {
      id: 135,
      name: "Serie A",
      country: "Italie",
    },
    {
      id: 78,
      name: "Bundesliga",
      country: "Allemagne",
    },
  ];

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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {t.competitions}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {competitions.map(
          (competition) => (
            <TouchableOpacity
              key={competition.id}
              activeOpacity={0.8}
              onPress={() =>
                router.push(
                  `/competition/${competition.id}`
                )
              }
            >
              <Glass
                intensity={70}
                style={[
                  styles.card,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.icon,
                    {
                      backgroundColor:
                        `${brand.green}20`,
                    },
                  ]}
                >
                  <Ionicons
                    name="trophy-outline"
                    size={24}
                    color={
                      brand.greenLight
                    }
                  />
                </View>

                <View
                  style={styles.cardText}
                >
                  <Text
                    style={[
                      styles.name,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {competition.name}
                  </Text>

                  <Text
                    style={[
                      styles.country,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    {competition.country}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    colors.textSecondary
                  }
                />
              </Glass>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 76,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  back: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    marginLeft: 6,
  },

  content: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 30,
  },

  card: {
    minHeight: 82,
    marginBottom: 12,
    borderRadius: 22,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  cardText: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: "800",
  },

  country: {
    marginTop: 5,
    fontSize: 13,
  },
});
