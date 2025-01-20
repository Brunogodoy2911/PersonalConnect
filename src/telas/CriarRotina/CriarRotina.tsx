import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  Header,
  StyledButton,
  StyledInput,
  StyledText,
} from "src/componentes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DropDown from "src/componentes/DropDown";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { RotinaData, useAluno } from "src/contextos/AlunoContext";
import { useNavigation } from "@react-navigation/native";

const schema = z
  .object({
    nome: z
      .string()
      .min(6, "Nome de rotina muito pequeno")
      .max(50, "Nome de rotina muito grande"),
    divisaoTreinos: z.string().nonempty("Divisão de treinos é obrigatória!"),
    objetivoTreino: z.string().nonempty("Objetivo de treino é obrigatório!"),
    dificuldadeTreino: z
      .string()
      .nonempty("Dificuldade do treino é obrigatória!"),
    dataInicio: z
      .string()
      .refine((val) => val !== "", "Data de início é obrigatória!"),
    dataTermino: z
      .string()
      .refine((val) => val !== "", "Data de término é obrigatória!"),
  })
  .refine((data) => new Date(data.dataInicio) <= new Date(data.dataTermino), {
    message: "A data de início não pode ser maior que a data de término.",
    path: ["dataInicio"], // O erro será mostrado no campo dataInicio
  });

export default function CriarRotina() {
  const [selectedDivisao, setSelectedDivisao] = useState<string>("");
  const [selectedObjetivo, setSelectedObjetivo] = useState<string>("");
  const [selectedDificuldade, setSelectedDificuldade] = useState<string>("");
  const { createRotina, rotinas, loadingRotina } = useAluno();
  const navigation = useNavigation();

  type FormData = z.infer<typeof schema>;

  const handleDivisaoSelect = (value: string) => {
    setSelectedDivisao(value);
    setValue("divisaoTreinos", value);
  };

  const handleObjetivoSelect = (value: string) => {
    setSelectedObjetivo(value);
    setValue("objetivoTreino", value);
  };

  const handleDificuldadeSelect = (value: string) => {
    setSelectedDificuldade(value);
    setValue("dificuldadeTreino", value);
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      divisaoTreinos: "",
      objetivoTreino: "",
      dificuldadeTreino: "",
      dataInicio: new Date().toISOString().split("T")[0],
      dataTermino: "",
    },
  });

  useEffect(() => {
    setValue("divisaoTreinos", selectedDivisao);
    setValue("objetivoTreino", selectedObjetivo);
    setValue("dificuldadeTreino", selectedDificuldade);
  }, [selectedDivisao, selectedObjetivo, selectedDificuldade, setValue]);

  const onSubmit = async (data: FormData) => {
    const rotinaData: Omit<RotinaData, "id"> = {
      nome: data.nome,
      divisaoTreinos: data.divisaoTreinos,
      objetivoTreino: data.objetivoTreino,
      dificuldadeTreino: data.dificuldadeTreino,
      dataInicio: data.dataInicio,
      dataTermino: data.dataTermino,
    };

    await createRotina(rotinaData);

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header>
            <StyledText
              variant="title"
              color="white"
              style={{ right: 0, position: "absolute", top: 20 }}
            >
              Cadastrar Rotina
            </StyledText>
          </Header>

          <Card padding="m" variant="cardHome">
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: "center",
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              <StyledInput
                label="Nome da Rotina"
                name="nome"
                control={control}
                placeholder="Digite o nome da rotina"
                rules={{ required: "Nome é obrigatório!" }}
              />
              <DropDown
                data={[
                  {
                    label: "Dias da Semana - Ex: Segunda, Terça ...",
                    value: "Dias da Semana - Ex: Segunda, Terça ...",
                  },
                ]}
                label="Divisão de Treinos"
                onSelect={handleDivisaoSelect}
                placeholder="Escolha a divisão de treinos"
                value={selectedDivisao}
                error={errors.divisaoTreinos?.message}
              />
              <DropDown
                data={[
                  { label: "Hipertrofia", value: "Hipertrofia" },
                  { label: "Emagrecimento", value: "Emagrecimento" },
                  { label: "Resistência", value: "Resistência" },
                  { label: "Definição Muscular", value: "Definição Muscular" },
                  { label: "Qualidade de Vida", value: "Qualidade de Vida" },
                ]}
                label="Objetivo dos Treinos"
                onSelect={handleObjetivoSelect}
                placeholder="Escolha o objetivo dos treinos"
                value={selectedObjetivo}
                error={errors.objetivoTreino?.message}
              />
              <DropDown
                data={[
                  { label: "Adaptação", value: "Adaptação" },
                  { label: "Iniciante", value: "Iniciante" },
                  { label: "Intermediário", value: "Intermediário" },
                  { label: "Avançado", value: "Avançado" },
                ]}
                label="Dificuldade dos Treinos"
                onSelect={handleDificuldadeSelect}
                placeholder="Escolha a dificuldade dos treinos"
                value={selectedDificuldade}
                error={errors.dificuldadeTreino?.message}
              />

              <StyledInput
                label="Início Em"
                name="dataInicio"
                control={control}
                placeholder="Data de inicio da rotina"
                rules={{ required: "Data de inicio é obrigatória!" }}
              />
              <StyledInput
                label="Término Em"
                name="dataTermino"
                control={control}
                placeholder="Data de término da rotina"
                rules={{ required: "Data de término é obrigatório!" }}
              />
              <StyledButton
                label="Cadastrar Rotina"
                onPress={handleSubmit(onSubmit)}
                loading={loadingRotina}
                disabled={loadingRotina}
              />
            </ScrollView>
          </Card>
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  );
}
