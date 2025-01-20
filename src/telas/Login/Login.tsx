import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatePresence, MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "src/contextos/AuthContext";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import {
  Box,
  StyledInput,
  StyledText,
  StyledImage,
  StyledButton,
  StyledCheckbox,
  ModalResetSenha,
} from "src/componentes";

import { showAlert } from "src/componentes/AlertNotification";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/rotas/AuthStack";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const schema = z.object({
  email: z.string().email("Email Inválido!"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres!"),
  loginType: z
    .union([z.literal("personal"), z.literal("aluno"), z.null()])
    .optional(),
});

export default function Login() {
  const { signIn, loading } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [loginType, setLoginType] = useState<"personal" | "aluno" | null>(
    "personal"
  );
  const [modalVisible, setModalVisible] = useState(false);

  const handleCheckboxChange = (type: "personal" | "aluno") => {
    setLoginType(type);
  };

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      senha: "",
      loginType: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await signIn(data.email, data.senha);

      const user = auth().currentUser;

      if (!user) {
        throw new Error("Não foi possível obter os dados do usuário.");
      }

      const userId = user.uid;

      const userDoc = await firestore().collection("user").doc(userId).get();

      if (!userDoc.exists) {
        throw new Error("O usuário não possui informações no Firestore.");
      }

      const userType = userDoc.data()?.type;

      if (userType !== loginType) {
        showAlert(
          "error",
          "Tipo de Usuário Inválido",
          `Você tentou logar como ${loginType}, mas sua conta é do tipo ${userType}.`
        );
        await auth().signOut();
        return;
      }

      showAlert("success", "Logado com sucesso!", "Desfrute do nosso App :)");
    } catch (e: any) {
      if (e.code === "auth/user-not-found") {
        showAlert(
          "error",
          "Erro de Autenticação",
          "Usuário não encontrado. Verifique seu e-mail."
        );
      } else if (e.code === "auth/wrong-password") {
        showAlert(
          "error",
          "Erro de Autenticação",
          "Senha incorreta. Tente Novamente."
        );
      } else {
        showAlert(
          "error",
          "Erro de Autenticação",
          e.message || "Revise seu e-mail e sua senha e tente novamente."
        );
      }
    }
  };

  const handleForgotPassword = () => {
    setModalVisible(true);
  };

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        colors={["rgba(21,43,64,1)", "rgba(16,61,98,1)", "rgba(5,99,172,1)"]}
      />
      <AnimatePresence>
        <MotiView
          style={[
            styles.containerLogin,
            {
              backgroundColor:
                loginType === "personal"
                  ? "rgba(21,43,64,1)"
                  : loginType === "aluno"
                  ? "rgba(5,99,172,1)"
                  : "rgba(255,255,255,0.1)",
            },
          ]}
          from={{ height: 400 }}
          animate={{
            height:
              loginType === "personal" || loginType === "aluno" ? 720 : 400,
          }}
          transition={{ type: "timing", duration: 500 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <StyledImage
              source={require("../../../assets/iconsemfundo.png")}
              style={{ height: 170, width: 300 }}
            />

            <Box flexDirection="row" marginVertical="l" gap="m">
              <StyledCheckbox
                label="Personal"
                name="loginType"
                control={control}
                value={loginType === "personal"}
                onChange={() => handleCheckboxChange("personal")}
                colorBox={loginType === "personal" ? "#263850" : "#fff"}
                color="#fff"
              />
              <StyledCheckbox
                label="Aluno"
                value={loginType === "aluno"}
                name="loginType"
                control={control}
                onChange={() => handleCheckboxChange("aluno")}
                colorBox={loginType === "aluno" ? "#263850" : "#fff"}
                color="#fff"
              />
            </Box>

            {(loginType === "personal" || loginType === "aluno") && (
              <>
                <StyledInput
                  label="Email"
                  name="email"
                  control={control}
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  rules={{ required: "Email é obrigatório" }}
                />
                <StyledInput
                  label="Senha"
                  name="senha"
                  control={control}
                  placeholder="Digite sua senha"
                  secureTextEntry={true}
                  rules={{ required: "Senha é obrigatória" }}
                />
                <StyledText onPress={handleForgotPassword} color="white">
                  Esqueci a senha
                </StyledText>
                <StyledButton
                  label="Entrar"
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                  loading={loading}
                />
                <StyledText
                  onPress={() => navigation.navigate("Cadastro")}
                  color="white"
                  variant="bold"
                >
                  Crie uma conta!
                </StyledText>
              </>
            )}
          </ScrollView>
        </MotiView>
      </AnimatePresence>

      <ModalResetSenha
        visible={modalVisible}
        label="Recuperar Senha"
        onClose={() => setModalVisible(false)}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  containerLogin: {
    height: 300,
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginTop: 40,
    borderRadius: 5,
    alignItems: "center",
  },
});
