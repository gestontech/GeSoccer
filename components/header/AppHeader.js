import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useDateSelection } from "../../context/DateSelectionContext";
import SideMenu from "../menu/SideMenu";
import { footballApi } from "../../services/football";

const GREEN = "#4B842F";

const LIVE_STATUSES = [
  "1H",
  "2H",
  "ET",
  "P",
  "LIVE",
];

function isLiveFixture(item) {
  return LIVE_STATUSES.includes(
    item?.fixture?.status?.short
  );
}

export default function AppHeader() {
  const {
    dates,
    todayKey,
    yesterdayKey,
    tomorrowKey,
    selectedDate,
    liveMode,
    selectDate,
    selectLive,
  } = useDateSelection();

  const [menuVisible, setMenuVisible] =
    useState(false);

  const [liveCount, setLiveCount] =
    useState(0);

  /*
   * Récupère le nombre réel de matchs
   * actuellement en direct.
   */
  const loadLiveCount = useCallback(
    async ({ forceRefresh = false } = {}) => {
      try {
        const response =
          await footballApi.live(
            {},
            {
              forceRefresh,
            }
          );

        const list = Array.isArray(
          response?.response
        )
          ? response.response
          : [];

        const count = list.filter(
          isLiveFixture
        ).length;

        setLiveCount(count);
      } catch {
        // On garde la dernière valeur connue.
      }
    },
    []
  );

  /*
   * Chargement initial du compteur.
   */
  useEffect(() => {
    loadLiveCount();
  }, [loadLiveCount]);

  /*
   * Actualisation toutes les 60 secondes.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      loadLiveCount({
        forceRefresh: true,
      });
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loadLiveCount]);

  /*
   * Libellé des dates.
   */
  const getDateLabel = (item) => {
    if (item.key === yesterdayKey) {
      return "HIER";
    }

    if (item.key === todayKey) {
      return "AUJOURD'HUI";
    }

    if (item.key === tomorrowKey) {
      return "DEMAIN";
    }

    return item.label;
  };

  return (
    <>
      <View style={styles.container}>
        {/* ========================= */}
        {/* BARRE SUPÉRIEURE */}
        {/* ========================= */}

        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.75}
            onPress={() =>
              setMenuVisible(true)
            }
          >
            <View style={styles.menu}>
              <View style={styles.line} />
              <View style={styles.line} />
              <View style={styles.line} />
            </View>
          </TouchableOpacity>

          <View style={styles.rightActions}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.75}
              onPress={() =>
                router.push("/calendar")
              }
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.75}
              onPress={() =>
                router.push("/search")
              }
            >
              <Ionicons
                name="search-outline"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================= */}
        {/* DATES */}
        {/* ========================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.dateScroller
          }
        >
          {dates.map((item) => {
            /*
             * IMPORTANT :
             * Au lancement, selectedDate est
             * automatiquement aujourd'hui.
             */
            const selected =
              !liveMode &&
              item.key === selectedDate;

            return (
              <React.Fragment key={item.key}>
                {/* DATE */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    selectDate(item.key)
                  }
                  style={[
                    styles.dateItem,
                    selected &&
                      styles.dateItemSelected,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.dateText,
                      selected &&
                        styles.dateTextSelected,
                    ]}
                  >
                    {getDateLabel(item)}
                  </Text>

                  {selected && (
                    <View
                      style={
                        styles.dateIndicator
                      }
                    />
                  )}
                </TouchableOpacity>

                {/* EN DIRECT */}
                {item.key === todayKey && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={selectLive}
                    style={[
                      styles.liveItem,
                      liveMode &&
                        styles.liveItemSelected,
                    ]}
                  >
                    <View
                      style={
                        styles.liveContent
                      }
                    >
                      <View
                        style={[
                          styles.liveDot,
                          liveMode &&
                            styles.liveDotActive,
                        ]}
                      />

                      <Text
                        numberOfLines={1}
                        style={[
                          styles.dateText,
                          liveMode &&
                            styles.dateTextSelected,
                        ]}
                      >
                        EN DIRECT
                      </Text>

                      {liveCount > 0 && (
                        <View
                          style={
                            styles.countBadge
                          }
                        >
                          <Text
                            style={
                              styles.countText
                            }
                          >
                            {liveCount}
                          </Text>
                        </View>
                      )}
                    </View>

                    {liveMode && (
                      <View
                        style={
                          styles.dateIndicator
                        }
                      />
                    )}
                  </TouchableOpacity>
                )}
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>

      {/* MENU */}
      <SideMenu
        visible={menuVisible}
        onClose={() =>
          setMenuVisible(false)
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 126,
    width: "100%",
    backgroundColor: GREEN,
    elevation: 8,
    shadowOpacity: 0,
  },

  topRow: {
    height: 78,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  menu: {
    width: 20,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  line: {
    width: 20,
    height: 2.5,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  actionButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  dateScroller: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    alignItems: "center",
  },

  dateItem: {
    minWidth: 72,
    height: 40,
    marginHorizontal: 2,
    paddingHorizontal: 8,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  liveItem: {
    minWidth: 108,
    height: 40,
    marginHorizontal: 2,
    paddingHorizontal: 10,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  liveContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
    backgroundColor:
      "rgba(255,255,255,0.78)",
  },

  liveDotActive: {
    backgroundColor: "#FFFFFF",
  },

  dateItemSelected: {
    backgroundColor:
      "rgba(255,255,255,0.22)",
  },

  liveItemSelected: {
    backgroundColor:
      "rgba(255,255,255,0.22)",
  },

  dateText: {
    color:
      "rgba(255,255,255,0.78)",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  dateTextSelected: {
    color: "#FFFFFF",
  },

  countBadge: {
    marginLeft: 5,
    minWidth: 20,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  countText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },

  dateIndicator: {
    position: "absolute",
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
});
