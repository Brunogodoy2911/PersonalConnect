import React from "react";
import {
  Box,
  StyledText,
  Avatar,
  Card,
  Header,
  OptionCardItem,
} from "src/componentes";
import { AnimatePresence, MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/rotas/PersonalStack";
import { useAuth } from "src/contextos/AuthContext";
import { usePersonal } from "src/contextos/PersonalContext";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function DetalhePerfil() {
  const { signOut } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { personalData, loading } = usePersonal();

  const handleLogout = () => {
    signOut();
  };

  return (
    <Box flex={1} alignItems="center">
      <Header>
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap="s"
          alignSelf="flex-start"
          marginLeft="m"
          marginTop="s"
        >
          <Avatar
            loading={loading}
            src={{ uri: personalData?.foto }}
            size={50}
          />
          <StyledText loading={loading} style={{ top: 3 }} color="white">
            {personalData?.nome || "Usuário"}
          </StyledText>
        </Box>
      </Header>

      <Box
        flex={1}
        backgroundColor="whiteGrey"
        width="100%"
        alignItems="center"
      >
        <AnimatePresence>
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "timing",
              duration: 500,
            }}
          >
            <Card variant="cardDetail">
              <OptionCardItem
                iconName="edit"
                text="Editar Perfil"
                onPress={() => navigation.navigate("EditProfile")}
              />

              <OptionCardItem
                iconName="log-out"
                text="Deslogar"
                onPress={handleLogout}
                style={{ borderBottomWidth: 0 }}
              />
            </Card>
          </MotiView>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
