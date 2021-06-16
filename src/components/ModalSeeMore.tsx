import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import Modal from "react-native-modalbox";
import { getColorByType, getUrlImages, width } from "../common/utils";
import { Fonts } from "../styles/fonts";

type Props = {
  modalRef?: React.LegacyRef<Modal> | undefined;
  pokemon: Pokemon;
  titleModal: string;
};

const SPECIES = "Species";
const ABILITIES = "Abilities";

const ModalSeeMore = ({ modalRef, pokemon, titleModal }: Props) => {
  return (
    <Modal
      ref={modalRef}
      backdrop
      style={[styles.modal, { borderBottomColor: getColorByType(pokemon.types[0].type.name) }]}
    >
      <Image
        width={60}
        height={60}
        style={{ width: 60, height: 60 }}
        source={{ uri: getUrlImages(String(pokemon.id)) }}
      />
      <Text style={{ fontFamily: Fonts.Pop600, fontSize: 19 }}>{pokemon.name}</Text>
      <Text style={{ fontFamily: Fonts.Pop300, fontSize: 12, marginBottom: 30 }}>{titleModal}</Text>
      <View style={{ alignItems: "center" }}>
        {titleModal === SPECIES
          ? Object.keys(pokemon?.stats).map((id, index) => (
              <Text key={id} style={[styles.infoPokemon]}>
                {pokemon?.stats[parseFloat(id)].stat.name}
              </Text>
            ))
          : Object.keys(pokemon?.abilities).map((id, index) => (
              <Text key={id} style={[styles.infoPokemon]}>
                {pokemon?.abilities[parseFloat(id)].ability.name}
              </Text>
            ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: width * 0.7,
    height: 380,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 15,
  },
  infoPokemon: {
    fontFamily: Fonts.Pop600,
    fontSize: 16,
    textAlign: "left",
  },
});

export default ModalSeeMore;
