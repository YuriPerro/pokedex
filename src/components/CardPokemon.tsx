import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getColorByType, getNumberPokemon, getUrlImages, TouchableOpacity } from "../common/utils";
import { Theme } from "../styles/colors";
import { Fonts } from "../styles/fonts";

import pokeballBg from "../assets/pokeball-icon.png";

type CardProps = {
  pokemon: Pokemon;
  onClickCard: (pokemon: Pokemon) => void;
};

const CardPokemon = ({ pokemon, onClickCard }: CardProps) => {
  return (
    <View
      style={[styles.container, { backgroundColor: getColorByType(pokemon.types[0].type.name) }]}
    >
      <TouchableOpacity style={styles.touchView} onPress={() => onClickCard(pokemon)}>
        <View style={styles.containerId}>
          <Text style={styles.idPokemon}>{getNumberPokemon(String(pokemon.id))}</Text>
        </View>
        <View style={styles.containerNames}>
          <Text style={styles.namePokemon}>{pokemon.name}</Text>
          <View>
            {Object.keys(pokemon.types).map((id, index) => {
              return (
                <View key={index} style={styles.viewType}>
                  <Text style={styles.textType}>{pokemon.types[parseInt(id)].type.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.containerImages}>
          <Image
            style={{ position: "absolute", width: 75, height: 75, opacity: 0.07 }}
            source={pokeballBg}
          />
          <Image
            style={{ width: 65, height: 65 }}
            width={65}
            height={65}
            source={{ uri: getUrlImages(String(pokemon.id)) }}
          />
        </View>
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

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.3,
    elevation: 2,
  },
  touchView: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  textType: {
    fontFamily: Fonts.Pop500,
    color: Theme.BACKGROUND,
    fontSize: 11,
    paddingHorizontal: 5,
  },
  containerId: {
    position: "absolute",
    right: 15,
    top: 5,
  },
  containerNames: {
    position: "absolute",
    left: 13,
    top: 20,
  },
  idPokemon: {
    fontFamily: Fonts.Pop300,
    opacity: 0.4,
    fontSize: 13,
  },
  namePokemon: {
    fontFamily: Fonts.Pop700,
    color: Theme.BACKGROUND,
    fontSize: 17,
  },
  viewType: {
    justifyContent: "center",
    alignItems: "center",
    height: 15,
    maxWidth: 60,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginTop: 5,
  },
  containerImages: {
    position: "relative",
    left: 40,
    top: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CardPokemon;
