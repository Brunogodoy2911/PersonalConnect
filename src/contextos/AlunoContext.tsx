import React, { createContext, useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "./AuthContext";
import auth from "@react-native-firebase/auth";
import { usePersonal } from "./PersonalContext";
import { showAlert } from "src/componentes/AlertNotification";

export interface AlunoData {
  id: string;
  foto?: string | undefined;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  idade?: string;
  sexo?: string;
  grupo?: string;
}

interface AlunoRootData {
  foto: any;
  nome: string;
  email: string;
  senha: string;
  sexo: string;
  telefone: string;
  idade: string;
  id?: string;
  personalId?: string;
  grupo: string;
}

export interface RotinaData {
  id: string;
  nome: string;
  divisaoTreinos: string;
  objetivoTreino: string;
  dificuldadeTreino: string;
  dataInicio: string;
  dataTermino: string;
}

interface TreinoData {
  id: string;
  musculo: string | null;
  exercicio: {
    [key: string]: {
      series: string;
      reps: string;
      divisao: string;
    };
  };
}

interface AlunoContextData {
  alunos: AlunoData[];
  rotinas: RotinaData[];
  treinos: TreinoData[];
  alunoRootData: AlunoRootData | null;
  loadingAluno: boolean;
  loadingAlunoData: boolean;
  loadingCreate: boolean;
  loadingRotina: boolean;
  loadingSaveExercise: boolean;
  loadingTreinos: boolean;
  createAluno: (data: Omit<AlunoData, "id">) => Promise<void>;
  createRotina: (data: Omit<RotinaData, "id">) => Promise<void>;
  createTreino: (data: Omit<TreinoData, "id">) => Promise<void>;
  alunoSelecionado: AlunoData | null;
  setAlunoSelecionado: React.Dispatch<React.SetStateAction<AlunoData | null>>;
  rotinaSelecionada: RotinaData | null;
  setRotinaSelecionada: React.Dispatch<React.SetStateAction<RotinaData | null>>;
}

const AlunoContext = createContext<AlunoContextData | undefined>(undefined);

export const AlunoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { personalData } = usePersonal();
  const [alunos, setAlunos] = useState<AlunoData[]>([]);
  const [rotinas, setRotinas] = useState<RotinaData[]>([]);
  const [treinos, setTreinos] = useState<TreinoData[]>([]);
  const [alunoRootData, setAlunoRootData] = useState<AlunoRootData | null>(
    null
  );
  const [loadingAlunoData, setLoadingAlunoData] = useState<boolean>(false);
  const [loadingAluno, setLoadingAluno] = useState<boolean>(false);
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingRotina, setLoadingRotina] = useState<boolean>(false);
  const [loadingSaveExercise, setLoadingSaveExercise] =
    useState<boolean>(false);
  const [loadingTreinos, setLoadingTreinos] = useState<boolean>(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoData | null>(
    null
  );
  const [rotinaSelecionada, setRotinaSelecionada] = useState<RotinaData | null>(
    null
  );

  const createAluno = async (data: Omit<AlunoData, "id">) => {
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    setLoadingCreate(true);

    try {
      const personalEmail = user.email;
      const personalSenha = personalData?.senha;

      if (!personalEmail || !personalSenha) {
        throw new Error(
          "Não foi possível recuperar as credenciais do personal trainer."
        );
      }

      const newAlunoAuth = await auth().createUserWithEmailAndPassword(
        data.email,
        data.senha
      );

      const alunoId = newAlunoAuth.user.uid;

      await auth().signInWithEmailAndPassword(personalEmail, personalSenha);

      await firestore().collection("user").doc(alunoId).set({
        type: "aluno",
      });

      const alunoRef = firestore()
        .collection("PersonalTrainer")
        .doc(user.uid)
        .collection("Aluno");

      await alunoRef.doc(alunoId).set({
        ...data,
        id: alunoId,
      });

      const alunoRootRef = firestore().collection("Alunos").doc(alunoId);

      await alunoRootRef.set({
        ...data,
        id: alunoId,
        personalId: user.uid,
      });
      
      showAlert(
        "success",
        "Aluno Criado",
        "A senha foi enviada para o email cadastrado!"
      );
    } catch (e: any) {
      let errorMessage = "Ocorreu um erro inesperado.";

      switch (e.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "Este e-mail já está em uso. Por favor, use outro e-mail.";
          break;
        case "auth/invalid-email":
          errorMessage = "O e-mail fornecido é inválido.";
          break;
        case "auth/weak-password":
          errorMessage = "A senha é muito fraca. Use pelo menos 6 caracteres.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Cadastro de novos usuários está desabilitado no momento.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Falha na conexão com a rede. Verifique sua internet.";
          break;
        case "auth/user-disabled":
          errorMessage =
            "Este usuário foi desativado. Entre em contato com o suporte.";
          break;
        default:
          errorMessage = e.message || "Ocorreu um erro inesperado.";
      }

      showAlert("error", "Erro ao criar o aluno", errorMessage);
    } finally {
      setLoadingCreate(false);
    }
  };

  useEffect(() => {
    setLoadingAluno(true);

    if (user) {
      const unsubscribeAluno = firestore()
        .collection("PersonalTrainer")
        .doc(user.uid)
        .collection("Aluno")
        .onSnapshot(
          (snapshot) => {
            const alunoList: AlunoData[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              foto: doc.data().foto || "",
              nome: doc.data().nome || "Usuário",
              email: doc.data().email || "",
              senha: doc.data().senha || "",
              telefone: doc.data().telefone || "",
              idade: doc.data().idade || "",
              sexo: doc.data().sexo || "",
              grupo: doc.data().grupo || "",
            }));
            setAlunos(alunoList);
            setLoadingAluno(false);
          },
          (error) => {
            console.error("Erro ao carregar alunos:", error);
            setLoadingAluno(false);
          }
        );

      return () => unsubscribeAluno();
    } else {
      setAlunos([]);
      setRotinas([]);
      setLoadingAluno(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !alunoSelecionado) return;

    const unsubscribeRotina = firestore()
      .collection("PersonalTrainer")
      .doc(user.uid)
      .collection("Aluno")
      .doc(alunoSelecionado.id)
      .collection("Rotinas")
      .onSnapshot(
        (rotinaSnapshot) => {
          const rotinaList: RotinaData[] = rotinaSnapshot.docs.map((doc) => ({
            id: doc.id,
            nome: doc.data().nome,
            divisaoTreinos: doc.data().divisaoTreinos,
            objetivoTreino: doc.data().objetivoTreino,
            dificuldadeTreino: doc.data().dificuldadeTreino,
            dataInicio: doc.data().dataInicio,
            dataTermino: doc.data().dataTermino,
          }));
          setRotinas(rotinaList);
          setLoadingRotina(false);
        },
        (error) => {
          console.error("Erro ao carregar rotinas:", error);
          setLoadingRotina(false);
        }
      );

    return () => {
      setRotinas([]);
      unsubscribeRotina();
    };
  }, [user, alunoSelecionado]);

  const createRotina = async (data: Omit<RotinaData, "id">) => {
    if (!user) {
      throw new Error("Usuário não autenticado!");
    }

    setLoadingRotina(true);

    try {
      const rotinaRef = firestore()
        .collection("PersonalTrainer")
        .doc(user.uid)
        .collection("Aluno")
        .doc(alunoSelecionado?.id)
        .collection("Rotinas");

      const rootRotinaRef = firestore()
        .collection("Alunos")
        .doc(alunoSelecionado?.id)
        .collection("Rotinas");

      const idRotina = rotinaRef.doc().id;

      await rotinaRef.doc(idRotina).set({
        ...data,
        dataCriacao: firestore.FieldValue.serverTimestamp(),
      });

      await rootRotinaRef.doc(idRotina).set({
        ...data,
        dataCriacao: firestore.FieldValue.serverTimestamp(),
      });

      showAlert("success", "Rotina Criada", "A rotina foi criada com sucesso!");
    } catch (e: any) {
      console.error(e);
      showAlert(
        "error",
        "Erro ao criar a rotina",
        "Verifique os dados digitados"
      );
    } finally {
      setLoadingRotina(false);
    }
  };

  const createTreino = async (data: Omit<TreinoData, "id">) => {
    if (!user) {
      throw new Error("Usuário não autenticado!");
    }

    try {
      setLoadingSaveExercise(true);

      const musculo = data.musculo;

      if (!musculo) {
        throw new Error("Músculo não especificado!");
      }

      const treinoRef = firestore()
        .collection("PersonalTrainer")
        .doc(user.uid)
        .collection("Aluno")
        .doc(alunoSelecionado?.id)
        .collection("Rotinas")
        .doc(rotinaSelecionada?.id)
        .collection("Treinos")
        .doc(musculo);

      const docSnapshot = await treinoRef.get();

      if (docSnapshot.exists) {
        await treinoRef.update({
          exercicios: firestore.FieldValue.arrayUnion({
            exercicio: data.exercicio,
          }),
          dataCriacao: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await treinoRef.set({
          musculo: data.musculo,
          exercicios: [
            {
              exercicio: data.exercicio,
            },
          ],
          dataCriacao: firestore.FieldValue.serverTimestamp(),
        });
      }

      console.log("Rotina Seleciona: ", rotinaSelecionada?.id);

      const rootTreinoRef = firestore()
        .collection("Alunos")
        .doc(alunoSelecionado?.id)
        .collection("Rotinas")
        .doc(rotinaSelecionada?.id)
        .collection("Treinos")
        .doc(musculo);

      const rootDocSnapshot = await rootTreinoRef.get();

      if (rootDocSnapshot.exists) {
        await rootTreinoRef.update({
          exercicios: firestore.FieldValue.arrayUnion({
            exercicio: data.exercicio,
          }),
          dataCriacao: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await rootTreinoRef.set({
          musculo: data.musculo,
          exercicios: [
            {
              exercicio: data.exercicio,
            },
          ],
          dataCriacao: firestore.FieldValue.serverTimestamp(),
        });
      }

      showAlert(
        "success",
        "Exercicio Salvo",
        "Volte a tela para anterior para ver os treinos!"
      );

      console.log("Dados de treino:", data);
    } catch (e: any) {
      console.error(e);
      showAlert(
        "error",
        "Erro ao salvar o exercício",
        "Houve um erro ao tentar salvar o exercício. Tente novamente."
      );
    } finally {
      setLoadingSaveExercise(false);
    }
  };

  useEffect(() => {
    if (!user || !alunoSelecionado || !rotinaSelecionada) return;

    setLoadingTreinos(true);

    const treinoPath = firestore()
      .collection("PersonalTrainer")
      .doc(user.uid)
      .collection("Aluno")
      .doc(alunoSelecionado.id)
      .collection("Rotinas")
      .doc(rotinaSelecionada.id)
      .collection("Treinos");

    const unsubscribeTreinos = treinoPath.onSnapshot(
      (snapshot) => {
        const treinoList: TreinoData[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            musculo: data.musculo || "",
            exercicio: data.exercicios || {},
          };
        });

        setTreinos(treinoList);
        console.log("TreinoList:", treinoList);
        setLoadingTreinos(false);
      },
      (error) => {
        console.error("Erro ao carregar treinos:", error);
        setLoadingTreinos(false);
      }
    );

    return () => unsubscribeTreinos();
  }, [user, alunoSelecionado, rotinaSelecionada]);

  useEffect(() => {
    if (!user) return;

    setLoadingAlunoData(true);

    const unsubscribeAlunoData = firestore()
      .collection("Alunos")
      .doc(user.uid)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data() as AlunoRootData;
            setAlunoRootData({
              id: data.id || "",
              nome: data.nome || "",
              email: data.email || "",
              foto: data.foto || "",
              senha: data.senha || "",
              telefone: data.telefone || "",
              idade: data.idade || "",
              sexo: data.sexo || "",
              grupo: data.grupo || "",
            });
          } else {
            setAlunoRootData(null);
          }
        },
        (error) => {
          console.error("Erro ao buscar alunoRootData:", error);
        }
      );

    setLoadingAlunoData(false);

    console.log(alunoRootData);

    return () => unsubscribeAlunoData();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    setLoadingRotina(true);

    const unsubscribeRotina = firestore()
      .collection("Alunos")
      .doc(user.uid)
      .collection("Rotinas")
      .onSnapshot(
        (rotinaSnapshot) => {
          const rotinaList: RotinaData[] = rotinaSnapshot.docs.map((doc) => ({
            id: doc.id,
            nome: doc.data().nome,
            divisaoTreinos: doc.data().divisaoTreinos,
            objetivoTreino: doc.data().objetivoTreino,
            dificuldadeTreino: doc.data().dificuldadeTreino,
            dataInicio: doc.data().dataInicio,
            dataTermino: doc.data().dataTermino,
          }));
          setRotinas(rotinaList);
        },
        (error) => {
          console.error("Erro ao buscar alunoRootData:", error);
          setLoadingRotina(false);
        }
      );

    setLoadingRotina(false);

    return () => {
      setRotinas([]);
      unsubscribeRotina();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    setLoadingAlunoData(true);

    const unsubscribeAlunoData = firestore()
      .collection("Alunos")
      .doc(user.uid)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data() as AlunoRootData;
            setAlunoRootData({
              id: data.id || "",
              personalId: data.personalId || "",
              nome: data.nome || "",
              email: data.email || "",
              foto: data.foto || "",
              senha: data.senha || "",
              telefone: data.telefone || "",
              idade: data.idade || "",
              sexo: data.sexo || "",
              grupo: data.grupo || "",
            });
          } else {
            setAlunoRootData(null);
          }
        },
        (error) => {
          console.error("Erro ao buscar alunoRootData:", error);
        }
      );

    setLoadingAlunoData(false);

    return () => unsubscribeAlunoData();
  }, [user]);

  useEffect(() => {
    if (!user || !rotinaSelecionada) return;

    setLoadingTreinos(true);

    const unsubscribeTreinos = firestore()
      .collection("Alunos")
      .doc(user.uid)
      .collection("Rotinas")
      .doc(rotinaSelecionada.id)
      .collection("Treinos")
      .onSnapshot(
        (snapshot) => {
          const treinoList: TreinoData[] = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              id: doc.id,
              musculo: data.musculo || "",
              exercicio: data.exercicios || {},
            };
          });
          setTreinos(treinoList);
        },
        (error) => {
          console.error("Erro ao buscar alunoRootData:", error);
          setLoadingRotina(false);
          setLoadingTreinos(false);
        }
      );

    setLoadingTreinos(false);
    setLoadingTreinos(false);

    return () => {
      setTreinos([]);
      unsubscribeTreinos();
    };
  }, [user, rotinaSelecionada]);

  return (
    <AlunoContext.Provider
      value={{
        alunos,
        rotinas,
        treinos,
        alunoRootData,
        loadingAlunoData,
        loadingAluno,
        loadingCreate,
        loadingRotina,
        loadingSaveExercise,
        loadingTreinos,
        createAluno,
        createRotina,
        createTreino,
        alunoSelecionado,
        setAlunoSelecionado,
        rotinaSelecionada,
        setRotinaSelecionada,
      }}
    >
      {children}
    </AlunoContext.Provider>
  );
};

export const useAluno = () => {
  const context = useContext(AlunoContext);
  if (!context) {
    throw new Error("useAluno deve ser usado dentro de AlunoProvider");
  }
  return context;
};
