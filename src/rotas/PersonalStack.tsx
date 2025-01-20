import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomePersonal from "../telas/HomePersonal/HomePersonal";
import DetalhePerfil from "src/telas/DetalhePerfil/DetalhePerfil";
import EditProfile from "src/telas/EditProfile/EditProfile";
import AddAluno from "src/telas/AddAluno/AddAluno";
import Rotinas from "src/telas/Rotinas/Rotinas";
import Refeicoes from "src/telas/Refeicoes/Refeicoes";
import CriarRotina from "src/telas/CriarRotina/CriarRotina";
import Treinos from "src/telas/Treinos/Treinos";
import { RotinaData } from "src/contextos/AlunoContext";
import AddTreino from "src/telas/AddTreino/AddTreino";

export type RootStackParamList = {
  HomePersonal: undefined;
  DetalhesPerfil: undefined;
  EditProfile: undefined;
  AddAluno: undefined;
  Refeicoes: { alunoNome: string };
  Rotinas: { alunoNome: string };
  CriarRotina: undefined;
  Treinos: { rotina: RotinaData };
  AddTreino: undefined;
};

export default function PersonalStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="HomePersonal"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AddTreino" component={AddTreino} />
      <Stack.Screen name="Treinos" component={Treinos} />
      <Stack.Screen name="CriarRotina" component={CriarRotina} />
      <Stack.Screen name="Rotinas" component={Rotinas} />
      <Stack.Screen name="Refeicoes" component={Refeicoes} />
      <Stack.Screen name="HomePersonal" component={HomePersonal} />
      <Stack.Screen name="DetalhesPerfil" component={DetalhePerfil} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AddAluno" component={AddAluno} />
    </Stack.Navigator>
  );
}
