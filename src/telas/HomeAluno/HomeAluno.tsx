import { Pressable, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { Avatar, Box, Card, StyledImage, StyledText } from "src/componentes";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/rotas/AlunoStack";
import { RotinaData, useAluno } from "src/contextos/AlunoContext";
import { FlashList } from "@shopify/flash-list";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { MotiView } from "moti";
import LottieView from "lottie-react-native";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeAluno() {
  const { alunoRootData, loadingAlunoData, rotinas, setRotinaSelecionada } =
    useAluno();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, "TreinosAluno">>();

  const animation = useRef<LottieView>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Bom dia";
    } else if (hour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };

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
          navigation.navigate("TreinosAluno", {rotina: item});
        }}
        style={{ height: 200, zIndex: 100 }}
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
    <Box flex={1} alignItems="center">
      <Box
        height={210}
        backgroundColor="backgroundColor"
        width="100%"
        alignItems="center"
      >
        <StyledImage
          source={require("../../../assets/logoHeader.png")}
          style={{ height: 50, width: 250, marginTop: 50 }}
        />

        <Box
          flexDirection="row"
          gap="s"
          justifyContent="center"
          alignItems="center"
          alignSelf="flex-start"
          left={20}
          top={20}
        >
          <Pressable onPress={() => navigation.navigate("DetalhePerfilAluno")}>
            <Avatar
              loading={loadingAlunoData}
              src={{ uri: alunoRootData?.foto }}
              size={50}
            />
          </Pressable>
          <StyledText
            color="white"
            loading={loadingAlunoData}
            style={{ top: 3 }}
          >
            {getGreeting()}, {alunoRootData?.nome}
          </StyledText>
        </Box>
      </Box>
      <Card variant="cardHome">
        <StyledText variant="title" style={{ top: 20, marginBottom: 30 }}>
          Suas Rotinas
        </StyledText>
        <FlashList
          data={rotinas}
          renderItem={renderRotina}
          estimatedItemSize={200}
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
                Peça para seu personal cadastrar uma rotina !
              </StyledText>
            </Box>
          }
        />
      </Card>
    </Box>
  );
}
