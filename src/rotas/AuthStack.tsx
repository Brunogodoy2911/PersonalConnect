import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../telas/Login/Login";
import Cadastro from "../telas/Cadastro/Cadastro";

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
}

export default function AuthStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}
