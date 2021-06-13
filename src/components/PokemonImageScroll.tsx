import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { getUrlImages, width } from "../common/utils";

type Props = {
  idPokemon: number;
};

const PokemonImageScroll = ({ idPokemon }: Props) => {
  return (
    <View style={styles.container}>
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
