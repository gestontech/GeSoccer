import React from "react";

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import Glass from "../glass/Glass";

import {
  useAppTheme,
} from "../../theme/useAppTheme";

import {
  getTranslations,
} from "../../locales/i18n";

export default function SideMenu({
  visible,
  onClose,
}) {
  const {
    colors,
    brand,
  } = useAppTheme();

  const {
    t,
  } = getTranslations();

  const navigate = (route) => {
    onClose();

    setTimeout(() => {
      router.push(route);
    }, 120);
  };

  const menuItems = [
    {
      id: "competitions",
      label: t.competitions,
      icon: "trophy-outline",
      route: "/competition",
    },
    {
      id: "teams",
      label: t.teams,
      icon: "shield-outline",
      route: "/teams",
    },
    {
      id: "players",
      label: t.players,
      icon: "person-outline",
      route: "/players",
    },
    {
      id: "find-match",
      label: t.findMatch,
      icon: "football-outline",
      route: "/find-match",
    },
    {
      id: "settings",
      label: t.settings,
      icon: "settings-outline",
      route: "/settings",
    },
    {
      id: "about",
      label: t.about,
      icon: "information-circle-outline",
      route: "/about",
    },
    {
      id: "report",
      label: t.reportProblem,
      icon: "flag-outline",
      route: "/report-problem",
    },
    {
      id: "ads",
      label: t.removeAds,
      icon: "close-circle-outline",
      route: "/remove-ads",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        <Glass
          intensity={85}
          style={[
            styles.drawer,
            {
              backgroundColor: colors.surfaceStrong,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.header}>
            <View
              style={[
                styles.profileIcon,
                {
                  backgroundColor:
                    brand.green,
                },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={23}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.profileText}>
              <Text
                style={[
                  styles.profileTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t.login}
              </Text>

              <Text
                style={[
                  styles.profileSubtitle,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {t.loginSubtitle}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.75}
              onPress={onClose}
            >
              <Ionicons
                name="close"
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.separator,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.menuContent
            }
          >
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.72}
                style={[
                  styles.menuItem,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
                onPress={() =>
                  navigate(item.route)
                }
              >
                <View
                  style={[
                    styles.menuIcon,
                    {
                      backgroundColor:
                        darkenBrand(
                          brand.green,
                          0.10
                        ),
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={brand.greenLight}
                  />
                </View>

                <Text
                  style={[
                    styles.menuLabel,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {item.label}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View
            style={[
              styles.footer,
              {
                borderTopColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.version,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              GeSoccer
            </Text>
          </View>
        </Glass>
      </View>
    </Modal>
  );
}

function darkenBrand(color, opacity) {
  if (!color) {
    return `rgba(105,169,81,${opacity})`;
  }

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");

    const r = parseInt(
      hex.substring(0, 2),
      16
    );

    const g = parseInt(
      hex.substring(2, 4),
      16
    );

    const b = parseInt(
      hex.substring(4, 6),
      16
    );

    return `rgba(${r},${g},${b},${opacity})`;
  }

  return color;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "rgba(0,0,0,0.42)",
  },

  drawer: {
    width: "86%",
    maxWidth: 390,
    height: "100%",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingTop: 54,
    paddingHorizontal: 16,
  },

  header: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
  },

  profileIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    flex: 1,
    marginLeft: 13,
  },

  profileTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  profileSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  separator: {
    height: 1,
    width: "100%",
    marginVertical: 13,
  },

  menuContent: {
    paddingTop: 2,
    paddingBottom: 20,
  },

  menuItem: {
    minHeight: 62,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  menuLabel: {
    flex: 1,
    marginLeft: 14,
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    height: 55,
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  version: {
    fontSize: 11,
    fontWeight: "600",
  },
});
