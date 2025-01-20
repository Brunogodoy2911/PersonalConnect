import { Modal, Pressable, StyleSheet } from "react-native";
import Box from "./Box";
import StyledText from "./StyledText";
import LottieView from "lottie-react-native";
import React, { useRef, useState } from "react";
import StyledInput from "./StyledInput";
import StyledButton from "./StyledButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import auth from "@react-native-firebase/auth";
import { showAlert } from "./AlertNotification";

interface IStyledModalProps {
  visible?: boolean;
  label?: string;
  onClose?: () => void;
}

const schema = z.object({
  email: z.string().email("Email Inválido!"),
});

const ModalResetSenha: React.FC<IStyledModalProps> = ({
  visible,
  label,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const animation = useRef<LottieView>(null);

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await auth().sendPasswordResetEmail(data.email);
      showAlert(
        "success",
        "Email de recuperação enviado.",
        "Abra seu email para resetar sua senha."
      );
      if (onClose) {
        onClose();
      }
    } catch (e: any) {
      showAlert("error", "Erro ao enviar o email de recuperação.", e.message);
      if (onClose) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable>
          <Box
            backgroundColor="white"
            justifyContent="center"
            alignItems="center"
            gap="m"
            padding="m"
            zIndex={100}
            width={380}
            marginTop="xl"
            borderRadius={5}
          >
            <Box flexDirection="row">
              <StyledText variant="title" textAlign="center">
                {label}
              </StyledText>

              <StyledText onPress={onClose} style={styles.closeButton}>
                X
              </StyledText>
            </Box>

            <LottieView
              autoPlay
              loop
              ref={animation}
              style={{
                width: 250,
                height: 100,
              }}
              source={require("../../assets/AnimacaoSenha.json")}
            />

            <StyledInput
              label="Email"
              name="email"
              control={control}
              placeholder="Digite seu email"
              keyboardType="email-address"
              rules={{ required: "O email é obrigatório!" }}
            />
            <StyledButton
              label="Enviar"
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              loading={loading}
            />
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    left:70,
    height:40,
    fontSize: 16,
    fontWeight: "bold",
    color: "#808080",
  },
});

export default ModalResetSenha;
