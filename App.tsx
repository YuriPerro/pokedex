import React from "react";
import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
import { StyleSheet, Text, View } from "react-native";

import Routes from "./src/routes/index";
import {
  useFonts,
  Poppins_300Light,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <Routes />;
}
