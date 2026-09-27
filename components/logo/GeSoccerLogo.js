import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Polygon,
  G,
} from "react-native-svg";

export default function GeSoccerLogo({
  size = 96,
  showShadow = true,
}) {
  const scale = size / 1024;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.23,
        },
        showShadow && styles.shadow,
      ]}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
      >
        <Defs>
          {/* Fond vert GeSoccer */}
          <LinearGradient
            id="background"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <Stop offset="0" stopColor="#6BAF43" />
            <Stop offset="0.45" stopColor="#4B842F" />
            <Stop offset="1" stopColor="#28551F" />
          </LinearGradient>

          {/* Effet verre */}
          <LinearGradient
            id="glass"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <Stop
              offset="0"
              stopColor="#FFFFFF"
              stopOpacity="0.38"
            />
            <Stop
              offset="0.45"
              stopColor="#FFFFFF"
              stopOpacity="0.12"
            />
            <Stop
              offset="1"
              stopColor="#FFFFFF"
              stopOpacity="0.03"
            />
          </LinearGradient>

          {/* Reflet */}
          <RadialGradient
            id="highlight"
            cx="30%"
            cy="20%"
            r="80%"
          >
            <Stop
              offset="0"
              stopColor="#FFFFFF"
              stopOpacity="0.65"
            />
            <Stop
              offset="0.4"
              stopColor="#FFFFFF"
              stopOpacity="0.12"
            />
            <Stop
              offset="1"
              stopColor="#FFFFFF"
              stopOpacity="0"
            />
          </RadialGradient>

          {/* Ballon */}
          <RadialGradient
            id="ball"
            cx="32%"
            cy="25%"
            r="75%"
          >
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="0.7" stopColor="#F4F7F3" />
            <Stop offset="1" stopColor="#D8E2D6" />
          </RadialGradient>
        </Defs>

        {/* Fond principal */}
        <Circle
          cx="512"
          cy="512"
          r="500"
          fill="url(#background)"
        />

        {/* Couche Liquid Glass */}
        <Circle
          cx="512"
          cy="512"
          r="475"
          fill="url(#glass)"
          stroke="#FFFFFF"
          strokeOpacity="0.28"
          strokeWidth="10"
        />

        {/* Anneau dynamique */}
        <Circle
          cx="512"
          cy="512"
          r="365"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.88"
          strokeWidth="28"
          strokeDasharray="980 300"
          strokeLinecap="round"
          transform="rotate(-28 512 512)"
        />

        {/* Deuxième reflet de l'anneau */}
        <Circle
          cx="512"
          cy="512"
          r="405"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.16"
          strokeWidth="12"
          strokeDasharray="260 900"
          strokeLinecap="round"
          transform="rotate(125 512 512)"
        />

        {/* Halo du ballon */}
        <Circle
          cx="512"
          cy="512"
          r="250"
          fill="#FFFFFF"
          fillOpacity="0.10"
        />

        {/* Ballon */}
        <Circle
          cx="512"
          cy="512"
          r="205"
          fill="url(#ball)"
          stroke="#FFFFFF"
          strokeWidth="8"
        />

        {/* Motif central du ballon */}
        <G>
          <Polygon
            points="512,418 565,457 545,520 479,520 459,457"
            fill="#4B842F"
          />

          {/* Branche supérieure */}
          <Path
            d="M512 418 L512 370"
            fill="none"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Branche haut droite */}
          <Path
            d="M565 457 L622 425"
            fill="none"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Branche bas droite */}
          <Path
            d="M545 520 L580 575"
            fill="none"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Branche bas gauche */}
          <Path
            d="M479 520 L444 575"
            fill="none"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Branche haut gauche */}
          <Path
            d="M459 457 L402 425"
            fill="none"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />
        </G>

        {/* Reflet Liquid Glass */}
        <Circle
          cx="512"
          cy="512"
          r="475"
          fill="url(#highlight)"
        />

        {/* Petit reflet supérieur */}
        <Path
          d="M175 285 C300 125 515 105 690 175"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.35"
          strokeWidth="24"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 12,
  },
});
