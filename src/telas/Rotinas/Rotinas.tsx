import React, { useRef } from "react";
import { Box, Card, Header, StyledText, StyledButton } from "src/componentes";
import { RotinaData, useAluno } from "src/contextos/AlunoContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "src/rotas/PersonalStack";
import { FlashList } from "@shopify/flash-list";
import LottieView from "lottie-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { MotiView } from "moti";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function Rotinas() {
  const { rotinas, setRotinaSelecionada, rotinaSelecionada } = useAluno();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, "Rotinas">>();
  const { alunoNome } = route.params;

  const animation = useRef<LottieView>(null);

  const handleSelectRotina = (rotina: RotinaData) => {
    setRotinaSelecionada(rotina);
  };

  const renderRotina = ({
    item,
    index,
  }: {
    item: (typeof rotinas)[0];
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleSelectRotina(item);
          navigation.navigate("Treinos", { rotina: item });
        }}
        style={{ height: 170, zIndex: 100 }}
      >
        <MotiView
          from={{ opacity: 0, translateX: -100 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{
            type: "timing",
            duration: 500,
            delay: index * 100,
          }}
        >
          <Box
            borderBottomColor="grey"
            borderBottomWidth={1}
            marginVertical="s"
            paddingVertical="s"
            top={-20}
          >
            <Box flexDirection="row" gap="s" alignItems="center">
              <StyledText variant="title">{item.nome} -</StyledText>
              <StyledText variant="title">{item.objetivoTreino}</StyledText>
            </Box>

            <StyledText>{item.dificuldadeTreino}</StyledText>
            <StyledText>{item.divisaoTreinos}</StyledText>

            <StyledText>
              {item.dataInicio} - {item.dataTermino}
            </StyledText>
          </Box>
        </MotiView>
      </TouchableOpacity>
    );
  };

  return (
    <Box alignItems="center">
      <Header>
        <StyledText
          variant="title"
          color="white"
          style={{ right: -20, position: "absolute", top: 20, }}
        >
          Rotinas de {alunoNome}
        </StyledText>
      </Header>
      <Card variant="cardRotinas">
        <StyledButton
          style={{
            alignSelf: "flex-end",
            backgroundColor: "#263850",
            width: 130,
          }}
          label="Criar Rotina"
          onPress={() => navigation.navigate("CriarRotina")}
        />
        <FlashList
          data={rotinas}
          renderItem={renderRotina}
          estimatedItemSize={170}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Box justifyContent="center" alignItems="center">
              <LottieView
                autoPlay
                loop
                ref={animation}
                style={{
                  width: 250,
                  height: 250,
                }}
                source={require("../../../assets/EmptyAnimate.json")}
              />
              <StyledText variant="title" textAlign="center">
                Clique no botão acima para cadastrar a primeira rotina de treino
                do {alunoNome}!
              </StyledText>
            </Box>
          }
        />
      </Card>
    </Box>
  );
}
