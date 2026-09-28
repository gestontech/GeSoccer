import React, {
  useEffect,
  useState,
} from "react";

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "../theme/useAppTheme";

const STORAGE_KEY =
  "@gesoccer_settings";

const GREEN = "#4B842F";

const HOME_OPTIONS = [
  "Tous / Toutes",
  "Matchs",
  "Favoris",
];

const ODDS_OPTIONS = [
  "EU (1.50)",
  "UK (1/2)",
  "US (-200)",
];

export default function SettingsScreen() {
  const { colors, brand, dark } =
    useAppTheme();

  const [homeOption, setHomeOption] =
    useState("Tous / Toutes");

  const [hideHomeContent, setHideHomeContent] =
    useState(true);

  const [prioritizeFavorites, setPrioritizeFavorites] =
    useState(true);

  const [oddsFormat, setOddsFormat] =
    useState("EU (1.50)");

  const [dropdown, setDropdown] =
    useState(null);

  /*
   * Chargement des réglages sauvegardés.
   */
  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const stored =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );

        if (!stored || !mounted) {
          return;
        }

        const parsed =
          JSON.parse(stored);

        if (
          typeof parsed.homeOption ===
          "string"
        ) {
          setHomeOption(
            parsed.homeOption
          );
        }

        if (
          typeof parsed.hideHomeContent ===
          "boolean"
        ) {
          setHideHomeContent(
            parsed.hideHomeContent
          );
        }

        if (
          typeof parsed.prioritizeFavorites ===
          "boolean"
        ) {
          setPrioritizeFavorites(
            parsed.prioritizeFavorites
          );
        }

        if (
          typeof parsed.oddsFormat ===
          "string"
        ) {
          setOddsFormat(
            parsed.oddsFormat
          );
        }
      } catch {
        // Les valeurs par défaut restent utilisées.
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Sauvegarde des réglages.
   */
  const saveSettings = async (
    changes
  ) => {
    try {
      const current = {
        homeOption,
        hideHomeContent,
        prioritizeFavorites,
        oddsFormat,
        ...changes,
      };

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(current)
      );
    } catch {
      // Le réglage reste actif même si la sauvegarde échoue.
    }
  };

  const changeHomeOption = (value) => {
    setHomeOption(value);
    setDropdown(null);

    saveSettings({
      homeOption: value,
    });
  };

  const changeOddsFormat = (value) => {
    setOddsFormat(value);
    setDropdown(null);

    saveSettings({
      oddsFormat: value,
    });
  };

  const toggleHideHomeContent = (
    value
  ) => {
    setHideHomeContent(value);

    saveSettings({
      hideHomeContent: value,
    });
  };

  const togglePrioritizeFavorites = (
    value
  ) => {
    setPrioritizeFavorites(value);

    saveSettings({
      prioritizeFavorites: value,
    });
  };

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
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* ========================= */}
        {/* TITRE */}
        {/* ========================= */}

        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Paramètres
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
            Personnalisez votre expérience
            GeSoccer.
          </Text>
        </View>

        {/* ========================= */}
        {/* PARAMÈTRES */}
        {/* ========================= */}

        <SectionTitle
          title="PARAMÈTRES"
          colors={colors}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          {/* OPTIONS D'ACCUEIL */}

          <SettingRow
            icon="home-outline"
            title="Options d'accueil"
            subtitle={homeOption}
            colors={colors}
            brand={brand}
            onPress={() =>
              setDropdown(
                dropdown === "home"
                  ? null
                  : "home"
              )
            }
            showChevron
          />

          {dropdown === "home" && (
            <Dropdown
              options={HOME_OPTIONS}
              selected={homeOption}
              onSelect={
                changeHomeOption
              }
              colors={colors}
              brand={brand}
              dark={dark}
            />
          )}

          <Divider
            colors={colors}
          />

          {/* MASQUER DANS L'ACCUEIL */}

          <SettingRow
            icon="eye-off-outline"
            title="Masquer dans la page d'accueil"
            subtitle="Transferts, presse, informations, etc."
            colors={colors}
            brand={brand}
            right={
              <Switch
                value={hideHomeContent}
                onValueChange={
                  toggleHideHomeContent
                }
                trackColor={{
                  false:
                    dark
                      ? "#3A3A3A"
                      : "#D1D1D1",
                  true:
                    brand.green,
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={
                  dark
                    ? "#3A3A3A"
                    : "#D1D1D1"
                }
              />
            }
          />

          <Divider
            colors={colors}
          />

          {/* PRIORISER FAVORIS */}

          <SettingRow
            icon="star-outline"
            title="Prioriser les favoris"
            subtitle="Afficher vos favoris en priorité"
            colors={colors}
            brand={brand}
            right={
              <Switch
                value={
                  prioritizeFavorites
                }
                onValueChange={
                  togglePrioritizeFavorites
                }
                trackColor={{
                  false:
                    dark
                      ? "#3A3A3A"
                      : "#D1D1D1",
                  true:
                    brand.green,
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={
                  dark
                    ? "#3A3A3A"
                    : "#D1D1D1"
                }
              />
            }
          />
        </View>

        {/* ========================= */}
        {/* COTES */}
        {/* ========================= */}

        <SectionTitle
          title="COTES"
          colors={colors}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          <SettingRow
            icon="trending-up-outline"
            title="Format des cotes"
            subtitle={oddsFormat}
            colors={colors}
            brand={brand}
            onPress={() =>
              setDropdown(
                dropdown === "odds"
                  ? null
                  : "odds"
              )
            }
            showChevron
          />

          {dropdown === "odds" && (
            <Dropdown
              options={ODDS_OPTIONS}
              selected={oddsFormat}
              onSelect={
                changeOddsFormat
              }
              colors={colors}
              brand={brand}
              dark={dark}
            />
          )}
        </View>

        {/* ========================= */}
        {/* NOTE */}
        {/* ========================= */}

        <Text
          style={[
            styles.footerText,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          Les réglages sont enregistrés
          automatiquement sur cet appareil.
        </Text>
      </ScrollView>

      {/* ========================= */}
      {/* MENU DÉROULANT */}
      {/* ========================= */}

      {dropdown !== null && (
        <Modal
          transparent
          visible
          animationType="fade"
          onRequestClose={() =>
            setDropdown(null)
          }
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() =>
              setDropdown(null)
            }
          >
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor:
                    colors.surfaceStrong,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <View
                style={
                  styles.modalHandle
                }
              />

              <Text
                style={[
                  styles.modalTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {dropdown === "home"
                  ? "Options d'accueil"
                  : "Format des cotes"}
              </Text>

              {(dropdown === "home"
                ? HOME_OPTIONS
                : ODDS_OPTIONS
              ).map((option) => {
                const selected =
                  dropdown === "home"
                    ? option ===
                      homeOption
                    : option ===
                      oddsFormat;

                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.75}
                    onPress={() => {
                      if (
                        dropdown ===
                        "home"
                      ) {
                        changeHomeOption(
                          option
                        );
                      } else {
                        changeOddsFormat(
                          option
                        );
                      }
                    }}
                    style={[
                      styles.option,
                      selected && {
                        backgroundColor:
                          dark
                            ? "rgba(75,132,47,0.22)"
                            : "rgba(75,132,47,0.10)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {option}
                    </Text>

                    {selected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={
                          brand.green
                        }
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

/* ================================= */
/* SECTION TITLE */
/* ================================= */

function SectionTitle({
  title,
  colors,
}) {
  return (
    <Text
      style={[
        styles.sectionTitle,
        {
          color:
            colors.textSecondary,
        },
      ]}
    >
      {title}
    </Text>
  );
}

/* ================================= */
/* SETTING ROW */
/* ================================= */

function SettingRow({
  icon,
  title,
  subtitle,
  colors,
  brand,
  right,
  onPress,
  showChevron = false,
}) {
  const content = (
    <View style={styles.row}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              "rgba(75,132,47,0.12)",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={brand.green}
        />
      </View>

      <View style={styles.rowContent}>
        <Text
          style={[
            styles.rowTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            style={[
              styles.rowSubtitle,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {right}

      {showChevron && (
        <Ionicons
          name="chevron-down"
          size={20}
          color={
            colors.textSecondary
          }
        />
      )}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  );
}

/* ================================= */
/* DIVIDER */
/* ================================= */

function Divider({ colors }) {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor:
            colors.border,
        },
      ]}
    />
  );
}

/* ================================= */
/* DROPDOWN INLINE */
/* ================================= */

function Dropdown({
  options,
  selected,
  onSelect,
  colors,
  brand,
  dark,
}) {
  return (
    <View
      style={[
        styles.inlineDropdown,
        {
          backgroundColor: dark
            ? "rgba(255,255,255,0.04)"
            : "rgba(0,0,0,0.025)",
        },
      ]}
    >
      {options.map((option) => {
        const active =
          option === selected;

        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.75}
            onPress={() =>
              onSelect(option)
            }
            style={[
              styles.inlineOption,
              active && {
                backgroundColor:
                  dark
                    ? "rgba(75,132,47,0.20)"
                    : "rgba(75,132,47,0.09)",
              },
            ]}
          >
            <Text
              style={[
                styles.inlineOptionText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {option}
            </Text>

            {active && (
              <Ionicons
                name="checkmark"
                size={21}
                color={
                  brand.green
                }
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ================================= */
/* STYLES */
/* ================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 110,
  },

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 21,
  },

  sectionTitle: {
    marginLeft: 5,
    marginBottom: 9,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  card: {
    borderWidth: 1,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 25,
  },

  row: {
    minHeight: 76,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rowContent: {
    flex: 1,
    paddingRight: 8,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  rowSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 70,
  },

  inlineDropdown: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  inlineOption: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inlineOptionText: {
    fontSize: 14,
    fontWeight: "700",
  },

  footerText: {
    marginTop: 0,
    marginHorizontal: 8,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.38)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },

  modalHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 3,
    backgroundColor:
      "rgba(128,128,128,0.45)",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },

  option: {
    minHeight: 54,
    paddingHorizontal: 15,
    borderRadius: 16,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
