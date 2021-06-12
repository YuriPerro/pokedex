import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../styles/colors";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { getNumberPokemon } from "../common/utils";
import { Fonts } from "../styles/fonts";

const ProfilePokemon = () => {
  const route = useRoute<any>();

  const [pokemon, setPokemon] = useState<Pokemon>();

  useEffect(() => {
    if (route.params.pokemon) {
      setPokemon(route.params.pokemon);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="arrow-left" size={32} color="white" />
        <Text style={styles.idPokemon}>{getNumberPokemon(String(pokemon?.id))}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.GRASS,
    paddingTop: 20,
  },
  header: {
    marginTop: Platform.OS === "ios" ? getStatusBarHeight() : StatusBar.currentHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  idPokemon: {
      fontFamily: Fonts.Pop300,
      opacity: .5,
      fontSize: 18
  }
});

export default ProfilePokemon;
