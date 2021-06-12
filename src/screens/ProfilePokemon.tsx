import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../styles/colors";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { getColorByType, getNumberPokemon, TouchableOpacity } from "../common/utils";
import { Fonts } from "../styles/fonts";

const ProfilePokemon = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const [pokemon, setPokemon] = useState<Pokemon>();

  useEffect(() => {
    if (route.params.pokemon) {
      setPokemon(route.params.pokemon);
    }
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: getColorByType(pokemon?.types[0].type.name) }]}
    >
      <TouchableOpacity onPress={navigation.goBack} style={styles.header}>
        <MaterialCommunityIcons name="arrow-left" size={32} color="white" />
        <Text style={styles.idPokemon}>{getNumberPokemon(String(pokemon?.id))}</Text>
      </TouchableOpacity>
      <View style={styles.viewName}>
        <Text style={styles.namePokemon}>{pokemon?.name}</Text>
        <View style={styles.wrappedTypes}>
          {pokemon &&
            Object.keys(pokemon.types).map((id, index) => {
              return (
                <View key={index} style={styles.viewType}>
                  <Text style={styles.textType}>{pokemon.types[parseInt(id)].type.name}</Text>
                </View>
              );
            })}
        </View>
      </View>
      <View style={styles.contentProfilePokemon}>
        <View style={styles.firstSectionInfo}>
          <View style={styles.itemInfo}>
            <Text>Species</Text>
            <Text></Text>
          </View>
          <View style={styles.itemInfo}>
            <Text>Height</Text>
            <Text></Text>
          </View>
          <View style={styles.itemInfo}>
            <Text>Weight</Text>
            <Text></Text>
          </View>
          <View style={styles.itemInfo}>
            <Text>Abilities</Text>
            <Text></Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    marginTop: Platform.OS === "ios" ? getStatusBarHeight() : StatusBar.currentHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  idPokemon: {
    fontFamily: Fonts.Pop300,
    opacity: 0.5,
    fontSize: 18,
  },
  viewName: {
    width: "100%",
    alignItems: "center",
  },
  namePokemon: {
    fontFamily: Fonts.Pop700,
    color: Theme.BACKGROUND,
    fontSize: 24,
    paddingLeft: 5,
  },
  viewType: {
    justifyContent: "center",
    alignItems: "center",
    height: 18,
    width: 75,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.07)",
    marginTop: 5,
    marginLeft: 5,
  },
  textType: {
    fontFamily: Fonts.Pop500,
    color: Theme.BACKGROUND,
    fontSize: 11,
    paddingHorizontal: 5,
  },
  wrappedTypes: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentProfilePokemon: {
    backgroundColor: Theme.BACKGROUND,
    width: "100%",
    height: "65%",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    position: "absolute",
    bottom: 0,
  },
  firstSectionInfo: {
    backgroundColor: Theme.ELETRIC,
    width: "100%",
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ProfilePokemon;
