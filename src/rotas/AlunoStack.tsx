import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeAluno from "../telas/HomeAluno/HomeAluno";
import TreinosAlunos from "src/telas/TreinosAlunos/TreinosAlunos";
import { RotinaData } from "src/contextos/AlunoContext";
import DetalhePerfilAluno from "src/telas/DetalhePerfilAluno/DetalhePerfilAluno";
import EditAluno from "src/telas/EditAluno/EditAluno";

export type RootStackParamList = {
  HomeAluno: undefined;
  TreinosAluno: { rotina: RotinaData };
  DetalhePerfilAluno: undefined;
  EditAluno: undefined;
};

export default function AlunoStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="HomeAluno"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="EditAluno" component={EditAluno} />
      <Stack.Screen name="DetalhePerfilAluno" component={DetalhePerfilAluno} />
      <Stack.Screen name="TreinosAluno" component={TreinosAlunos} />
      <Stack.Screen name="HomeAluno" component={HomeAluno} />
    </Stack.Navigator>
  );
}
