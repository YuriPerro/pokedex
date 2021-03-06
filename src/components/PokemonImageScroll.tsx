import React, { PureComponent } from "react";
import { StyleSheet, Image, View } from "react-native";
import { getUrlImages, width } from "../common/utils";

type Props = {
  idPokemon: number;
};

class CardPokemon extends PureComponent<Props> {
  render() {
    const { idPokemon } = this.props;
    return (
      <View key={idPokemon} style={styles.container}>
        <Image
          width={160}
          height={160}
          style={{ width: 160, height: 160 }}
          source={{ uri: getUrlImages(String(idPokemon)) }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 150,
    alignItems: "center",
    position: "relative",
    top: 45,
  },
});

export default CardPokemon;
