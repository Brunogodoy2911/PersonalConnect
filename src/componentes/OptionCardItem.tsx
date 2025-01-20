import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Box from "./Box";
import StyledText from "./StyledText";

interface OptionCardItemProps {
  iconName: keyof typeof Entypo.glyphMap;
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const OptionCardItem: React.FC<OptionCardItemProps> = ({
  iconName,
  text,
  onPress,
  style,
}) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        flexDirection="row"
        gap="s"
        alignItems="center"
        borderBottomColor="grey"
        borderBottomWidth={1}
        paddingBottom="s"
        marginBottom="s"
        style={style}
      >
        <Box
          backgroundColor="backgroundColorDetalhes"
          padding="s"
          borderRadius={100}
        >
          <Entypo name={iconName} size={20} color="#008efa" />
        </Box>
        <StyledText style={{ top: 3 }}>{text}</StyledText>
      </Box>
    </Pressable>
  );
};

export default OptionCardItem;
