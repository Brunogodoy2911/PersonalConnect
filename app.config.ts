import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "PersonalConnect",
  slug: "PersonalConnect",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  plugins: [
    [
      "expo-splash-screen",
      {
        splash: {
          image: "./assets/splash.png",
          resizeMode: "cover", // Pode ser "contain" se você quiser preservar a proporção
          backgroundColor: "#ffffff",
        },
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "expo-video",
  ],
  ios: {
    supportsTablet: true,
  },
  android: {
    googleServicesFile: "./google-services.json",
    package: "com.brunogodoy.PersonalConnect",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "f1df3ea4-ce96-42ef-8d9b-f56a7ea16902",
    },
  },
});
