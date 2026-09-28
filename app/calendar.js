import React, {
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAppTheme } from "../theme/useAppTheme";
import { useDateSelection } from "../context/DateSelectionContext";

const GREEN = "#4B842F";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const WEEKDAYS = [
  "DIM.",
  "LUN.",
  "MAR.",
  "MER.",
  "JEU.",
  "VEN.",
  "SAM.",
];

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDateKey(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function createCalendarDays(year, month) {
  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const previousMonthDays =
    new Date(year, month, 0).getDate();

  const result = [];

  /*
   * Dimanche = 0
   * Lundi = 1
   * ...
   * Samedi = 6
   */
  for (
    let index = firstDay - 1;
    index >= 0;
    index -= 1
  ) {
    const day =
      previousMonthDays - index;

    let previousMonth = month - 1;
    let previousYear = year;

    if (previousMonth < 0) {
      previousMonth = 11;
      previousYear -= 1;
    }

    result.push({
      day,
      month: previousMonth,
      year: previousYear,
      currentMonth: false,
      key: formatDateKey(
        previousYear,
        previousMonth,
        day
      ),
    });
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    result.push({
      day,
      month,
      year,
      currentMonth: true,
      key: formatDateKey(
        year,
        month,
        day
      ),
    });
  }

  let nextDay = 1;

  while (result.length % 7 !== 0) {
    let nextMonth = month + 1;
    let nextYear = year;

    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }

    result.push({
      day: nextDay,
      month: nextMonth,
      year: nextYear,
      currentMonth: false,
      key: formatDateKey(
        nextYear,
        nextMonth,
        nextDay
      ),
    });

    nextDay += 1;
  }

  return result;
}

export default function CalendarScreen() {
  const { colors, dark } =
    useAppTheme();

  const {
    selectedDate,
    selectDate,
    liveMode,
  } = useDateSelection();

  const now = new Date();

  const [visibleMonth, setVisibleMonth] =
    useState(() => ({
      year: now.getFullYear(),
      month: now.getMonth(),
    }));

  const todayKey = formatDateKey(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const days = useMemo(
    () =>
      createCalendarDays(
        visibleMonth.year,
        visibleMonth.month
      ),
    [
      visibleMonth.year,
      visibleMonth.month,
    ]
  );

  const goPreviousMonth = () => {
    setVisibleMonth((current) => {
      if (current.month === 0) {
        return {
          year: current.year - 1,
          month: 11,
        };
      }

      return {
        year: current.year,
        month: current.month - 1,
      };
    });
  };

  const goNextMonth = () => {
    setVisibleMonth((current) => {
      if (current.month === 11) {
        return {
          year: current.year + 1,
          month: 0,
        };
      }

      return {
        year: current.year,
        month: current.month + 1,
      };
    });
  };

  const handleDatePress = (item) => {
    selectDate(item.key);

    if (liveMode) {
      selectDate(item.key);
    }

    router.back();
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* EN-TÊTE */}
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor:
                dark
                  ? "rgba(35,35,35,0.78)"
                  : "rgba(255,255,255,0.78)",
              borderColor:
                colors.border,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          <View style={styles.calendarIcon}>
            <Ionicons
              name="calendar-outline"
              size={22}
              color={GREEN}
            />
          </View>

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Calendrier
          </Text>
        </View>

        {/* MOIS + NAVIGATION */}
        <View
          style={[
            styles.monthCard,
            {
              backgroundColor:
                dark
                  ? "rgba(35,35,35,0.72)"
                  : "rgba(255,255,255,0.78)",
              borderColor:
                colors.border,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goPreviousMonth}
            style={styles.monthArrow}
            accessibilityRole="button"
            accessibilityLabel="Mois précédent"
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.monthTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {MONTHS[visibleMonth.month]}{" "}
            {visibleMonth.year}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goNextMonth}
            style={styles.monthArrow}
            accessibilityRole="button"
            accessibilityLabel="Mois suivant"
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* CALENDRIER */}
        <View
          style={[
            styles.calendarCard,
            {
              backgroundColor:
                dark
                  ? "rgba(35,35,35,0.70)"
                  : "rgba(255,255,255,0.76)",
              borderColor:
                colors.border,
            },
          ]}
        >
          {/* JOURS DE LA SEMAINE */}
          <View style={styles.weekRow}>
            {WEEKDAYS.map((weekday) => (
              <View
                key={weekday}
                style={styles.weekdayCell}
              >
                <Text
                  style={[
                    styles.weekdayText,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  {weekday}
                </Text>
              </View>
            ))}
          </View>

          {/* GRILLE */}
          <View style={styles.daysGrid}>
            {days.map((item) => {
              const isToday =
                item.key === todayKey;

              const isSelected =
                !liveMode &&
                item.key === selectedDate;

              return (
                <TouchableOpacity
                  key={`${item.key}-${item.currentMonth}`}
                  activeOpacity={0.75}
                  onPress={() =>
                    handleDatePress(item)
                  }
                  style={styles.dayCell}
                  disabled={!item.currentMonth}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      isToday &&
                        styles.todayCircle,
                      isSelected &&
                        !isToday &&
                        styles.selectedCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color:
                            item.currentMonth
                              ? colors.text
                              : colors.textSecondary,
                        },
                        !item.currentMonth &&
                          styles.otherMonthText,
                        isToday &&
                          styles.todayText,
                        isSelected &&
                          !isToday &&
                          styles.selectedText,
                      ]}
                    >
                      {item.day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* RETOUR À AUJOURD'HUI */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setVisibleMonth({
              year: now.getFullYear(),
              month: now.getMonth(),
            });

            selectDate(todayKey);

            router.back();
          }}
          style={[
            styles.todayButton,
            {
              backgroundColor: GREEN,
            },
          ]}
        >
          <Ionicons
            name="today-outline"
            size={19}
            color="#FFFFFF"
          />

          <Text style={styles.todayButtonText}>
            Aujourd'hui
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  headerCard: {
    minHeight: 64,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  calendarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(75,132,47,0.12)",
    marginLeft: 2,
  },

  headerTitle: {
    marginLeft: 11,
    fontSize: 19,
    fontWeight: "900",
  },

  monthCard: {
    minHeight: 68,
    marginTop: 14,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
  },

  monthArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  monthTitle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  calendarCard: {
    marginTop: 14,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 15,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },

  weekRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 8,
  },

  weekdayCell: {
    width: "14.2857%",
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  weekdayText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },

  dayCell: {
    width: "14.2857%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  dayText: {
    fontSize: 15,
    fontWeight: "700",
  },

  otherMonthText: {
    opacity: 0.28,
  },

  todayCircle: {
    backgroundColor: GREEN,
  },

  todayText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  selectedCircle: {
    backgroundColor:
      "rgba(75,132,47,0.16)",
    borderWidth: 1.5,
    borderColor: GREEN,
  },

  selectedText: {
    color: GREEN,
    fontWeight: "900",
  },

  todayButton: {
    height: 52,
    marginTop: 16,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 4,
  },

  todayButtonText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "900",
  },
});
