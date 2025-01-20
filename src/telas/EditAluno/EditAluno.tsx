import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Header,
  Card,
  StyledInput,
  StyledButton,
} from "src/componentes";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "src/contextos/AuthContext";
import { showAlert } from "src/componentes/AlertNotification";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useAluno } from "src/contextos/AlunoContext";

const schema = z.object({
  foto: z.string().optional(),
  nome: z.string().min(3, "O nome é obrigatório!"),
  email: z.string().email("Email inválido!"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres!"),
  telefone: z
    .string()
    .regex(
      /^\(?[1-9]{2}\)?\s?(?:9[1-9]\d{3}|[2-8]\d{3})-?\d{4}$/,
      "Número de telefone inválido!"
    ),
});

export default function EditAluno() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { alunoRootData, loadingAlunoData } = useAluno();
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (alunoRootData) {
      reset({
        foto: alunoRootData?.foto || "",
        nome: alunoRootData?.nome || "",
        email: alunoRootData?.email || "",
        senha: alunoRootData?.senha || "",
        telefone: alunoRootData?.telefone || "",
      });
    }
  }, [alunoRootData, reset]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error("Erro ao selecionar imagem:", e);
      showAlert("error", "Erro", "Falha ao abrir a galeria.");
    }
  };

  const uploadImageToStorage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = storage().ref(`profilePictures/${user?.uid}`);
      await storageRef.put(blob);
      return await storageRef.getDownloadURL();
    } catch (e) {
      console.error("Erro ao fazer upload da imagem:", e);
      throw new Error("Erro ao salvar a imagem no servidor.");
    }
  };

  console.log(alunoRootData?.personalId)

  const updatePersonalData = async (uid: string, data: any) => {
    return (
      firestore().collection("Alunos").doc(uid).update(data),
      firestore()
        .collection("PersonalTrainer")
        .doc(alunoRootData?.personalId)
        .collection("Aluno")
        .doc(uid)
        .update(data)
    );
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoadingButton(true);

      const userAuth = auth().currentUser;

      if (!userAuth) {
        showAlert("error", "Erro", "Usuário não autenticado.");
        return;
      }

      let imageUrl = alunoRootData?.foto || null;

      if (imageUri) {
        imageUrl = await uploadImageToStorage(imageUri);
      }

      await updatePersonalData(userAuth.uid, {
        foto: imageUrl,
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        telefone: data.telefone,
      });

      if (alunoRootData) {
        if (
          data.email !== userAuth.email ||
          data.senha !== alunoRootData.senha
        ) {
          try {
            if (data.email !== userAuth.email) {
              await userAuth.updateEmail(data.email);
            }

            if (data.senha !== alunoRootData.senha) {
              await userAuth.updatePassword(data.senha);
            }
          } catch (error: any) {
            if (error.code === "auth/requires-recent-login") {
              await reauthenticateUser(alunoRootData.senha);
              if (data.email !== userAuth.email) {
                await userAuth.updateEmail(data.email);
              }
              if (data.senha !== alunoRootData.senha) {
                await userAuth.updatePassword(data.senha);
              }
            } else {
              throw error;
            }
          }
        }
      }
      showAlert("success", "Sucesso", "Dados atualizados com sucesso!");
      navigation.goBack();
    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error.message || "Erro ao atualizar os dados."
      );
    } finally {
      setLoadingButton(false);
    }
  };

  const reauthenticateUser = async (password: string) => {
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(
      user?.email || "",
      password
    );
    await user?.reauthenticateWithCredential(credential);
  };

  return (
    <Box flex={1}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <Box flex={1} top={-50}>
          <Card variant="cardEditAluno">
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                onPress={pickImage}
                style={{ alignSelf: "center", marginBottom: 20 }}
              >
                <Avatar
                  src={
                    imageUri
                      ? { uri: imageUri }
                      : { uri: alunoRootData?.foto || undefined }
                  }
                  size={140}
                  loading={loadingAlunoData}
                >
                  {!imageUri && !alunoRootData?.foto && (
                    <Box
                      justifyContent="center"
                      alignItems="center"
                      backgroundColor="transparentBlack"
                      flex={1}
                      width="100%"
                      borderRadius={100}
                    >
                      <MaterialIcons name="add" size={40} color="white" />
                    </Box>
                  )}
                </Avatar>
              </TouchableOpacity>

              <StyledInput
                control={control}
                name="nome"
                label="Nome"
                placeholder="Digite seu nome"
                rules={{ required: "Nome é obrigatório" }}
              />
              <StyledInput
                control={control}
                name="email"
                label="Email"
                placeholder="Digite seu email"
                rules={{ required: "Email é obrigatório" }}
              />
              <StyledInput
                control={control}
                name="senha"
                label="Senha"
                placeholder="Digite sua senha"
                secureTextEntry
                rules={{ required: "Senha é obrigatória" }}
              />
              <StyledInput
                control={control}
                name="telefone"
                label="Telefone"
                placeholder="(XX) XXXXX-XXXX"
                rules={{ required: "Telefone é obrigatório" }}
              />
              <StyledButton
                onPress={handleSubmit(onSubmit)}
                label="Salvar Mudanças"
                loading={loadingButton}
                disabled={loadingButton}
              />
            </ScrollView>
          </Card>
        </Box>
      </ScrollView>
    </Box>
  );
}
