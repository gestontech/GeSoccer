export const translations = {
  fr: {
    matches: "Matchs",
    explore: "Explorer",
    transfers: "Transferts",
    news: "Info",
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

    findMatch: "Trouver un match",
    settings: "Réglages",
    about: "Qui sommes-nous ?",
    reportProblem: "Soumettre un problème",
    removeAds: "Retirer les publicités",

    login: "Se connecter",
    loginSubtitle:
      "Connectez-vous à votre compte",

    emptyFavorites:
      "Vos favoris apparaîtront ici.",
  },

  en: {
    matches: "Matches",
    explore: "Explore",
    transfers: "Transfers",
    news: "Info",
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

    findMatch: "Find a match",
    settings: "Settings",
    about: "About us",
    reportProblem: "Report a problem",
    removeAds: "Remove ads",

    login: "Sign in",
    loginSubtitle:
      "Sign in to your account",

    emptyFavorites:
      "Your favorites will appear here.",
  },

  es: {
    matches: "Partidos",
    explore: "Explorar",
    transfers: "Fichajes",
    news: "Info",
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

    findMatch: "Buscar un partido",
    settings: "Ajustes",
    about: "Quiénes somos",
    reportProblem: "Informar de un problema",
    removeAds: "Eliminar publicidad",

    login: "Iniciar sesión",
    loginSubtitle:
      "Inicia sesión en tu cuenta",

    emptyFavorites:
      "Tus favoritos aparecerán aquí.",
  },

  pt: {
    matches: "Jogos",
    explore: "Explorar",
    transfers: "Transferências",
    news: "Info",
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

    findMatch: "Encontrar um jogo",
    settings: "Configurações",
    about: "Sobre nós",
    reportProblem: "Comunicar um problema",
    removeAds: "Remover anúncios",

    login: "Iniciar sessão",
    loginSubtitle:
      "Inicie sessão na sua conta",

    emptyFavorites:
      "Os seus favoritos aparecerão aqui.",
  },
};

export function getTranslations(
  languageCode
) {
  return (
    translations[languageCode] ||
    translations.en
  );
}
