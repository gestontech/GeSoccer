import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import Glass from "../../components/glass/Glass";
import { footballApi } from "../../services/football";
import { useAppTheme } from "../../theme/useAppTheme";

const CURRENT_SEASON =
  new Date().getFullYear();

export default function PlayerDetailsScreen() {
  const { id } =
    useLocalSearchParams();

  const {
    colors,
    brand,
    dark,
  } = useAppTheme();

  const playerId =
    Array.isArray(id)
      ? id[0]
      : id;

  const [player, setPlayer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadPlayer =
    useCallback(
      async ({
        forceRefresh = false,
      } = {}) => {
        if (!playerId) {
          setError(
            "Identifiant du joueur manquant."
          );
          setLoading(false);
          return;
        }

        try {
          setError("");

          const response =
            await footballApi.players(
              {
                id: String(playerId),
                season:
                  CURRENT_SEASON,
              },
              {
                forceRefresh,
              }
            );

          const result =
            Array.isArray(
              response?.response
            )
              ? response.response[0]
              : null;

          if (!result?.player) {
            throw new Error(
              "Joueur introuvable."
            );
          }

          setPlayer(result);
        } catch (err) {
          setError(
            err?.message ||
              "Impossible de charger le joueur."
          );
        } finally {
          setLoading(false);
        }
      },
      [playerId]
    );

  useEffect(() => {
    loadPlayer();
  }, [loadPlayer]);

  const refresh =
    useCallback(async () => {
      setRefreshing(true);

      try {
        await loadPlayer({
          forceRefresh: true,
        });
      } finally {
        setRefreshing(false);
      }
    }, [loadPlayer]);

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={brand.green}
        />

        <Text
          style={[
            styles.loading,
            {
              color: colors.text,
            },
          ]}
        >
          Chargement du joueur...
        </Text>
      </View>
    );
  }

  if (!player || error) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <Ionicons
          name="person-outline"
          size={48}
          color={brand.red}
        />

        <Text
          style={[
            styles.errorTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Joueur indisponible
        </Text>

        <Text
          style={[
            styles.errorText,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {error ||
            "Impossible de récupérer les informations."}
        </Text>

        <TouchableOpacity
          onPress={() =>
            loadPlayer({
              forceRefresh: true,
            })
          }
          style={[
            styles.retry,
            {
              backgroundColor:
                brand.green,
            },
          ]}
        >
          <Text style={styles.retryText}>
            Réessayer
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const info =
    player.player || {};

  const statistics =
    Array.isArray(
      player.statistics
    )
      ? player.statistics
      : [];

  const primaryStats =
    statistics[0] || {};

  const team =
    primaryStats.team || {};

  const games =
    primaryStats.games || {};

  const goals =
    primaryStats.goals || {};

  const shots =
    primaryStats.shots || {};

  const passes =
    primaryStats.passes || {};

  const tackles =
    primaryStats.tackles || {};

  const cards =
    primaryStats.cards || {};

  function openTeam(teamId) {
    if (!teamId) {
      return;
    }

    router.push({
      pathname: "/team/[id]",
      params: {
        id: String(teamId),
      },
    });
  }

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
        <Pressable
          onPress={() =>
            router.back()
          }
          style={[
            styles.back,
            {
              backgroundColor: dark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.text}
          />
        </Pressable>

        <Text
          style={[
            styles.headerTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Joueur
        </Text>

        <Pressable
          onPress={refresh}
          style={[
            styles.back,
            {
              backgroundColor: dark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={colors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={refresh}
            tintColor={
              brand.green
            }
          />
        }
      >
        <Glass
          intensity={
            dark ? 35 : 55
          }
          style={[
            styles.profile,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          {info.photo ? (
            <Image
              source={{
                uri: info.photo,
              }}
              style={styles.photo}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor:
                    brand.green,
                },
              ]}
            >
              <Ionicons
                name="person"
                size={42}
                color="#FFFFFF"
              />
            </View>
          )}

          <Text
            style={[
              styles.name,
              {
                color: colors.text,
              },
            ]}
          >
            {info.name ||
              "Joueur"}
          </Text>

          <Text
            style={[
              styles.position,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {games.position ||
              "Position inconnue"}
          </Text>

          {team.id ? (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                openTeam(team.id)
              }
              style={styles.teamButton}
            >
              {team.logo ? (
                <Image
                  source={{
                    uri: team.logo,
                  }}
                  style={
                    styles.teamLogo
                  }
                />
              ) : null}

              <Text
                style={[
                  styles.teamName,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {team.name ||
                  "Équipe"}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={16}
                color={
                  colors.textSecondary
                }
              />
            </TouchableOpacity>
          ) : null}
        </Glass>

        <Section
          title="Informations"
          colors={colors}
        />

        <Glass
          intensity={
            dark ? 30 : 50
          }
          style={[
            styles.card,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <InfoRow
            icon="flag-outline"
            label="Nationalité"
            value={
              info.nationality ||
              "Non renseignée"
            }
            colors={colors}
          />

          <InfoRow
            icon="calendar-outline"
            label="Âge"
            value={
              info.age
                ? `${info.age} ans`
                : "Non renseigné"
            }
            colors={colors}
          />

          <InfoRow
            icon="resize-outline"
            label="Taille"
            value={
              info.height ||
              "Non renseignée"
            }
            colors={colors}
          />

          <InfoRow
            icon="fitness-outline"
            label="Poids"
            value={
              info.weight ||
              "Non renseigné"
            }
            colors={colors}
          />
        </Glass>

        <Section
          title="Statistiques"
          colors={colors}
        />

        <View style={styles.grid}>
          <Stat
            icon="football-outline"
            title="Matchs"
            value={
              games.appearences ??
              0
            }
            colors={colors}
          />

          <Stat
            icon="timer-outline"
            title="Minutes"
            value={
              games.minutes ??
              0
            }
            colors={colors}
          />

          <Stat
            icon="trophy-outline"
            title="Buts"
            value={
              goals.total ?? 0
            }
            colors={colors}
          />

          <Stat
            icon="people-outline"
            title="Passes"
            value={
              goals.assists ?? 0
            }
            colors={colors}
          />

          <Stat
            icon="locate-outline"
            title="Tirs"
            value={
              shots.total ?? 0
            }
            colors={colors}
          />

          <Stat
            icon="navigate-outline"
            title="Passes clés"
            value={
              passes.key ?? 0
            }
            colors={colors}
          />

          <Stat
            icon="shield-outline"
            title="Tacles"
            value={
              tackles.total ?? 0
            }
            colors={colors}
          />

          <Stat
            icon="card-outline"
            title="Jaunes"
            value={
              cards.yellow ?? 0
            }
            colors={colors}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  colors,
}) {
  return (
    <Text
      style={[
        styles.sectionTitle,
        {
          color: colors.text,
        },
      ]}
    >
      {title}
    </Text>
  );
}

function InfoRow({
  icon,
  label,
  value,
  colors,
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon}
        size={20}
        color={colors.green}
      />

      <View style={styles.infoBody}>
        <Text
          style={[
            styles.infoLabel,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.infoValue,
            {
              color: colors.text,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function Stat({
  icon,
  title,
  value,
  colors,
}) {
  return (
    <View
      style={[
        styles.stat,
        {
          backgroundColor:
            colors.surface,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={21}
        color={colors.green}
      />

      <Text
        style={[
          styles.statValue,
          {
            color: colors.text,
          },
        ]}
      >
        {String(value)}
      </Text>

      <Text
        style={[
          styles.statTitle,
          {
            color:
              colors.textSecondary,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loading: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
  },

  errorTitle: {
    marginTop: 14,
    fontSize: 21,
    fontWeight: "900",
  },

  errorText: {
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
  },

  retry: {
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 15,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  header: {
    height: 70,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  content: {
    padding: 18,
    paddingBottom: 70,
  },

  profile: {
    alignItems: "center",
    padding: 26,
    borderRadius: 28,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  name: {
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
  },

  position: {
    marginTop: 5,
    fontSize: 13,
  },

  teamButton: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 15,
  },

  teamLogo: {
    width: 25,
    height: 25,
    marginRight: 8,
  },

  teamName: {
    fontSize: 13,
    fontWeight: "800",
    marginRight: 5,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "900",
  },

  card: {
    padding: 17,
    borderRadius: 24,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  infoBody: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
  },

  infoValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "800",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  stat: {
    width: "48%",
    minHeight: 105,
    padding: 16,
    borderRadius: 20,
  },

  statValue: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: "900",
  },

  statTitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
  },
});
