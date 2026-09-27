import React, {
  useCallback,
  useEffect,
  useMemo,
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

const CURRENT_SEASON = new Date().getFullYear();

function formatDate(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getFixtureStatus(fixture) {
  const short = fixture?.fixture?.status?.short;

  if (
    [
      "1H",
      "HT",
      "2H",
      "ET",
      "P",
    ].includes(short)
  ) {
    return "LIVE";
  }

  if (
    [
      "FT",
      "AET",
      "PEN",
    ].includes(short)
  ) {
    return "TERMINÉ";
  }

  return fixture?.fixture?.status?.long || "À venir";
}

function isFinished(fixture) {
  return [
    "FT",
    "AET",
    "PEN",
  ].includes(
    fixture?.fixture?.status?.short
  );
}

function MatchRow({
  fixture,
  teamId,
  colors,
  brand,
  onPress,
}) {
  const home = fixture?.teams?.home || {};
  const away = fixture?.teams?.away || {};
  const goals = fixture?.goals || {};

  const isHome =
    String(home.id) === String(teamId);

  const opponent = isHome ? away : home;

  const teamGoals = isHome
    ? goals.home
    : goals.away;

  const opponentGoals = isHome
    ? goals.away
    : goals.home;

  const live = [
    "1H",
    "2H",
    "ET",
    "P",
  ].includes(
    fixture?.fixture?.status?.short
  );

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.matchRow,
        {
          borderBottomColor:
            colors.border,
        },
      ]}
    >
      <View style={styles.matchDate}>
        <Text
          style={[
            styles.matchDateText,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {formatDate(
            fixture?.fixture?.date
          )}
        </Text>

        <Text
          style={[
            styles.matchStatus,
            {
              color: live
                ? brand.red
                : colors.textSecondary,
            },
          ]}
        >
          {getFixtureStatus(fixture)}
        </Text>
      </View>

      <View style={styles.opponent}>
        {opponent.logo ? (
          <Image
            source={{
              uri: opponent.logo,
            }}
            style={styles.smallLogo}
          />
        ) : (
          <Ionicons
            name="football-outline"
            size={24}
            color={
              colors.textSecondary
            }
          />
        )}

        <Text
          numberOfLines={1}
          style={[
            styles.opponentName,
            {
              color: colors.text,
            },
          ]}
        >
          {opponent.name ||
            "Adversaire"}
        </Text>
      </View>

      <View style={styles.matchScore}>
        <Text
          style={[
            styles.scoreText,
            {
              color: colors.text,
            },
          ]}
        >
          {isFinished(fixture) ||
          live
            ? `${teamGoals ?? "-"} : ${
                opponentGoals ?? "-"
              }`
            : "-- : --"}
        </Text>

        <Text
          style={[
            styles.homeAway,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {isHome ? "DOM" : "EXT"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function PlayerRow({
  player,
  colors,
  onPress,
}) {
  const data = player?.player || player || {};

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.playerRow,
        {
          borderBottomColor:
            colors.border,
        },
      ]}
    >
      {data.photo ? (
        <Image
          source={{
            uri: data.photo,
          }}
          style={styles.playerPhoto}
        />
      ) : (
        <View
          style={[
            styles.playerFallback,
            {
              backgroundColor:
                colors.border,
            },
          ]}
        >
          <Ionicons
            name="person"
            size={20}
            color={
              colors.textSecondary
            }
          />
        </View>
      )}

      <View style={styles.playerInfo}>
        <Text
          numberOfLines={1}
          style={[
            styles.playerName,
            {
              color: colors.text,
            },
          ]}
        >
          {data.name ||
            "Joueur"}
        </Text>

        <Text
          style={[
            styles.playerMeta,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {data.position ||
            "Joueur"}
          {data.number
            ? ` · N°${data.number}`
            : ""}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={
          colors.textSecondary
        }
      />
    </TouchableOpacity>
  );
}

export default function TeamDetailsScreen() {
  const { id } =
    useLocalSearchParams();

  const {
    colors,
    brand,
    dark,
  } = useAppTheme();

  const teamId =
    Array.isArray(id)
      ? id[0]
      : id;

  const [team, setTeam] =
    useState(null);

  const [fixtures, setFixtures] =
    useState([]);

  const [players, setPlayers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadTeam =
    useCallback(
      async ({
        forceRefresh = false,
      } = {}) => {
        if (!teamId) {
          setError(
            "Identifiant d'équipe manquant."
          );
          setLoading(false);
          return;
        }

        try {
          setError("");

          const [
            teamResponse,
            fixtureResponse,
            playerResponse,
          ] = await Promise.all([
            footballApi.teams(
              {
                id: String(teamId),
              },
              {
                forceRefresh,
              }
            ),

            footballApi.fixtures(
              {
                team: String(teamId),
                season:
                  CURRENT_SEASON,
              },
              {
                forceRefresh,
              }
            ),

            footballApi.players(
              {
                team: String(teamId),
                season:
                  CURRENT_SEASON,
                page: 1,
              },
              {
                forceRefresh,
              }
            ),
          ]);

          const teamResult =
            Array.isArray(
              teamResponse?.response
            )
              ? teamResponse.response[0]
              : null;

          if (!teamResult?.team) {
            throw new Error(
              "Équipe introuvable."
            );
          }

          setTeam(teamResult);

          const fixtureResults =
            Array.isArray(
              fixtureResponse?.response
            )
              ? fixtureResponse.response
              : [];

          fixtureResults.sort(
            (a, b) =>
              new Date(
                a?.fixture?.date || 0
              ) -
              new Date(
                b?.fixture?.date || 0
              )
          );

          setFixtures(
            fixtureResults
          );

          setPlayers(
            Array.isArray(
              playerResponse?.response
            )
              ? playerResponse.response
              : []
          );
        } catch (err) {
          setError(
            err?.message ||
              "Impossible de charger l'équipe."
          );
        } finally {
          setLoading(false);
        }
      },
      [teamId]
    );

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const refresh =
    useCallback(async () => {
      setRefreshing(true);

      try {
        await loadTeam({
          forceRefresh: true,
        });
      } finally {
        setRefreshing(false);
      }
    }, [loadTeam]);

  const upcomingFixtures =
    useMemo(
      () =>
        fixtures
          .filter(
            (item) =>
              !isFinished(item)
          )
          .slice(0, 8),
      [fixtures]
    );

  const recentFixtures =
    useMemo(
      () =>
        fixtures
          .filter(isFinished)
          .slice(-8)
          .reverse(),
      [fixtures]
    );

  if (loading) {
    return (
      <Centered
        colors={colors}
        brand={brand}
        text="Chargement de l'équipe..."
      />
    );
  }

  if (!team || error) {
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
          name="cloud-offline-outline"
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
          Équipe indisponible
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
            loadTeam({
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

  const info = team.team || {};
  const venue = team.venue || {};

  function openPlayer(playerId) {
    if (!playerId) {
      return;
    }

    router.push({
      pathname: "/player/[id]",
      params: {
        id: String(playerId),
      },
    });
  }

  function openMatch(fixtureId) {
    if (!fixtureId) {
      return;
    }

    router.push({
      pathname: "/match/[id]",
      params: {
        id: String(fixtureId),
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
          Équipe
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
            styles.hero,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          {info.logo ? (
            <Image
              source={{
                uri: info.logo,
              }}
              style={styles.teamLogo}
            />
          ) : (
            <View
              style={[
                styles.logoFallback,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="football"
                size={42}
                color={brand.green}
              />
            </View>
          )}

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            {info.name ||
              "Équipe"}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {info.country ||
              "Football"}
            {info.code
              ? ` · ${info.code}`
              : ""}
          </Text>

          {info.founded ? (
            <Text
              style={[
                styles.founded,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Fondé en {info.founded}
            </Text>
          ) : null}
        </Glass>

        <Section
          title="Stade"
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
            icon="location-outline"
            label="Nom"
            value={
              venue.name ||
              "Non renseigné"
            }
            colors={colors}
          />

          <InfoRow
            icon="business-outline"
            label="Ville"
            value={
              venue.city ||
              "Non renseignée"
            }
            colors={colors}
          />

          <InfoRow
            icon="people-outline"
            label="Capacité"
            value={
              venue.capacity
                ? String(
                    venue.capacity
                  )
                : "Non renseignée"
            }
            colors={colors}
          />
        </Glass>

        <Section
          title="Prochains matchs"
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
          {upcomingFixtures.length ===
          0 ? (
            <Empty
              text="Aucun prochain match disponible."
              colors={colors}
            />
          ) : (
            upcomingFixtures.map(
              (fixture) => (
                <MatchRow
                  key={
                    fixture?.fixture
                      ?.id
                  }
                  fixture={fixture}
                  teamId={teamId}
                  colors={colors}
                  brand={brand}
                  onPress={() =>
                    openMatch(
                      fixture
                        ?.fixture
                        ?.id
                    )
                  }
                />
              )
            )
          )}
        </Glass>

        <Section
          title="Derniers résultats"
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
          {recentFixtures.length ===
          0 ? (
            <Empty
              text="Aucun résultat disponible."
              colors={colors}
            />
          ) : (
            recentFixtures.map(
              (fixture) => (
                <MatchRow
                  key={
                    fixture?.fixture
                      ?.id
                  }
                  fixture={fixture}
                  teamId={teamId}
                  colors={colors}
                  brand={brand}
                  onPress={() =>
                    openMatch(
                      fixture
                        ?.fixture
                        ?.id
                    )
                  }
                />
              )
            )
          )}
        </Glass>

        <Section
          title={`Effectif ${
            players.length
              ? `(${players.length})`
              : ""
          }`}
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
          {players.length === 0 ? (
            <Empty
              text="Aucun joueur disponible pour cette saison."
              colors={colors}
            />
          ) : (
            players.map(
              (item, index) => {
                const player =
                  item?.player ||
                  item;

                return (
                  <PlayerRow
                    key={
                      player?.id ||
                      index
                    }
                    player={item}
                    colors={colors}
                    onPress={() =>
                      openPlayer(
                        player?.id
                      )
                    }
                  />
                );
              }
            )
          )}
        </Glass>
      </ScrollView>
    </View>
  );
}

function Centered({
  colors,
  brand,
  text,
}) {
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
        {text}
      </Text>
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

function Empty({
  text,
  colors,
}) {
  return (
    <Text
      style={[
        styles.empty,
        {
          color:
            colors.textSecondary,
        },
      ]}
    >
      {text}
    </Text>
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

  hero: {
    alignItems: "center",
    padding: 28,
    borderRadius: 28,
    borderWidth:
      StyleSheet.hairlineWidth,
  },

  teamLogo: {
    width: 92,
    height: 92,
    marginBottom: 15,
  },

  logoFallback: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
  },

  founded: {
    marginTop: 5,
    fontSize: 11,
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

  empty: {
    paddingVertical: 8,
    lineHeight: 20,
    fontSize: 13,
  },

  matchRow: {
    minHeight: 68,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth:
      StyleSheet.hairlineWidth,
  },

  matchDate: {
    width: 70,
  },

  matchDateText: {
    fontSize: 10,
    fontWeight: "700",
  },

  matchStatus: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: "900",
  },

  opponent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  smallLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },

  opponentName: {
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
  },

  matchScore: {
    width: 70,
    alignItems: "flex-end",
  },

  scoreText: {
    fontSize: 14,
    fontWeight: "900",
  },

  homeAway: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: "800",
  },

  playerRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth:
      StyleSheet.hairlineWidth,
  },

  playerPhoto: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 11,
  },

  playerFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  playerInfo: {
    flex: 1,
  },

  playerName: {
    fontSize: 13,
    fontWeight: "800",
  },

  playerMeta: {
    marginTop: 3,
    fontSize: 10,
  },
});
