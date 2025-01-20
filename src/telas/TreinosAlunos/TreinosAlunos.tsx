import React, { useRef, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "src/rotas/AlunoStack";
import { SectionList, ScrollView } from "react-native";
import { Box, Card, Header, StyledText, Modal } from "src/componentes";
import { MotiView } from "moti";
import { useAluno } from "src/contextos/AlunoContext";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

interface Exercicio {
  exercicio: {
    [nomeExercicio: string]: {
      divisao: string;
      reps: string;
      series: string;
      videoLink: string; // Adicionando o campo videoLink aqui
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

export default function TreinosAlunos() {
  const route = useRoute<RouteProp<RootStackParamList, "TreinosAluno">>();
  const { treinos, loadingTreinos } = useAluno();
  const animation = useRef<LottieView>(null);
  const [selectedExerciseData, setSelectedExerciseData] = useState<{
    nome: string;
    youtubeLink: string;
  } | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const { rotina } = route.params;

  const groupByMusculo = (treinos: Treino[]): GroupedTreinos => {
    return treinos.reduce((acc: GroupedTreinos, treino: Treino) => {
      if (!acc[treino.musculo]) {
        acc[treino.musculo] = [];
      }
      acc[treino.musculo].push(treino);
      return acc;
    }, {});
  };

  const handleExerciseSelect = (exercise: {
    nome: string;
    videoLink: string;
  }) => {
    console.log("Exercício selecionado:", exercise);
    setSelectedExerciseData({
      nome: exercise.nome,
      youtubeLink: exercise.videoLink,
    });
    setVisible(true);
  };

  const groupedTreinos = groupByMusculo(treinos);

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
          <StyledText variant="title" style={{ top: 10, marginBottom: 20 }}>
            Treinos da {rotina.nome}
          </StyledText>
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
                  Seu personal ainda não cadastrou nenhum treino nesta rotina!
                </StyledText>
              </Box>
            }
            renderItem={({ item }) => {
              return (
                <Box>
                  {item.exercicio.map((detalhe, index) => {
                    const [nomeExercicio, detalhesExercicio] = Object.entries(
                      detalhe.exercicio
                    )[0] as [
                      string,
                      {
                        divisao: string;
                        reps: string;
                        series: string;
                        videoLink: string;
                      }
                    ];

                    return (
                      <Box
                        key={index}
                        borderBottomColor="grey"
                        borderBottomWidth={1}
                        marginVertical="s"
                        paddingVertical="s"
                      >
                        <Box
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box flexDirection="column">
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

                          <Ionicons
                            onPress={() =>
                              handleExerciseSelect({
                                nome: nomeExercicio,
                                videoLink: detalhesExercicio.videoLink,
                              })
                            }
                            name="logo-youtube"
                            size={30}
                            color="black"
                            style={{ right: 30 }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              );
            }}
          />
        </Card>
      </ScrollView>

      <Modal visible={visible} onClose={() => setVisible(false)}>
        <Card variant="cardModal">
          {selectedExerciseData && (
            <>
              <StyledText variant="title" style={{ marginBottom: 10 }}>
                {selectedExerciseData.nome}
              </StyledText>
              <WebView
                source={{ uri: selectedExerciseData.youtubeLink }}
                style={{
                  height: 500,
                  width: "100%",
                  alignSelf: "center",
                  zIndex: 100,
                }}
              />
            </>
          )}
        </Card>
      </Modal>
    </Box>
  );
}
