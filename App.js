import React, {
  useMemo,
  useState,
} from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { BlurView } from "expo-blur";

import { getLocales } from "expo-localization";

import GeSoccerLogo from "./components/GeSoccerLogo";


/* =====================================================
   COLORS
===================================================== */

const GREEN = "#4B842F";
const GREEN_LIGHT = "#69A951";

const DARK_BACKGROUND = "#101010";
const LIGHT_BACKGROUND = "#F2F2F2";


/* =====================================================
   TRANSLATIONS
===================================================== */

const translations = {

  en: {
    matches: "Matches",
    explore: "Explore",
    transfers: "Transfers",
    news: "News",
    favorites: "Favorites",

    today: "TODAY",

    competition: "UEFA NATIONS LEAGUE",

    fullTime: "FT",

    discover: "Discover GeSoccer",

    promotionTitle:
      "All football news",

    promotionDescription:
      "Scores • Results • Standings • Transfers",

    thu: "THU. 24 SEP.",
    fri: "FRI. 25 SEP.",
    sun: "SUN. 27 SEP.",
    mon: "MON. 28 SEP.",
  },

  fr: {
    matches: "Matchs",
    explore: "Explorer",
    transfers: "Transferts",
    news: "Actualités",
    favorites: "Favoris",

    today: "AUJOURD'HUI",

    competition: "UEFA NATIONS LEAGUE",

    fullTime: "FIN",

    discover: "Découvrir GeSoccer",

    promotionTitle:
      "Toute l'actualité du football",

    promotionDescription:
      "Scores • Résultats • Classements • Transferts",

    thu: "JEU. 24 SEPT.",
    fri: "VEN. 25 SEPT.",
    sun: "DIM. 27 SEPT.",
    mon: "LUN. 28 SEPT.",
  },

  es: {
    matches: "Partidos",
    explore: "Explorar",
    transfers: "Fichajes",
    news: "Noticias",
    favorites: "Favoritos",

    today: "HOY",

    competition: "UEFA NATIONS LEAGUE",

    fullTime: "FINAL",

    discover: "Descubrir GeSoccer",

    promotionTitle:
      "Toda la actualidad del fútbol",

    promotionDescription:
      "Resultados • Clasificaciones • Fichajes",

    thu: "JUE. 24 SEPT.",
    fri: "VIE. 25 SEPT.",
    sun: "DOM. 27 SEPT.",
    mon: "LUN. 28 SEPT.",
  },

  pt: {
    matches: "Jogos",
    explore: "Explorar",
    transfers: "Transferências",
    news: "Notícias",
    favorites: "Favoritos",

    today: "HOJE",

    competition: "UEFA NATIONS LEAGUE",

    fullTime: "FIM",

    discover: "Descobrir GeSoccer",

    promotionTitle:
      "Todas as notícias de futebol",

    promotionDescription:
      "Resultados • Classificações • Transferências",

    thu: "QUI. 24 SET.",
    fri: "SEX. 25 SET.",
    sun: "DOM. 27 SET.",
    mon: "SEG. 28 SET.",
  },
};


/* =====================================================
   LANGUAGE
===================================================== */

function getDeviceLanguage() {

  const locales = getLocales();

  const language =
    locales?.[0]?.languageCode
      ?.toLowerCase();

  if (
    language &&
    translations[language]
  ) {
    return language;
  }

  return "en";
}


/* =====================================================
   MATCHES
===================================================== */

const matches = [

  {
    home: "Slovenia",
    away: "Scotland",
    homeScore: "0",
    awayScore: "0",
    homeColor: "#72B447",
    awayColor: "#253E8A",
  },

  {
    home: "Faroe Islands",
    away: "Kazakhstan",
    homeScore: "1",
    awayScore: "1",
    homeColor: "#173B8F",
    awayColor: "#214BA0",
  },

  {
    home: "Iceland",
    away: "Estonia",
    homeScore: "1",
    awayScore: "1",
    homeColor: "#2453D5",
    awayColor: "#2462CE",
  },

  {
    home: "San Marino",
    away: "Finland",
    homeScore: "0",
    awayScore: "7",
    homeColor: "#75A9DD",
    awayColor: "#2259A9",
    highlight: true,
  },

  {
    home: "Bulgaria",
    away: "Luxembourg",
    homeScore: "1",
    awayScore: "2",
    homeColor: "#9D2333",
    awayColor: "#DD4537",
  },

];


/* =====================================================
   LIQUID GLASS
===================================================== */

function Glass({
  children,
  style,
  dark,
  intensity = 55,
}) {

  return (
    <BlurView
      intensity={intensity}
      tint={
        dark
          ? "dark"
          : "light"
      }
      style={[
        styles.glass,

        {
          backgroundColor: dark
            ? "rgba(30,30,30,0.60)"
            : "rgba(255,255,255,0.72)",
        },

        style,
      ]}
    >
      {children}
    </BlurView>
  );
}


/* =====================================================
   TEAM BADGE
===================================================== */

function TeamBadge({
  color,
  name,
  dark,
}) {

  return (
    <View
      style={[
        styles.teamBadge,

        {
          borderColor: dark
            ? "rgba(255,255,255,0.20)"
            : "rgba(0,0,0,0.10)",
        },
      ]}
    >

      <View
        style={[
          styles.teamBadgeInner,
          {
            backgroundColor: color,
          },
        ]}
      >

        <Text style={styles.badgeLetter}>
          {name.charAt(0)}
        </Text>

      </View>

    </View>
  );
}


/* =====================================================
   HEADER
===================================================== */

function Header({
  dark,
  t,
}) {

  const days = [
    t.thu,
    t.fri,
    t.today,
    t.sun,
    t.mon,
  ];

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: dark
            ? "#315A25"
            : GREEN,
        },
      ]}
    >

      <View style={styles.topActions}>

        {/* FIXED ICON 1 */}

        <TouchableOpacity
          style={styles.menuButton}
        >

          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />

        </TouchableOpacity>


        {/* FIXED ICON 2 */}

        <TouchableOpacity
          style={styles.headerIcon}
        >
          <Ionicons
            name="football-outline"
            size={31}
            color="#FFF"
          />
        </TouchableOpacity>


        {/* FIXED ICON 3 */}

        <TouchableOpacity
          style={styles.headerIcon}
        >
          <Ionicons
            name="calendar-outline"
            size={31}
            color="#FFF"
          />
        </TouchableOpacity>


        {/* FIXED NOTIFICATION */}

        <TouchableOpacity
          style={styles.notification}
        >

          <Ionicons
            name="notifications-outline"
            size={30}
            color="#FFF"
          />

          <View
            style={styles.notificationBadge}
          >
            <Text
              style={styles.notificationText}
            >
              21
            </Text>
          </View>

        </TouchableOpacity>


        {/* FIXED ICON 4 */}

        <TouchableOpacity
          style={styles.headerIcon}
        >
          <Ionicons
            name="calendar"
            size={30}
            color="#FFF"
          />
        </TouchableOpacity>


        {/* FIXED SEARCH */}

        <TouchableOpacity
          style={styles.headerIcon}
        >
          <Ionicons
            name="search"
            size={32}
            color="#FFF"
          />
        </TouchableOpacity>

      </View>


      {/* DAYS */}

      <View style={styles.daySelector}>

        {days.map(
          (day, index) => (

            <TouchableOpacity
              key={day}
              style={[
                styles.day,

                index === 2 &&
                  styles.activeDay,
              ]}
            >

              <Text
                style={[
                  styles.dayText,

                  index === 2 &&
                    styles.activeDayText,
                ]}
              >
                {day}
              </Text>

              {index === 2 && (
                <View
                  style={styles.dayIndicator}
                />
              )}

            </TouchableOpacity>
          )
        )}

      </View>

    </View>
  );
}


/* =====================================================
   PROMOTION
===================================================== */

function Promotion({
  dark,
  t,
}) {

  return (
    <Glass
      dark={dark}
      intensity={45}
      style={styles.promotion}
    >

      <View
        style={styles.promotionLogo}
      >

        <GeSoccerLogo
          size={45}
          showText={true}
          dark={dark}
        />

      </View>


      <Text
        style={styles.promoTitle}
      >
        {t.promotionTitle}
      </Text>


      <Text
        style={styles.promoSmall}
      >
        {t.promotionDescription}
      </Text>


      <TouchableOpacity
        style={styles.promoButton}
      >

        <Text
          style={styles.promoButtonText}
        >
          {t.discover}
        </Text>

      </TouchableOpacity>

    </Glass>
  );
}


/* =====================================================
   COMPETITION HEADER
===================================================== */

function CompetitionHeader({
  dark,
  t,
}) {

  return (
    <Glass
      dark={dark}
      intensity={30}
      style={
        styles.competitionHeader
      }
    >

      <View
        style={styles.competitionLogo}
      >

        <Ionicons
          name="trophy"
          size={23}
          color={GREEN_LIGHT}
        />

      </View>


      <Text
        style={[
          styles.competitionTitle,

          {
            color: dark
              ? "#FFF"
              : "#333",
          },
        ]}
      >
        {t.competition}
      </Text>


      <TouchableOpacity>

        <MaterialCommunityIcons
          name="dots-vertical"
          size={30}
          color={
            dark
              ? "#FFF"
              : GREEN
          }
        />

      </TouchableOpacity>

    </Glass>
  );
}


/* =====================================================
   MATCH ROW
===================================================== */

function MatchRow({
  match,
  dark,
  t,
}) {

  return (
    <TouchableOpacity
      style={[
        styles.matchRow,

        {
          backgroundColor:
            dark
              ? "rgba(30,30,30,0.72)"
              : "rgba(255,255,255,0.80)",

          borderBottomColor:
            dark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.08)",
        },
      ]}
    >

      {/* HOME */}

      <View
        style={styles.teamColumn}
      >

        <Text
          style={[
            styles.teamName,

            {
              color:
                match.highlight
                  ? GREEN_LIGHT
                  : dark
                    ? "#FFF"
                    : "#404040",
            },
          ]}
        >
          {match.home}
        </Text>

        <TeamBadge
          color={match.homeColor}
          name={match.home}
          dark={dark}
        />

      </View>


      {/* SCORE */}

      <View
        style={styles.scoreColumn}
      >

        <View
          style={styles.scoreLine}
        >

          <Text
            style={[
              styles.score,

              {
                color:
                  match.highlight
                    ? GREEN_LIGHT
                    : dark
                      ? "#FFF"
                      : "#333",
              },
            ]}
          >
            {match.homeScore}
          </Text>


          <Text
            style={[
              styles.separator,

              {
                color:
                  dark
                    ? "#DDD"
                    : "#444",
              },
            ]}
          >
            -
          </Text>


          <Text
            style={[
              styles.score,

              {
                color:
                  match.highlight
                    ? GREEN_LIGHT
                    : dark
                      ? "#FFF"
                      : "#333",
              },
            ]}
          >
            {match.awayScore}
          </Text>

        </View>


        <Text
          style={[
            styles.fullTime,

            {
              color:
                dark
                  ? "#AAA"
                  : "#777",
            },
          ]}
        >
          {t.fullTime}
        </Text>

      </View>


      {/* AWAY */}

      <View
        style={[
          styles.teamColumn,
          {
            justifyContent:
              "flex-start",
          },
        ]}
      >

        <TeamBadge
          color={match.awayColor}
          name={match.away}
          dark={dark}
        />

        <Text
          style={[
            styles.teamName,

            {
              color:
                match.highlight
                  ? GREEN_LIGHT
                  : dark
                    ? "#FFF"
                    : "#404040",
            },
          ]}
        >
          {match.away}
        </Text>

      </View>

    </TouchableOpacity>
  );
}


/* =====================================================
   MATCHES
===================================================== */

function Matches({
  dark,
  t,
}) {

  return (
    <View
      style={styles.matchesContainer}
    >

      <CompetitionHeader
        dark={dark}
        t={t}
      />

      {matches.map(
        (match, index) => (

          <MatchRow
            key={`${match.home}-${index}`}
            match={match}
            dark={dark}
            t={t}
          />

        )
      )}

    </View>
  );
}


/* =====================================================
   BOTTOM NAVIGATION
   LES ICONES SONT VOLONTAIREMENT FIXES
===================================================== */

function BottomNavigation({
  dark,
  t,
}) {

  const [active, setActive] =
    useState("matches");


  /*
   * NE PAS MODIFIER LES ICONES.
   *
   * Elles restent toujours identiques
   * à la structure de la capture.
   */

  const items = [

    {
      id: "matches",
      label: t.matches,
      icon: "football-outline",
    },

    {
      id: "explore",
      label: t.explore,
      icon: "compass-outline",
    },

    {
      id: "transfers",
      label: t.transfers,
      icon: "swap-horizontal-outline",
    },

    {
      id: "news",
      label: t.news,
      icon: "newspaper-outline",
    },

    {
      id: "favorites",
      label: t.favorites,
      icon: "star-outline",
    },

  ];


  return (
    <Glass
      dark={dark}
      intensity={70}
      style={styles.bottomNavigation}
    >

      {items.map(
        (item) => {

          const selected =
            active === item.id;

          return (

            <TouchableOpacity
              key={item.id}
              style={styles.bottomItem}
              onPress={() =>
                setActive(item.id)
              }
            >

              <View
                style={[
                  styles.bottomIconContainer,

                  selected &&
                    styles.bottomIconActive,
                ]}
              >

                <Ionicons
                  name={item.icon}
                  size={27}
                  color={
                    selected
                      ? GREEN_LIGHT
                      : dark
                        ? "#AAA"
                        : "#777"
                  }
                />

              </View>


              <Text
                style={[
                  styles.bottomText,

                  {
                    color:
                      selected
                        ? GREEN_LIGHT
                        : dark
                          ? "#AAA"
                          : "#777",
                  },
                ]}
              >
                {item.label}
              </Text>

            </TouchableOpacity>
          );
        }
      )}

    </Glass>
  );
}


/* =====================================================
   APP
===================================================== */

export default function App() {

  const colorScheme =
    useColorScheme();

  const dark =
    colorScheme === "dark";


  const language = useMemo(
    () => getDeviceLanguage(),
    []
  );


  const t =
    translations[language] ||
    translations.en;


  return (

    <SafeAreaView
      style={[
        styles.safeArea,

        {
          backgroundColor:
            dark
              ? "#315A25"
              : GREEN,
        },
      ]}
    >

      <StatusBar
        barStyle="light-content"
        backgroundColor={
          dark
            ? "#315A25"
            : GREEN
        }
      />


      <View
        style={[
          styles.container,

          {
            backgroundColor:
              dark
                ? DARK_BACKGROUND
                : LIGHT_BACKGROUND,
          },
        ]}
      >

        <Header
          dark={dark}
          t={t}
        />


        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >

          <Promotion
            dark={dark}
            t={t}
          />


          <Matches
            dark={dark}
            t={t}
          />


          <View
            style={styles.bottomSpace}
          />

        </ScrollView>


        <BottomNavigation
          dark={dark}
          t={t}
        />

      </View>

    </SafeAreaView>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles =
  StyleSheet.create({

    safeArea: {
      flex: 1,
    },

    container: {
      flex: 1,
    },


    /* HEADER */

    header: {
      elevation: 8,

      shadowOpacity: 0.25,
      shadowRadius: 10,

      shadowOffset: {
        width: 0,
        height: 4,
      },
    },


    topActions: {
      height: 74,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-around",

      paddingHorizontal: 7,
    },


    menuButton: {
      width: 45,

      justifyContent:
        "center",

      gap: 7,
    },


    menuLine: {
      height: 4,
      width: 34,

      borderRadius: 3,

      backgroundColor:
        "#FFFFFF",
    },


    headerIcon: {
      width: 45,
      height: 45,

      alignItems: "center",
      justifyContent: "center",
    },


    notification: {
      width: 45,
      height: 45,

      alignItems: "center",
      justifyContent: "center",
    },


    notificationBadge: {
      position: "absolute",

      top: -1,
      right: -2,

      width: 25,
      height: 25,

      borderRadius: 15,

      backgroundColor:
        "#E74747",

      alignItems: "center",
      justifyContent: "center",

      borderWidth: 2,
      borderColor: GREEN,
    },


    notificationText: {
      color: "#FFF",

      fontSize: 12,

      fontWeight: "900",
    },


    /* DAYS */

    daySelector: {
      height: 66,

      flexDirection:
        "row",

      alignItems:
        "flex-end",
    },


    day: {
      flex: 1,

      height: 55,

      alignItems:
        "center",

      justifyContent:
        "center",

      position:
        "relative",
    },


    activeDay: {
      backgroundColor:
        "rgba(255,255,255,0.07)",
    },


    dayText: {
      color: "#FFF",

      fontSize: 13,

      fontWeight: "600",

      textAlign: "center",
    },


    activeDayText: {
      fontWeight: "900",
    },


    dayIndicator: {
      position: "absolute",

      bottom: 0,

      height: 5,

      width: "80%",

      backgroundColor:
        "#FFF",

      borderRadius: 5,
    },


    /* CONTENT */

    content: {
      flex: 1,
    },


    scrollContent: {
      paddingTop: 1,
      paddingBottom: 15,
    },


    /* GLASS */

    glass: {
      overflow: "hidden",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.22)",

      shadowColor:
        "#000",

      shadowOpacity:
        0.12,

      shadowRadius:
        14,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      elevation: 4,
    },


    /* PROMOTION */

    promotion: {
      margin: 12,

      borderRadius: 20,

      padding: 14,
    },


    promotionLogo: {
      marginBottom: 12,

      alignItems: "flex-start",
    },


    promoTitle: {
      color: "#FFF",

      fontSize: 17,

      fontWeight: "800",

      marginTop: 3,
    },


    promoSmall: {
      color:
        "#EAF7EA",

      fontSize: 11,

      marginTop: 10,

      marginBottom: 15,
    },


    promoButton: {
      height: 52,

      borderRadius: 16,

      backgroundColor:
        "#F7E63F",

      alignItems:
        "center",

      justifyContent:
        "center",

      elevation: 3,
    },


    promoButtonText: {
      color: GREEN,

      fontSize: 17,

      fontWeight: "900",
    },


    /* MATCHES */

    matchesContainer: {
      marginHorizontal: 10,

      borderRadius: 18,

      overflow: "hidden",

      shadowColor:
        "#000",

      shadowOpacity:
        0.12,

      shadowRadius:
        15,

      elevation: 3,
    },


    competitionHeader: {
      height: 70,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal: 15,
    },


    competitionLogo: {
      width: 40,
      height: 40,

      borderRadius: 20,

      backgroundColor:
        "rgba(75,132,47,0.12)",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    competitionTitle: {
      flex: 1,

      marginLeft: 12,

      fontSize: 17,

      fontWeight: "900",
    },


    /* MATCH */

    matchRow: {
      minHeight: 105,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal: 12,

      borderBottomWidth: 1,
    },


    teamColumn: {
      flex: 1,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "flex-end",

      gap: 9,
    },


    teamName: {
      fontSize: 16,

      fontWeight: "500",
    },


    teamBadge: {
      width: 40,
      height: 40,

      borderRadius: 20,

      borderWidth: 2,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.15)",
    },


    teamBadgeInner: {
      width: 29,
      height: 29,

      borderRadius: 15,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    badgeLetter: {
      color: "#FFF",

      fontSize: 13,

      fontWeight: "900",
    },


    scoreColumn: {
      width: 82,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    scoreLine: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    score: {
      fontSize: 30,

      fontWeight: "600",

      minWidth: 28,

      textAlign:
        "center",
    },


    separator: {
      fontSize: 25,

      marginHorizontal: 4,
    },


    fullTime: {
      fontSize: 14,

      fontWeight: "800",

      marginTop: 1,
    },


    /* BOTTOM */

    bottomNavigation: {
      height: 82,

      borderTopWidth: 1,

      borderTopColor:
        "rgba(255,255,255,0.15)",

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-around",

      borderRadius: 0,
    },


    bottomItem: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      height: "100%",
    },


    bottomIconContainer: {
      width: 43,
      height: 34,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius: 18,
    },


    bottomIconActive: {
      backgroundColor:
        "rgba(75,132,47,0.13)",
    },


    bottomText: {
      fontSize: 12,

      marginTop: 4,

      fontWeight: "600",
    },


    bottomSpace: {
      height: 25,
    },

  });
