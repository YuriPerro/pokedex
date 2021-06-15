import React from "react";
import { useEffect } from "react";
import { StyleSheet, Image, View } from "react-native";
import { getUrlImages, width } from "../common/utils";

type Props = {
  idPokemon: number;
  key: string;
};

const PokemonImageScroll = ({ idPokemon, key }: Props) => {

  return (
    <View key={key} style={styles.container}>
      <Image
        width={150}
        height={150}
        style={{ width: 150, height: 150 }}
        source={{ uri: getUrlImages(String(idPokemon)) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: "center",
    position: "relative",
    top: 50,
    zIndex: 99,
  },
});

export default PokemonImageScroll;
