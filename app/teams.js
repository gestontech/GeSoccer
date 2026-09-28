import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Glass from "../components/glass/Glass";
import FavoriteButton from "../components/FavoriteButton";
import { footballApi } from "../services/football";
import { useAppTheme } from "../theme/useAppTheme";
import { getTranslations } from "../locales/i18n";

const CURRENT_SEASON = new Date().getFullYear();

export default function TeamsScreen() {
  const { colors, brand } = useAppTheme();
  const { t } = getTranslations();

  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await footballApi.teams(
          query.trim()
            ? { search: query.trim() }
            : {
                league: 39,
                season: CURRENT_SEASON,
              }
        );

        const result = Array.isArray(response?.response)
          ? response.response.slice(0, 60)
          : [];

        if (active) {
          setTeams(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
              "Impossible de charger les équipes."
          );
          setTeams([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, query.trim() ? 350 : 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.back}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />
        </Pressable>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {t.teams}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <Glass
          intensity={70}
          style={[
            styles.search,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
          />

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={
              t.search || "Rechercher"
            }
            placeholderTextColor={
              colors.textSecondary
            }
            style={[
              styles.input,
              {
                color: colors.text,
              },
            ]}
          />
        </Glass>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator
              color={brand.green}
            />
          </View>
        ) : null}

        {!!error && !loading ? (
          <Text
            style={[
              styles.error,
              {
                color: brand.red,
              },
            ]}
          >
            {error}
          </Text>
        ) : null}

        {!loading &&
        !error &&
        teams.length === 0 ? (
          <Glass
            intensity={60}
            style={[
              styles.empty,
              {
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="shield-outline"
              size={34}
              color={colors.textSecondary}
            />

            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Aucun résultat.
            </Text>
          </Glass>
        ) : null}

        {teams.map((item, index) => {
          const team = item?.team || {};

          if (!team.id) {
            return null;
          }

          return (
            <Pressable
              key={team.id || index}
              onPress={() =>
                router.push({
                  pathname: "/team/[id]",
                  params: {
                    id: String(team.id),
                  },
                })
              }
            >
              <Glass
                intensity={55}
                style={[
                  styles.card,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                {team.logo ? (
                  <Image
                    source={{
                      uri: team.logo,
                    }}
                    style={styles.logo}
                  />
                ) : (
                  <View
                    style={[
                      styles.fallback,
                      {
                        backgroundColor:
                          colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="shield-outline"
                      size={24}
                      color={
                        colors.textSecondary
                      }
                    />
                  </View>
                )}

                <View style={styles.info}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.name,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {team.name ||
                      "Équipe"}
                  </Text>

                  <Text
                    style={[
                      styles.meta,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    {team.country ||
                      "Football"}
                  </Text>
                </View>

                <FavoriteButton
                  type="teams"
                  item={{
                    id: team.id,
                    name: team.name,
                    logo: team.logo,
                    country:
                      team.country,
                  }}
                />

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    colors.textSecondary
                  }
                />
              </Glass>
            </Pressable>
          );
        })}
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
    marginRight: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  search: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth:
      StyleSheet.hairlineWidth,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  center: {
    padding: 30,
    alignItems: "center",
  },

  error: {
    textAlign: "center",
    padding: 15,
    fontWeight: "700",
  },

  empty: {
    minHeight: 160,
    borderRadius: 24,
    borderWidth:
      StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 13,
  },

  card: {
    minHeight: 76,
    borderRadius: 22,
    borderWidth:
      StyleSheet.hairlineWidth,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 48,
    height: 48,
    marginRight: 12,
  },

  fallback: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  name: {
    fontSize: 14,
    fontWeight: "900",
  },

  meta: {
    marginTop: 4,
    fontSize: 11,
  },
});
