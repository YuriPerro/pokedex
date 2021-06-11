import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View, StatusBar, Image, FlatList } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { Theme } from "../styles/colors";
import { Fonts } from "../styles/fonts";

import pokeballBg from "../assets/pokeball-icon.png";
import { api, getPokemon } from "../services/api";
import { Load } from "../components/Load";
import { useState } from "react";
import CardPokemon from "../components/CardPokemon";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [filteredPokemons, setFilteredPokemons] = useState<any>();

  useEffect(() => {
    async function getData() {
      const resp = await api.get("pokemon?limit=10&offset=0");
      const results = resp.data.results;
      const _pokemons = await Promise.all(
        results.map(async (pokemon: any) => {
          let pokemonFetched = await (await getPokemon(pokemon)).data;
          return pokemonFetched;
        })
      );

      setFilteredPokemons(_pokemons);
      setLoading(false);
    }

    getData();
  }, []);

  if (loading) return <Load />;

  return (
    <View style={styles.container}>
      <View style={styles.wrappedContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={{ position: "absolute", right: 0 }}>
          <Image source={pokeballBg} style={styles.imageBg} />
        </View>
        <View style={styles.viewTitle}>
          <Text style={styles.title}>Pokedex</Text>
        </View>
        <View style={styles.containerFlatlist}>
          <FlatList
            data={filteredPokemons}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => <CardPokemon key={index} pokemon={item} />}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.BACKGROUND,
  },
  wrappedContainer: {
    marginTop: Platform.OS === "ios" ? getStatusBarHeight() : StatusBar.currentHeight,
    paddingTop: 40,
    paddingHorizontal: 15,
    flex: 1
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
  viewTitle: {
    height: 55,
  },
  containerFlatlist: {
    flex: 1,
  },
});

export default Home;
