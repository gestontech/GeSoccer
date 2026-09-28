import React from "react";

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import Glass from "../../components/glass/Glass";

import {
  useAppTheme,
} from "../../theme/useAppTheme";

import {
  useFavorites,
} from "../../context/FavoritesContext";

const groups = [
  {
    key: "teams",
    title: "Équipes",
    icon: "shield-outline",
    route: "/team/",
    empty: "Aucune équipe favorite.",
  },

  {
    key: "players",
    title: "Joueurs",
    icon: "person-outline",
    route: "/player/",
    empty: "Aucun joueur favori.",
  },

  {
    key: "competitions",
    title: "Compétitions",
    icon: "trophy-outline",
    route: "/competition/",
    empty: "Aucune compétition favorite.",
  },
];

export default function FavoritesScreen() {
  const {
    colors,
    brand,
  } = useAppTheme();

  const {
    favorites,
    ready,
    removeFavorite,
  } = useFavorites();

  const total =
    favorites.teams.length +
    favorites.players.length +
    favorites.competitions.length;

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.heading}>
          <View>
            <Text
              style={[
                styles.title,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Favoris
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
              Équipes • Joueurs • Compétitions
            </Text>
          </View>

          <View
            style={[
              styles.total,
              {
                backgroundColor:
                  brand.green,
              },
            ]}
          >
            <Text
              style={styles.totalText}
            >
              {total}
            </Text>
          </View>
        </View>

        {!ready ? (
          <Text
            style={[
              styles.loading,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Chargement des favoris…
          </Text>
        ) : null}

        {groups.map((group) => (
          <View
            key={group.key}
            style={styles.section}
          >
            <View
              style={styles.sectionHead}
            >
              <View
                style={[
                  styles.sectionIcon,
                  {
                    backgroundColor:
                      `${brand.green}20`,
                  },
                ]}
              >
                <Ionicons
                  name={group.icon}
                  size={19}
                  color={
                    brand.greenLight
                  }
                />
              </View>

              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {group.title}
              </Text>

              <Text
                style={[
                  styles.count,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {favorites[
                  group.key
                ].length}
              </Text>
            </View>

            {favorites[group.key]
              .length === 0 ? (
              <Glass
                intensity={55}
                style={[
                  styles.empty,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  {group.empty}
                </Text>
              </Glass>
            ) : (
              favorites[
                group.key
              ].map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    router.push(
                      `${group.route}${encodeURIComponent(
                        item.id
                      )}`
                    )
                  }
                  style={
                    styles.row
                  }
                >
                  <Glass
                    intensity={60}
                    style={[
                      styles.card,
                      {
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    {item.logo ? (
                      <Image
                        source={{
                          uri: item.logo,
                        }}
                        style={
                          styles.logo
                        }
                      />
                    ) : (
                      <View
                        style={[
                          styles.fallback,
                          {
                            backgroundColor:
                              `${brand.green}20`,
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            group.icon
                          }
                          size={23}
                          color={
                            brand.greenLight
                          }
                        />
                      </View>
                    )}

                    <View
                      style={styles.info}
                    >
                      <Text
                        numberOfLines={
                          1
                        }
                        style={[
                          styles.name,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        {item.name}
                      </Text>

                      {!!item.country && (
                        <Text
                          numberOfLines={
                            1
                          }
                          style={[
                            styles.country,
                            {
                              color:
                                colors.textSecondary,
                            },
                          ]}
                        >
                          {item.country}
                        </Text>
                      )}
                    </View>

                    <Pressable
                      hitSlop={8}
                      onPress={() =>
                        removeFavorite(
                          group.key,
                          item.id
                        )
                      }
                    >
                      <Ionicons
                        name="star"
                        size={21}
                        color={
                          brand.yellow
                        }
                      />
                    </Pressable>

                    <Ionicons
                      name="chevron-forward"
                      size={17}
                      color={
                        colors.textSecondary
                      }
                    />
                  </Glass>
                </Pressable>
              ))
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },

  total: {
    minWidth: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent:
      "center",
  },

  totalText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },

  loading: {
    textAlign: "center",
    padding: 20,
  },

  section: {
    marginBottom: 22,
  },

  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent:
      "center",
  },

  sectionTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "900",
  },

  count: {
    fontSize: 12,
    fontWeight: "800",
  },

  empty: {
    borderRadius: 20,
    padding: 18,
  },

  emptyText: {
    fontSize: 13,
  },

  row: {
    marginBottom: 9,
  },

  card: {
    minHeight: 68,
    borderRadius: 20,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },

  fallback: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent:
      "center",
  },

  info: {
    flex: 1,
    marginHorizontal: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: "800",
  },

  country: {
    marginTop: 3,
    fontSize: 11,
  },
});
