import React, { useState, useRef } from "react";
import { Pressable, TouchableOpacity, Linking, Alert } from "react-native";
import {
  Box,
  Card,
  StyledText,
  Avatar,
  StyledButton,
  StyledImage,
  Modal,
} from "src/componentes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "src/rotas/PersonalStack";
import { usePersonal } from "src/contextos/PersonalContext";
import { FlashList } from "@shopify/flash-list";
import { useAluno } from "src/contextos/AlunoContext";
import LottieView from "lottie-react-native";
import { MotiView } from "moti";
import { AlunoData } from "src/contextos/AlunoContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomePersonal() {
  const navigation = useNavigation<NavigationProp>();
  const { personalData, loading } = usePersonal();
  const { alunos, loadingAluno, setAlunoSelecionado, alunoSelecionado } =
    useAluno();

  const animation = useRef<LottieView>(null);

  const [visible, setVisible] = useState<boolean>(false);

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

  const openWhatsApp = (phoneNumber: string) => {
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          alert("WhatsApp não está instalado no dispositivo.");
        }
      })
      .catch((err) => console.error("Erro ao abrir o WhatsApp:", err));
  };

  const handleSelectAluno = (aluno: AlunoData) => {
    setAlunoSelecionado(aluno);
  };

  const renderAluno = ({
    item,
    index,
  }: {
    item: (typeof alunos)[0];
    index: number;
  }) => {
    return (
      <TouchableOpacity
        style={{ height: 50, marginVertical: 20 }}
        onPress={() => {
          handleSelectAluno(item);
          setVisible(true);
        }}
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
            flexDirection="row"
            alignItems="center"
            gap="m"
            borderBottomWidth={1}
            borderColor="grey"
            paddingVertical="s"
            width="100%"
          >
            <Avatar src={{ uri: item.foto }} size={50} loading={loadingAluno} />
            <StyledText loading={loadingAluno}>{item.nome}</StyledText>
            <FontAwesome
              name="whatsapp"
              size={30}
              color="black"
              onPress={() => openWhatsApp(item.telefone)}
              style={{ position: "absolute", zIndex: 1000, right: 0 }}
            />
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
          left={10}
          top={20}
        >
          <Pressable onPress={() => navigation.navigate("DetalhesPerfil")}>
            <Avatar
              loading={loading}
              src={{ uri: personalData?.foto }}
              size={50}
            />
          </Pressable>
          <StyledText loading={loading} color="white" style={{ top: 3 }}>
            {getGreeting()}, {personalData?.nome}
          </StyledText>
        </Box>
      </Box>
      <Card variant="cardHome">
        <StyledText
          variant="title"
          style={{ position: "absolute", left: 10, top: 20 }}
        >
          Seus Alunos
        </StyledText>
        <StyledButton
          style={{
            alignSelf: "flex-end",
            backgroundColor: "#263850",
            width: 100,
          }}
          label="+ Aluno"
          onPress={() => navigation.navigate("AddAluno")}
        />

        <FlashList
          data={alunos}
          renderItem={renderAluno}
          estimatedItemSize={50}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Box>
              <LottieView
                autoPlay
                loop
                speed={0.5}
                ref={animation}
                style={{
                  width: 250,
                  height: 250,
                }}
                source={require("../../../assets/EmptyAnimate.json")}
              />
              <StyledText variant="title" textAlign="center">
                Clique no botão acima para cadastrar seu primeiro aluno!
              </StyledText>
            </Box>
          }
        />
      </Card>

      <Modal visible={visible} onClose={() => setVisible(false)}>
        <Box justifyContent="center" alignItems="center" flex={1}>
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 300 }}
          >
            <Box
              backgroundColor="white"
              height={310}
              width={380}
              alignSelf="center"
              borderRadius={10}
            >
              <StyledText
                color="greyFocus"
                fontSize={20}
                style={{
                  position: "absolute",
                  right: 20,
                  top: 20,
                  zIndex: 1000,
                }}
                onPress={() => setVisible(false)}
              >
                X
              </StyledText>
              <Box
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
                alignSelf="center"
                marginTop="m"
              >
                <Pressable
                  onPress={() =>
                    Alert.alert("Funcionalidade em desenvolvimento!", "Estamos desenvolvendo ainda...")
                  }
                >
                  <LottieView
                    autoPlay
                    loop
                    ref={animation}
                    style={{
                      width: 200,
                      height: 200,
                    }}
                    source={require("../../../assets/RefeicaoAnimation.json")}
                  />
                  <StyledText textAlign="center" variant="title">
                    Refeições
                  </StyledText>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate("Rotinas", {
                      alunoNome: alunoSelecionado?.nome ?? "Usuário",
                    }),
                      setVisible(false);
                  }}
                >
                  <LottieView
                    autoPlay
                    loop
                    ref={animation}
                    style={{
                      width: 200,
                      height: 200,
                    }}
                    source={require("../../../assets/TreinoAnimation.json")}
                  />
                  <StyledText textAlign="center" variant="title">
                    Treinos
                  </StyledText>
                </Pressable>
              </Box>
            </Box>
          </MotiView>
        </Box>
      </Modal>
    </Box>
  );
}
