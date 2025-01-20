import React, { useEffect, useState } from "react";
import { useAuth } from "../contextos/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import PersonalStack from "./PersonalStack";
import AlunoStack from "./AlunoStack";
import AuthStack from "./AuthStack";
import { Box } from "src/componentes";
import Video from "react-native-video";
import firestore from "@react-native-firebase/firestore";
import { StyleSheet } from "react-native";

const videoSource = require("../../assets/SplashAnimate.mp4");

export default function Router() {
  const { user, loading } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const manageSplashScreen = async () => {
      if (loading) {
        await SplashScreen.preventAutoHideAsync();
      } else {
        await SplashScreen.hideAsync();
      }
    };

    manageSplashScreen();
  }, [loading]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (user) {
      const userDocRef = firestore().collection("user").doc(user.uid);
      unsubscribe = userDocRef.onSnapshot(
        (doc) => {
          if (doc.exists) {
            setUserType(doc.data()?.type || null);
          } else {
            setUserType(null);
          }
        },
        (error) => {
          console.error("Erro ao obter dados do usuário:", error);
        }
      );
    } else {
      setUserType(null);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  if (loading || (user && userType === null)) {
    return (
      <Box pointerEvents="none" flex={1}>
        <Video
          source={videoSource}
          style={styles.video}
          resizeMode="cover"
          repeat
          muted
        />
      </Box>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        userType === "personal" ? (
          <PersonalStack />
        ) : (
          <AlunoStack />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  video: {
    flex: 1,
    width: "100%",
  },
});
