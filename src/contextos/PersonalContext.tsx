import React, { createContext, useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "./AuthContext";

interface PersonalData {
  foto: any;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  instagram: string;
  CREF: string;
}

interface PersonalContextData {
  personalData: PersonalData | null;
  loading: boolean;
}

const PersonalContext = createContext<PersonalContextData | undefined>(
  undefined
);

export const PersonalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection("PersonalTrainer")
        .doc(user.uid)
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              const data = doc.data();
              if (data) {
                setPersonalData({
                  foto: data.foto,
                  nome: data.nome || "Usuário",
                  email: data?.email || "",
                  senha: data?.senha || "",
                  telefone: data?.telefone || "",
                  instagram: data?.instagram || "",
                  CREF: data?.CREF || "",
                });
              }
            } else {
              setPersonalData(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Erro ao carregar dados em tempo real:", error);
            setLoading(false);
          }
        );

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <PersonalContext.Provider value={{ personalData, loading }}>
      {children}
    </PersonalContext.Provider>
  );
};

export const usePersonal = () => {
  const context = useContext(PersonalContext);
  if (!context) {
    throw new Error("usePersonal deve ser usado dentro de PersonalProvider");
  }
  return context;
};
