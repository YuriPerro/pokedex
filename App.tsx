import React, { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";

import Routes from "./src/routes/index";
import {
  useFonts,
  Poppins_300Light,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function App() {
  const [loadedResources, setLoadedResources] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const _loadResourcesAsync = async () => {
    return Promise.all([Asset.loadAsync([require("./src/assets/pokeball-icon.png")])]);
  };

  useEffect(() => {
    _loadResourcesAsync().then((res) => {
      if (res) {
        setLoadedResources(true);
      }
    });
  });

  if (!fontsLoaded || !loadedResources) {
    return <AppLoading />;
  }

  return <Routes />;
}
