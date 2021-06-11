import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View, StatusBar, Image } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { Theme } from "../styles/colors";
import { Fonts } from "../styles/fonts";

import pokeballBg from "../assets/pokeball-icon.png";
import api from "../services/api";

const Home = () => {
  useEffect(() => {
    async function getData() {
      const resp = await api.get("pokemon?limit=5&offset=0");
      console.log(resp)

      const dt = await api.get(resp.data.results[0].url)
      console.log(dt.data.types[0].type.name)
    }

    getData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{ position: "absolute", right: 0 }}>
        <Image source={pokeballBg} style={styles.imageBg} />
      </View>
      <View style={styles.viewTitle}>
        <Text style={styles.title}>Pokedex</Text>
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.BACKGROUND,
    marginTop: Platform.OS === "ios" ? getStatusBarHeight() : StatusBar.currentHeight,
    paddingTop: 40,
    paddingHorizontal: 25,
  },
  title: {
    fontFamily: Fonts.Pop600,
    fontSize: 23,
  },
  imageBg: {
    width: 310,
    height: 310,
    position: "relative",
    opacity: 0.03,
    bottom: 60,
    left: 50,
  },
  viewTitle: {},
});

export default Home;
