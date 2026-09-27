import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Stop,
} from "react-native-svg";

export default function GeSoccerLogo({
  size = 88,
  showShadow = true,
}) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.24,
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
          <LinearGradient
            id="bg"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <Stop
              offset="0"
              stopColor="#72B94B"
            />
            <Stop
              offset="0.5"
              stopColor="#4B842F"
            />
            <Stop
              offset="1"
              stopColor="#244C1C"
            />
          </LinearGradient>

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
              stopOpacity="0.42"
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

          <RadialGradient
            id="shine"
            cx="28%"
            cy="18%"
            r="80%"
          >
            <Stop
              offset="0"
              stopColor="#FFFFFF"
              stopOpacity="0.7"
            />
            <Stop
              offset="0.35"
              stopColor="#FFFFFF"
              stopOpacity="0.14"
            />
            <Stop
              offset="1"
              stopColor="#FFFFFF"
              stopOpacity="0"
            />
          </RadialGradient>

          <RadialGradient
            id="ball"
            cx="30%"
            cy="24%"
            r="75%"
          >
            <Stop
              offset="0"
              stopColor="#FFFFFF"
            />
            <Stop
              offset="0.72"
              stopColor="#F5F8F4"
            />
            <Stop
              offset="1"
              stopColor="#D7E2D5"
            />
          </RadialGradient>
        </Defs>

        {/* Fond */}
        <Circle
          cx="512"
          cy="512"
          r="500"
          fill="url(#bg)"
        />

        {/* Verre */}
        <Circle
          cx="512"
          cy="512"
          r="470"
          fill="url(#glass)"
          stroke="#FFFFFF"
          strokeOpacity="0.28"
          strokeWidth="10"
        />

        {/* Anneau principal */}
        <Circle
          cx="512"
          cy="512"
          r="365"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.9"
          strokeWidth="27"
          strokeDasharray="990 300"
          strokeLinecap="round"
          transform="rotate(-30 512 512)"
        />

        {/* Anneau secondaire */}
        <Circle
          cx="512"
          cy="512"
          r="405"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.18"
          strokeWidth="12"
          strokeDasharray="250 950"
          strokeLinecap="round"
          transform="rotate(120 512 512)"
        />

        {/* Halo */}
        <Circle
          cx="512"
          cy="512"
          r="255"
          fill="#FFFFFF"
          fillOpacity="0.1"
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

        {/* Motif du ballon */}
        <G>
          <Polygon
            points="512,418 565,457 545,520 479,520 459,457"
            fill="#4B842F"
          />

          <Path
            d="M512 418 L512 370"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <Path
            d="M565 457 L622 425"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <Path
            d="M545 520 L580 575"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <Path
            d="M479 520 L444 575"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <Path
            d="M459 457 L402 425"
            stroke="#4B842F"
            strokeWidth="18"
            strokeLinecap="round"
          />
        </G>

        {/* Reflet */}
        <Circle
          cx="512"
          cy="512"
          r="470"
          fill="url(#shine)"
        />

        <Path
          d="M180 282 C300 130 510 105 690 175"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.34"
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
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },
});
