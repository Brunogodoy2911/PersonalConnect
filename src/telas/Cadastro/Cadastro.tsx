import { ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Box,
  StyledImage,
  StyledText,
  StyledCheckbox,
  StyledInput,
  StyledButton,
} from "src/componentes";
import { LinearGradient } from "expo-linear-gradient";
import { z } from "zod";

import { AnimatePresence, MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "src/contextos/AuthContext";
import { showAlert } from "src/componentes/AlertNotification";

const schema = z.object({
  nome: z.string().min(3, "Nome curto demais!"),
  email: z.string().email("Email Inválido!"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  telefone: z
    .string()
    .regex(
      /^\(?[1-9]{2}\)?\s?(?:9[1-9]\d{3}|[2-8]\d{3})-?\d{4}$/,
      "Número de telefone inválido!"
    ),
  sexo: z.enum(["Masculino", "Feminino"], {
    message: "O sexo é obrigatório!",
  }),
  loginType: z.enum(["personal", "aluno"], {
    message: "Selecione o tipo de cadastro!",
  }),
});

export default function Cadastro() {
  const navigation = useNavigation();
  const { createUser, loading } = useAuth();
  const [loginType, setLoginType] = useState<"personal" | "aluno" | null>(
    "personal"
  );

  const handleCheckboxChange = (type: "personal" | "aluno") => {
    setLoginType(type);
    setValue("loginType", type);
  };

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      telefone: "",
      sexo: undefined,
      loginType: "personal",
    },
  });

  const selectedSexo = watch("sexo");

  const onSubmit = async (data: FormData) => {
    try {
      createUser(data.email, data.senha, data.nome, data.telefone, data.sexo);
    } catch (e: any) {
      showAlert("error", "Erro no Cadastro", e);
    }
  };

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        colors={["rgba(21,43,64,1)", "rgba(16,61,98,1)", "rgba(5,99,172,1)"]}
      />
      <AnimatePresence>
        <MotiView
          style={[styles.containerCadastro]}
          from={{ height: 300 }}
          animate={{
            height:
              loginType === "personal" || loginType === "aluno" ? 720 : 300,
          }}
          transition={{ type: "timing", duration: 500 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <StyledText
              color="backgroundButton"
              onPress={() => navigation.goBack()}
              style={styles.textBack}
            >
              Voltar
            </StyledText>
            <StyledImage
              source={require("../../../assets/iconCadastro.png")}
              style={{ height: 170, width: 300 }}
            />
            <Box
              flexDirection="row"
              marginVertical="l"
              gap="m"
              justifyContent="center"
            >
              <StyledCheckbox
                label="Personal"
                name="loginType"
                control={control}
                value={loginType === "personal"}
                onChange={() => handleCheckboxChange("personal")}
                colorBox={loginType === "personal" ? "#263850" : "#000"}
                color="#000"
              />
              <StyledCheckbox
                label="Aluno"
                name="loginType"
                control={control}
                value={loginType === "aluno"}
                onChange={() => handleCheckboxChange("aluno")}
                colorBox={loginType === "aluno" ? "#263850" : "#000"}
                color="#000"
              />
            </Box>

            {loginType === "personal" ? (
              <>
                <StyledInput
                  label="Nome"
                  name="nome"
                  control={control}
                  placeholder="Digite seu nome"
                  rules={{ required: "Nome é obrigatório!" }}
                />
                <StyledInput
                  label="Email"
                  name="email"
                  control={control}
                  placeholder="Digite seu email"
                  rules={{ required: "Email é obrigatório!" }}
                />
                <StyledInput
                  label="Senha"
                  name="senha"
                  control={control}
                  placeholder="Digite sua senha"
                  rules={{ required: "Senha é obrigatório!" }}
                  secureTextEntry={true}
                />
                <StyledInput
                  label="Telefone"
                  name="telefone"
                  control={control}
                  placeholder="11123456789"
                  rules={{ required: "Telefone é obrigatório!" }}
                />
                <Box
                  flexDirection="column"
                  marginVertical="s"
                  gap="s"
                  alignSelf="flex-start"
                >
                  <StyledCheckbox
                    label="Masculino"
                    name="sexo"
                    control={control}
                    value={selectedSexo === "Masculino"}
                    onChange={() => setValue("sexo", "Masculino")}
                    colorBox={selectedSexo === "Masculino" ? "#263850" : "#000"}
                    color="#000"
                  />
                  <StyledCheckbox
                    label="Feminino"
                    name="sexo"
                    control={control}
                    value={selectedSexo === "Feminino"}
                    onChange={() => setValue("sexo", "Feminino")}
                    colorBox={selectedSexo === "Feminino" ? "#263850" : "#000"}
                    color="#000"
                  />

                  {errors.sexo && (
                    <StyledText variant="errorText">
                      {errors.sexo.message}
                    </StyledText>
                  )}
                </Box>
                <StyledButton
                  label="Cadastrar"
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                  loading={loading}
                />
              </>
            ) : (
              <>
                <Box
                  backgroundColor="white"
                  width={300}
                  padding="m"
                  elevation={2}
                  borderRadius={5}
                >
                  <StyledText>
                    Para se cadastrar, entre em contato com o seu Personal
                    Trainer!
                  </StyledText>
                </Box>
              </>
            )}
          </ScrollView>
        </MotiView>
      </AnimatePresence>
    </Box>
  );
}

const styles = StyleSheet.create({
  containerCadastro: {
    height: 300,
    width: "90%",
    backgroundColor: "#f4f5f7",
    marginTop: 40,
    borderRadius: 5,
    alignItems: "center",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  textBack: {
    position: "absolute",
    top: 20,
    left: 0,
    zIndex:1000,
  },

  checkbox: {
    borderRadius: 10,
    backgroundColor: "white",
  },
});
