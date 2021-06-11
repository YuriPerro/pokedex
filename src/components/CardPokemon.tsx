import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getColorByType, TouchableOpacity } from "../common/utils";
import { Theme } from "../styles/colors";
import { Fonts } from "../styles/fonts";

type CardProps = {
  pokemon: any;
};

const CardPokemon = ({ pokemon }: CardProps) => {
  const getNumberPokemon = (id: string) => {
    if (id.length == 1) {
      return "#00" + id;
    } else if (id.length >= 2) {
      return "#0" + id;
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: getColorByType(pokemon.types[0].type.name) }]}
    >
      <TouchableOpacity style={styles.touchView}>
        <View style={styles.containerId}>
          <Text style={styles.idPokemon}>{getNumberPokemon(String(pokemon.id))}</Text>
        </View>
        <Text style={styles.textType}>{pokemon.types[0].type.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "44%",
    height: 120,
    borderRadius: 15,
    backgroundColor: Theme.FIRE,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  touchView: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  textType: {
    fontFamily: Fonts.Pop600,
    color: Theme.GRAY_LIGHT,
  },
  containerId: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  idPokemon: {
    fontFamily: Fonts.Pop300,
    opacity: 0.4,
    fontSize: 15,
  },
});

export default CardPokemon;
