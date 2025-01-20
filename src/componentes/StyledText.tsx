import { createText } from "@shopify/restyle";
import { ThemeProps } from "../tema";
import React from "react";
import Box from "./Box";
import { MotiView } from "moti";

const Text = createText<ThemeProps>();

interface StyledTextProps extends React.ComponentProps<typeof Text> {
  loading?: boolean;
}

const StyledText: React.FC<StyledTextProps> = ({
  loading,
  children,
  ...rest
}) => {
  return (
    <Box>
      {loading ? (
        <MotiView
          from={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 800 }}
          style={{
            width: 120,
            height: 20,
            backgroundColor: "#E0E0E0",
            borderRadius: 4,
          }}
        />
      ) : (
        // Exibe o texto real quando não estiver carregando
        <Text {...rest}>{children}</Text>
      )}
    </Box>
  );
};

export default StyledText;
