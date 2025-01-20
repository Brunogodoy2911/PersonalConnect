import { TextInput, TextInputProps } from "react-native";
import {
  createRestyleComponent,
  spacing,
  backgroundColor,
  color,
  layout,
  typography,
  SpacingProps,
  BackgroundColorProps,
  ColorProps,
  BorderProps,
  LayoutProps,
  TypographyProps,
} from "@shopify/restyle";
import { ThemeProps } from "src/tema";

type InputProps = TextInputProps &
  SpacingProps<ThemeProps> &
  BackgroundColorProps<ThemeProps> &
  ColorProps<ThemeProps> &
  BorderProps<ThemeProps> &
  LayoutProps<ThemeProps> &
  TypographyProps<ThemeProps> & {
    variant?: string;
  };

const Input = createRestyleComponent<InputProps, ThemeProps>(
  [spacing, backgroundColor, color, layout, typography],
  TextInput
);

export default Input;
