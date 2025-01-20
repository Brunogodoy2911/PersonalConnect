import React from "react";
import {
  Box,
  Header,
  Avatar,
  StyledText,
  OptionCardItem,
  Card,
} from "src/componentes";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/rotas/AlunoStack";
import { useAuth } from "src/contextos/AuthContext";
import { useAluno } from "src/contextos/AlunoContext";
import { AnimatePresence, MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function DetalhePerfilAluno() {
  const navigation = useNavigation<NavigationProp>();
  const { signOut } = useAuth();
  const { alunoRootData, loadingAlunoData } = useAluno();

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
            loading={loadingAlunoData}
            src={{ uri: alunoRootData?.foto }}
            size={50}
          />
          <StyledText
            loading={loadingAlunoData}
            style={{ top: 3 }}
            color="white"
          >
            {alunoRootData?.nome || "Usuário"}
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
                onPress={() => navigation.navigate("EditAluno")}
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
