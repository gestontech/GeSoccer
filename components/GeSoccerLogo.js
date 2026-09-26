import React from "react";

import Svg, {
  Circle,
  Path,
  Polygon,
  Text as SvgText,
} from "react-native-svg";

export default function GeSoccerLogo({
  size = 100,
  showText = true,
  dark = false,
}) {
  const green = "#4B842F";
  const lightGreen = "#75B85A";

  return (
    <Svg
      width={showText ? size * 2.8 : size}
      height={size}
      viewBox={
        showText
          ? "0 0 280 100"
          : "0 0 100 100"
      }
    >

      {/* Cercle extérieur */}

      <Circle
        cx="50"
        cy="50"
        r="45"
        fill={green}
      />

      <Circle
        cx="50"
        cy="50"
        r="39"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        opacity="0.8"
      />

      {/* Orbite */}

      <Path
        d="
          M18 64
          C30 20 73 14 88 43
          C96 59 77 82 53 85
          C35 87 21 78 18 64
        "
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.95"
      />

      {/* Ballon */}

      <Circle
        cx="50"
        cy="50"
        r="18"
        fill="#FFFFFF"
      />

      {/* Pentagone central */}

      <Polygon
        points="
          50,39
          60,46
          56,58
          44,58
          40,46
        "
        fill={green}
      />

      {/* Lignes du ballon */}

      <Path
        d="M50 39 L50 31"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <Path
        d="M60 46 L70 42"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <Path
        d="M56 58 L62 67"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <Path
        d="M44 58 L38 67"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <Path
        d="M40 46 L30 42"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Nom */}

      {showText && (
        <>
          <SvgText
            x="108"
            y="61"
            fill={dark ? "#FFFFFF" : green}
            fontSize="38"
            fontWeight="900"
            letterSpacing="-1"
          >
            Ge
          </SvgText>

          <SvgText
            x="163"
            y="61"
            fill={dark ? "#FFFFFF" : "#69A951"}
            fontSize="38"
            fontWeight="900"
            letterSpacing="-1"
          >
            Soccer
          </SvgText>
        </>
      )}

    </Svg>
  );
}
