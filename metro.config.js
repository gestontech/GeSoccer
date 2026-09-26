const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Expo Router utilise le système de résolution Metro d'Expo.
// On désactive ici la résolution "exports" moderne pour éviter
// certains conflits de compatibilité avec des dépendances SDK 54.
config.resolver.unstable_enablePackageExports = false;

// Désactivation du support expérimental des imports CommonJS.
// Cela évite d'ajouter une couche expérimentale au bundling.
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};

module.exports = config;
