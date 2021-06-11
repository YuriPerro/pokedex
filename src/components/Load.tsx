import React from "react";
import { StyleSheet, View } from "react-native";

import LottieView from "lottie-react-native";
import loadAnimation from "../assets/load.json";
import { Theme } from "../styles/colors";

export function Load() {
  return (
    <View style={styles.container}>
      <LottieView source={loadAnimation} autoPlay loop style={styles.animation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.BACKGROUND,
  },
  animation: {
    width: 200,
    height: 200,
  },
});