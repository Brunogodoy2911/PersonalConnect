import React from 'react';
import {
  createRestyleComponent,
  createVariant,
  spacing,
  SpacingProps,
  VariantProps,
} from '@shopify/restyle';
import { ThemeProps } from '../tema';

type Props = SpacingProps<ThemeProps> & VariantProps<ThemeProps, 'cardVariants'> & {
  children: React.ReactNode;
};

const Card = createRestyleComponent<Props, ThemeProps>([
  spacing,
  createVariant({ themeKey: 'cardVariants' }),
]);

export default Card;
