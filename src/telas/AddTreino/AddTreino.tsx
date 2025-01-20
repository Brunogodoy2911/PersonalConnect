import { FlashList } from "@shopify/flash-list";
import Checkbox from "expo-checkbox";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import {
  Box,
  Card,
  Header,
  StyledText,
  StyledInput,
  StyledButton,
  Modal,
} from "src/componentes";
import { exerciciosPorMusculo } from "src/utils/exercicios";
import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAluno } from "src/contextos/AlunoContext";
import { WebView } from "react-native-webview";

const schema = z.object({
  series: z
    .string()
    .min(1, "Quantidade de séries muito pequena!")
    .max(3, "Quantidade de series muito grande!"),
  repeticoes: z
    .string()
    .min(1, "Quantidade de repetições é muito pequena!")
    .max(3, "Quantidade de repetições muito grande!"),
  divisao: z
    .string()
    .refine(
      (value) =>
        [
          "segunda",
          "terça",
          "terca",
          "quarta",
          "quinta",
          "sexta",
          "sabado",
          "domingo",
        ].includes(value.toLowerCase()),
      {
        message: "A divisão deve ser um dia da semana válido",
      }
    ),
});

type ExerciseData = {
  series: string;
  reps: string;
  divisao: string;
};

type SelectedExercises = {
  [exerciseName: string]: ExerciseData;
};

export default function AddTreino() {
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<
    keyof typeof exerciciosPorMusculo | null
  >(null);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercises>(
    {}
  );

  const [selectedExerciseData, setSelectedExerciseData] = useState<{
    nome: string;
    youtubeLink: string;
  } | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const { createTreino, loadingSaveExercise } = useAluno();

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      series: "",
      repeticoes: "",
      divisao: "",
    },
  });

  const handleMuscleSelect = (musculo: keyof typeof exerciciosPorMusculo) => {
    setSelectedMuscle(musculo);
  };

  const handleExerciseSelect = (exercise: {
    nome: string;
    videoLink: string;
  }) => {
    console.log(exercise.videoLink)
    setSelectedExerciseData({
      nome: exercise.nome,
      youtubeLink: exercise.videoLink, // Mudança aqui: alterei de 'videoLink' para 'youtubeLink'
    });
    setVisible(true);
  };

  const toggleExercise = (exercise: string) => {
    setSelectedExercises((prev) => {
      const isSelected = !!prev[exercise];
      const newState = { ...prev };

      if (isSelected) {
        delete newState[exercise];
        reset({
          series: "",
          repeticoes: "",
          divisao: "",
        });
      } else {
        newState[exercise] = { series: "", reps: "", divisao: "" };
      }

      return newState;
    });
  };
  const updateExerciseData = (
    exercise: string,
    field: "series" | "repeticoes" | "divisao",
    value: string
  ) => {
    setSelectedExercises((prev) => {
      const updatedExercise = { ...prev[exercise], [field]: value };
      console.log("Exercicio atualizado:", updatedExercise); // Verifique os dados aqui
      return { ...prev, [exercise]: updatedExercise };
    });
    // Usando o setValue para atualizar os valores no react-hook-form
    setValue(field, value);
  };

  const musculos = Object.keys(exerciciosPorMusculo) as Array<
    keyof typeof exerciciosPorMusculo
  >;

  const filteredMusculos = musculos.filter((musculo) =>
    musculo.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExercicios = selectedMuscle
    ? exerciciosPorMusculo[selectedMuscle].filter((exercicio) =>
        exercicio.nome.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const onSubmit = async (data: FormData) => {


    console.log("youtubeLink do exercício selecionado:", selectedExerciseData?.youtubeLink); // Verifique o valor aqui

    const treinoData = {
      musculo: selectedMuscle,
      exercicio: Object.fromEntries(
        Object.entries(selectedExercises).map(([key, value]) => [
          key,
          {
            ...value,
            series: value.series || data.series,
            reps: value.reps || data.repeticoes,
            divisao: value.divisao || data.divisao,
            youtubeLink: selectedExerciseData?.youtubeLink || "",
          },
        ])
      ),
      series: data.series,
      repeticoes: data.repeticoes,
      divisao: data.divisao,
    };

    await createTreino(treinoData);

    setSelectedExercises({});
    reset();
  };

  const renderButtonTreinos = ({
    item,
    index,
  }: {
    item: (typeof musculos)[0];
    index: number;
  }) => (
    <Box margin="s" flex={1}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleMuscleSelect(item)}
      >
        <StyledText variant="bold">{item}</StyledText>
      </TouchableOpacity>
    </Box>
  );

  const renderExercicioItem = ({
    item,
  }: {
    item: (typeof filteredExercicios)[0];
  }) => {
    const isSelected = !!selectedExercises[item.nome];

    return (
      <Box
        margin="s"
        flex={1}
        style={[
          styles.exerciseBox,
          isSelected && styles.selectedExerciseBox,
          { overflow: "hidden" },
        ]}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <StyledText>{item.nome}</StyledText>
          <Ionicons
            onPress={() => handleExerciseSelect(item)}
            name="logo-youtube"
            size={24}
            color="black"
          />
          <Checkbox
            value={isSelected}
            onValueChange={() => toggleExercise(item.nome)}
          />
        </Box>

        <MotiView
          from={{ height: 0, opacity: 0 }}
          animate={{
            height: isSelected ? 350 : 0,
            opacity: isSelected ? 1 : 0,
          }}
          transition={{
            type: "timing",
            duration: 300,
          }}
        >
          {isSelected && (
            <Box flex={1}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                <StyledInput
                  name="series"
                  control={control}
                  placeholder="Quantidade de séries..."
                  keyboardType="numeric"
                  rules={{ required: "Quantidade de séries obrigatória!" }}
                  value={selectedExercises[item.nome]?.series || ""}
                  onChangeText={(text) =>
                    updateExerciseData(item.nome, "series", text)
                  }
                  style={{
                    width: "100%",
                  }}
                />
                <StyledInput
                  name="repeticoes"
                  control={control}
                  placeholder="Quantidade de repetições..."
                  keyboardType="numeric"
                  rules={{ required: "Quantidade de repetições obrigatória!" }}
                  value={selectedExercises[item.nome]?.reps || ""}
                  onChangeText={(text) =>
                    updateExerciseData(item.nome, "repeticoes", text)
                  }
                  style={{
                    width: "100%",
                  }}
                />
                <StyledInput
                  name="divisao"
                  control={control}
                  placeholder="Dia da semana que será feito (Ex: Segunda)"
                  rules={{ required: "Dia da semana obrigatorio" }}
                  value={selectedExercises[item.nome]?.divisao || ""}
                  onChangeText={(text) =>
                    updateExerciseData(item.nome, "divisao", text)
                  }
                  style={{
                    width: "100%",
                  }}
                />
                <StyledButton
                  onPress={handleSubmit(onSubmit)}
                  loading={loadingSaveExercise}
                  disabled={loadingSaveExercise}
                >
                  <Ionicons name="save-outline" size={24} color="#fff" />
                </StyledButton>
              </ScrollView>
            </Box>
          )}
        </MotiView>
      </Box>
    );
  };

  return (
    <Box flex={1} alignItems="center">
      <Header />
      <Card variant="cardAddTreino">
        <TextInput
          placeholder="Digite o nome do músculo ou exercício desejado"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />

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

        {!selectedMuscle ? (
          <FlashList
            data={filteredMusculos}
            keyExtractor={(item) => item}
            renderItem={renderButtonTreinos}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={100}
          />
        ) : (
          <FlatList
            data={filteredExercicios}
            keyExtractor={(item) => item.nome}
            renderItem={renderExercicioItem}
            showsVerticalScrollIndicator={false}
          />
        )}
        {selectedMuscle && (
          <StyledButton
            label="Voltar"
            onPress={() => setSelectedMuscle(null)}
            style={{
              width: 100,
              height: 40,
            }}
          />
        )}
      </Card>
    </Box>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    elevation: 9,
    width: "100%",
    height: 50,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#f4f8fc",
    borderRadius: 5,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  exerciseBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  selectedExerciseBox: {
    backgroundColor: "#e6f7ff",
    borderColor: "#007bff",
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
