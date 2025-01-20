import { createTheme } from "@shopify/restyle";

import { colors } from "./colors";
import { textVariants } from "./textVariants";
import { spacing } from "./spacing";
import { cardVariants } from "./cardVariants";

const Theme = createTheme({
  colors,
  textVariants,
  spacing,
  cardVariants,
});

type ThemeProps = typeof Theme;

export { Theme, ThemeProps };
