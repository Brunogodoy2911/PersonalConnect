import "react-native-gesture-handler";
import "react-native-reanimated";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { ThemeProvider } from "@shopify/restyle";
import { Theme } from "./src/tema";
import AlertNotification from "./src/componentes/AlertNotification";
import { AuthProvider } from "./src/contextos/AuthContext";
import Router from "./src/rotas/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PersonalProvider } from "src/contextos/PersonalContext";
import { AlunoProvider } from "src/contextos/AlunoContext";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!fontError) {
    <View>
      <Text>Erro ao carregar as fontes</Text>
    </View>;
  }

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <AlertNotification>
        <ThemeProvider theme={Theme}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="#263850"
          />
          <AuthProvider>
            <PersonalProvider>
              <AlunoProvider>
                <Router />
              </AlunoProvider>
            </PersonalProvider>
          </AuthProvider>
        </ThemeProvider>
      </AlertNotification>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
