import React, { createContext, useEffect, useState, useContext } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { showAlert } from "../componentes/AlertNotification";
import firestore from "@react-native-firebase/firestore";

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (
    email: string,
    senha: string
  ) => Promise<FirebaseAuthTypes.UserCredential | undefined>;
  signOut: () => Promise<void>;
  createUser: (
    email: string,
    senha: string,
    nome: string,
    telefone: string,
    sexo: string
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  const placeholderImgUrl =
    "https://firebasestorage.googleapis.com/v0/b/personalconnectfinal.appspot.com/o/profilePictures%2FplaceholderPerfil.png?alt=media&token=6a834ad5-6dbb-4fb4-b7b4-5e6d7073d989";

  const createUser = async (
    email: string,
    senha: string,
    nome: string,
    telefone: string,
    sexo: string
  ) => {
    try {
      setLoading(true);

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        senha
      );
      const userId = userCredential.user?.uid;

      if (userId) {
        console.log("Usuário criado com sucesso, UID:", userId);

        setUser(userCredential.user);

        await firestore().collection("PersonalTrainer").doc(userId).set({
          email: email,
          senha: senha,
          nome: nome,
          telefone: telefone,
          sexo: sexo,
          foto: placeholderImgUrl,
        });

        await firestore().collection("user").doc(userId).set({
          type: "personal",
        });

        console.log("Documentos criados com sucesso");
      } else {
        console.log(
          "Não foi possível recuperar os dados após a criação do usuário"
        );
      }
      showAlert("success", "Conta Criada", "Conta criada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      showAlert("error", "Erro ao criar conta", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (authUser) => {
      setLoading(true);
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        senha
      );
      return userCredential;
    } catch (error: any) {
      showAlert("error", "Erro ao fazer login", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await auth().signOut();
      setUser(null);
      showAlert("success", "Logout", "Você saiu com sucesso!");
    } catch (error: any) {
      showAlert("error", "Erro ao sair", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        createUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
