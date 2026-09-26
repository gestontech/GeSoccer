export const translations = {
  fr: {
    matches: "Matchs",
    explore: "Explorer",
    transfers: "Transferts",
    news: "Actualités",
    favorites: "Favoris",

    today: "AUJOURD'HUI",

    discover: "Découvrir GeSoccer",

    promotionTitle:
      "Toute l'actualité du football",

    promotionDescription:
      "Scores • Résultats • Classements • Transferts",

    search: "Rechercher",
    calendar: "Calendrier",
    notifications: "Notifications",

    noMatches: "Aucun match",
    upcoming: "À venir",
    finished: "Terminés",

    competitions: "Compétitions",
    teams: "Équipes",
    players: "Joueurs",

    emptyFavorites:
      "Vos favoris apparaîtront ici.",
  },

  en: {
    matches: "Matches",
    explore: "Explore",
    transfers: "Transfers",
    news: "News",
    favorites: "Favorites",

    today: "TODAY",

    discover: "Discover GeSoccer",

    promotionTitle:
      "All football news",

    promotionDescription:
      "Scores • Results • Standings • Transfers",

    search: "Search",
    calendar: "Calendar",
    notifications: "Notifications",

    noMatches: "No matches",
    upcoming: "Upcoming",
    finished: "Finished",

    competitions: "Competitions",
    teams: "Teams",
    players: "Players",

    emptyFavorites:
      "Your favorites will appear here.",
  },

  es: {
    matches: "Partidos",
    explore: "Explorar",
    transfers: "Fichajes",
    news: "Noticias",
    favorites: "Favoritos",

    today: "HOY",

    discover: "Descubrir GeSoccer",

    promotionTitle:
      "Toda la actualidad del fútbol",

    promotionDescription:
      "Resultados • Clasificaciones • Fichajes",

    search: "Buscar",
    calendar: "Calendario",
    notifications: "Notificaciones",

    noMatches: "Sin partidos",
    upcoming: "Próximos",
    finished: "Finalizados",

    competitions: "Competiciones",
    teams: "Equipos",
    players: "Jugadores",

    emptyFavorites:
      "Tus favoritos aparecerán aquí.",
  },

  pt: {
    matches: "Jogos",
    explore: "Explorar",
    transfers: "Transferências",
    news: "Notícias",
    favorites: "Favoritos",

    today: "HOJE",

    discover: "Descobrir GeSoccer",

    promotionTitle:
      "Todas as notícias de futebol",

    promotionDescription:
      "Resultados • Classificações • Transferências",

    search: "Pesquisar",
    calendar: "Calendário",
    notifications: "Notificações",

    noMatches: "Sem jogos",
    upcoming: "Próximos",
    finished: "Finalizados",

    competitions: "Competições",
    teams: "Equipes",
    players: "Jogadores",

    emptyFavorites:
      "Os seus favoritos aparecerão aqui.",
  },
};

export function getTranslations(languageCode) {
  return (
    translations[languageCode] ||
    translations.en
  );
}
