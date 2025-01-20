import React, { ReactNode } from "react";
import { useNavigation } from "@react-navigation/native";
import Box from "./Box";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import StyledImage from "./StyledImage";
import { Pressable } from "react-native";
import StyledText from "./StyledText";

interface HeaderProps {
  children?: ReactNode;
  height?: number;
}

const Header: React.FC<HeaderProps> = ({ children, height=250 }) => {
  const navigation = useNavigation();
  return (
    <Box
      height={height}
      backgroundColor="backgroundColor"
      width="100%"
      alignItems="center"
      paddingTop="m"
    >
      <StyledImage
        source={require("../../assets/logoHeader.png")}
        style={{ height: 60, width: 250, marginTop: 20 }}
      />
      <Pressable
        style={{
          flexDirection: "row",
          alignSelf: "flex-start",
          marginTop: 20,
          left: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <EvilIcons name="chevron-left" size={30} color="white" />
        <StyledText color="white">Voltar</StyledText>
      </Pressable>
      {children}
    </Box>
  );
};

export default Header;
