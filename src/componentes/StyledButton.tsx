import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native";

import Box from "./Box";
import StyledText from "./StyledText";

interface IStyledButtonProps {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactElement;
  style?: ViewStyle;
}

const StyledButton: React.FC<IStyledButtonProps> = ({
  label,
  loading,
  disabled,
  onPress,
  children,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} {...{ disabled }}>
      <Box
        height={40}
        width={300}
        marginVertical="m"
        backgroundColor="backgroundButton"
        justifyContent="center"
        alignItems="center"
        borderRadius={5}
        opacity={disabled ? 0.5 : 1}
        style={style}
      >
        {loading ? (
          <ActivityIndicator color="white" size={20} />
        ) : label ? (
          <StyledText variant="textButton" color="white">
            {label}
          </StyledText>
        ) : (
          children
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default StyledButton;
