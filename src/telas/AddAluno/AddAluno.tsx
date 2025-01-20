import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { z } from "zod";
import {
  Box,
  Card,
  Header,
  Avatar,
  StyledInput,
  StyledCheckbox,
  StyledButton,
  StyledText,
} from "src/componentes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { showAlert } from "src/componentes/AlertNotification";
import storage from "@react-native-firebase/storage";
import { useAuth } from "src/contextos/AuthContext";
import { useAluno } from "src/contextos/AlunoContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import sendEmail from "src/services/sendEmail";

const schema = z.object({
  nome: z.string().min(3, "O nome é obrigatório!"),
  email: z.string().email("Email inválido!"),
  telefone: z.string(),

  sexo: z.enum(["Masculino", "Feminio"], { message: "Sexo é obrigatório!" }),
  idade: z
    .string()
    .min(1, "A idade é obrigatória!")
    .refine(
      (idade) => {
        const parsedIdade = parseInt(idade, 10);
        return parsedIdade >= 12 && parsedIdade <= 99;
      },
      { message: "A idade deve ser entre 12 e 99 anos!" }
    ),
  grupo: z.enum(["Presencial", "Online", "Híbrido"], {
    message: "Selecione o grupo do aluno!",
  }),
});

const placeholderImg =
  "https://firebasestorage.googleapis.com/v0/b/personalconnectfinal.appspot.com/o/profilePictures%2FplaceholderPerfil.png?alt=media&token=6a834ad5-6dbb-4fb4-b7b4-5e6d7073d989";

export default function AddAluno() {
  const { user } = useAuth();
  const { loadingCreate, createAluno } = useAluno();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation();

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      sexo: undefined,
      idade: "",
      grupo: undefined,
    },
  });

  const selectedSexo = watch("sexo");
  const selectedGrupo = watch("grupo");

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-6);
  };

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
    } catch (e: any) {
      showAlert("error", "Erro", e);
    }
  };

  const uploadImageToStorage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = storage().ref(`profilePictures/${user?.uid}`);
      await storageRef.put(blob);
      return await storageRef.getDownloadURL();
    } catch (e: any) {
      throw new Error("Erro ao salvar a imagem no servidor.");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const senha = generateRandomPassword(); // Gera a senha aleatória
  
      console.log('Senha gerada:', senha); // Verifique se a senha está correta
  
      // Envia a imagem ou usa a imagem padrão
      let photoUrl: string | undefined = imageUri
        ? await uploadImageToStorage(imageUri)
        : placeholderImg;
  
      const alunoData = {
        foto: photoUrl,
        senhag: senha, // A senha gerada
        ...data,
      };
  
      createAluno(alunoData);
  
      console.log('Enviando e-mail para:', data.email);
      console.log('Com a senha:', senha);
  
      // Envia o e-mail com a senha gerada
      await sendEmail(data.email, senha);
  
      setImageUri(null);
      navigation.goBack();
      showAlert(
        "success",
        "Aluno cadastrado com sucesso",
        "A senha do aluno criado foi mandada pelo email cadastrado!"
      );
    } catch (e: any) {
      console.error('Erro ao cadastrar aluno:', e); // Verifique o erro no console
      showAlert("error", "Erro", e.message || 'Erro desconhecido.');
    }
  };
  

  return (
    <Box flex={1}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <Box flex={1} top={-50}>
          <Card variant="cardAddAluno">
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                onPress={pickImage}
                style={{ alignSelf: "center" }}
              >
                <Avatar
                  src={imageUri ? { uri: imageUri } : { uri: placeholderImg }}
                  size={140}
                  loading={false}
                >
                  {!imageUri && (
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
                label="Nome"
                control={control}
                name="nome"
                placeholder="Digite o nome do aluno"
                rules={{ require: "Nome é obrigatório" }}
              />

              <StyledInput
                label="Email"
                control={control}
                name="email"
                placeholder="Digite o email do aluno"
                rules={{ require: "Email é obrigatório" }}
              />

              <StyledInput
                label="Telefone"
                control={control}
                name="telefone"
                placeholder="Digite o telefone do aluno"
                rules={{ require: "Telefone é obrigatório" }}
              />

              <StyledInput
                label="Idade"
                control={control}
                name="idade"
                placeholder="Digite a idade do aluno"
              />
              <Box flexDirection="row" gap="m" marginTop="s">
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
                  value={selectedSexo === "Feminio"}
                  onChange={() => setValue("sexo", "Feminio")}
                  colorBox={selectedSexo === "Feminio" ? "#263850" : "#000"}
                  color="#000"
                />
              </Box>
              {errors.sexo && (
                <StyledText variant="errorText">
                  {errors.sexo.message}
                </StyledText>
              )}
              <Box marginTop="m">
                <StyledCheckbox
                  label="Presencial"
                  name="grupo"
                  control={control}
                  value={selectedGrupo === "Presencial"}
                  onChange={() => setValue("grupo", "Presencial")}
                  colorBox={selectedGrupo === "Presencial" ? "#263850" : "#000"}
                  color="#000"
                />
                <StyledCheckbox
                  label="Online"
                  name="grupo"
                  control={control}
                  value={selectedGrupo === "Online"}
                  onChange={() => setValue("grupo", "Online")}
                  colorBox={selectedGrupo === "Online" ? "#263850" : "#000"}
                  color="#000"
                />
                <StyledCheckbox
                  label="Híbrido"
                  name="grupo"
                  control={control}
                  value={selectedGrupo === "Híbrido"}
                  onChange={() => setValue("grupo", "Híbrido")}
                  colorBox={selectedGrupo === "Híbrido" ? "#263850" : "#000"}
                  color="#000"
                />
                {errors.grupo && (
                  <StyledText variant="errorText">
                    {errors.grupo.message}
                  </StyledText>
                )}
                <StyledButton
                  onPress={handleSubmit(onSubmit)}
                  label="Cadastrar Aluno"
                  loading={loadingCreate}
                  disabled={loadingCreate}
                />
              </Box>
            </ScrollView>
          </Card>
        </Box>
      </ScrollView>
    </Box>
  );
}