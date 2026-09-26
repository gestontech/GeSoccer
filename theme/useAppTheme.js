import { useColorScheme } from "react-native";
import { colors } from "./colors";

export function useAppTheme() {
  const scheme = useColorScheme();

  const dark = scheme === "dark";
  const palette = dark ? colors.dark : colors.light;

  return {
    dark,
    colors: palette,
    brand: colors,
  };
}
