import React, { useRef } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "src/rotas/PersonalStack";
import { Box, Card, Header, StyledButton, StyledText } from "src/componentes";
import { MotiView } from "moti";
import { SectionList, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAluno } from "src/contextos/AlunoContext";
import LottieView from "lottie-react-native";

interface Exercicio {
  exercicio: {
    [nomeExercicio: string]: {
      divisao: string;
      reps: string;
      series: string;
    };
  };
}

interface Treino {
  musculo: string;
  exercicio: Exercicio[]; // Aqui, estamos considerando que cada treino tem um array de exercicios
}

interface GroupedTreinos {
  [musculo: string]: Treino[];
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function Treinos() {
  const route = useRoute<RouteProp<RootStackParamList, "Treinos">>();
  const navigation = useNavigation<NavigationProp>();
  const { treinos, loadingTreinos } = useAluno(); // Aqui, 'treinos' deve ser tipado como um array de 'Treino'
  const animation = useRef<LottieView>(null);

  const { rotina } = route.params;

  console.log("Treinos: ", treinos);

  // Tipando o parâmetro 'treinos' para ser um array de objetos 'Treino'
  const groupByMusculo = (treinos: Treino[]): GroupedTreinos => {
    return treinos.reduce((acc: GroupedTreinos, treino: Treino) => {
      if (!acc[treino.musculo]) {
        acc[treino.musculo] = [];
      }
      acc[treino.musculo].push(treino);
      return acc;
    }, {});
  };

  // Agrupando os treinos por músculo
  const groupedTreinos = groupByMusculo(treinos);

  // Transformando os dados agrupados em um array de seções
  const groupedData = Object.keys(groupedTreinos).map((musculo) => ({
    title: musculo,
    data: groupedTreinos[musculo],
  }));

  return (
    <Box flex={1}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
        }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Header height={400}>
          <Card variant="miniCardRotina">
            <MotiView
              from={{ opacity: 0, translateX: -100 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: "timing",
                duration: 500,
                delay: 100,
              }}
            >
              <Box paddingVertical="m" paddingHorizontal="s">
                <Box flexDirection="row" gap="s">
                  <StyledText variant="title">{rotina.nome} -</StyledText>
                  <StyledText variant="title">
                    {rotina.objetivoTreino}
                  </StyledText>
                </Box>

                <StyledText>{rotina.dificuldadeTreino}</StyledText>
                <StyledText>{rotina.divisaoTreinos}</StyledText>

                <StyledText>
                  {rotina.dataInicio} - {rotina.dataTermino}
                </StyledText>
              </Box>
            </MotiView>
          </Card>
        </Header>

        <Card variant="cardTreinos">
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <StyledText variant="title">Treinos da {rotina.nome}</StyledText>
            <StyledButton
              label="+ Treinos"
              onPress={() => navigation.navigate("AddTreino")}
              style={{
                height: 40,
                width: 100,
                backgroundColor: "#263850",
              }}
            />
          </Box>
          <SectionList
            sections={groupedData}
            keyExtractor={(item, index) => `${item.musculo}-${index}`}
            nestedScrollEnabled
            renderSectionHeader={({ section }) => (
              <Box>
                <StyledText variant="title" fontSize={20}>
                  {section.title}
                </StyledText>
              </Box>
            )}
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
                  Clique no botão acima para adicionar o primeiro treino do
                  aluno!
                </StyledText>
              </Box>
            }
            renderItem={({ item }) => {
              console.log("Item renderizado:", item);
              console.log("Exercícios do item:", item.exercicio);

              return (
                <Box>
                  {item.exercicio.map((detalhe, index) => {
                    const [nomeExercicio, detalhesExercicio] = Object.entries(
                      detalhe.exercicio
                    )[0] as [
                      string,
                      { divisao: string; reps: string; series: string }
                    ];

                    return (
                      <Box
                        key={index}
                        borderBottomColor="grey"
                        borderBottomWidth={1}
                        marginVertical="s"
                        paddingVertical="s"
                      >
                        <StyledText variant="bold" loading={loadingTreinos}>
                          Realizar: {detalhesExercicio.divisao}
                        </StyledText>
                        <StyledText loading={loadingTreinos}>
                          Exercício: {nomeExercicio}
                        </StyledText>
                        <StyledText loading={loadingTreinos}>
                          Repetições: {detalhesExercicio.reps}
                        </StyledText>
                        <StyledText loading={loadingTreinos}>
                          Séries: {detalhesExercicio.series}
                        </StyledText>
                      </Box>
                    );
                  })}
                </Box>
              );
            }}
          />
        </Card>
      </ScrollView>
    </Box>
  );
}
