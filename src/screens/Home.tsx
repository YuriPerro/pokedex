import React, { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { Theme } from "../styles/colors";
import { Fonts } from "../styles/fonts";

import pokeballBg from "../assets/pokeball-icon.png";
import { api, getPokemon } from "../services/api";
import { Load } from "../components/Load";
import { useState } from "react";
import CardPokemon from "../components/CardPokemon";
import { useNavigation } from "@react-navigation/native";
import Search from "../components/Search";
import { Alert } from "react-native";

const Home = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchPokemons();
    fetchPokemonsAllPokemons();
  }, []);

  const fetchPokemonsAllPokemons = async () => {
    try {
      const resp = await api.get(`pokemon?limit=1118&offset=0`);
      const results = resp.data.results;
      if (results) setAllPokemons(results);
    } catch (err) {
      Alert.alert("Ops", "Não conseguimos carregar os pokemons para a pesquisa 😥");
    }
  };

  const fetchPokemons = async () => {
    try {
      const resp = await api.get(`pokemon?limit=10&offset=${page}`);
      const results = resp.data.results;
      const _pokemons: Array<Pokemon> = await Promise.all(
        results.map(async (pokemon: Pokemon) => {
          let pokemonFetched = await (await getPokemon(pokemon)).data;
          return pokemonFetched;
        })
      );

      if (page > 0) {
        setPokemons((oldValue) => [...oldValue, ..._pokemons]);
        setFilteredPokemons((oldValue) => [...oldValue, ..._pokemons]);
      } else {
        setPokemons(_pokemons);
        setFilteredPokemons(_pokemons);
      }

      setLoadingMore(false);
      setLoading(false);
    } catch (err) {
      Alert.alert("Ops", "Não conseguimos carregar os pokemons 😥");
    }
  };

  const handleFetchMore = (distance: number) => {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage((oldValue) => oldValue + 10);
    fetchPokemons();
  };

  const goProfilePokemon = (pokemon: Pokemon) => {
    navigation.navigate("ProfilePokemon", { pokemon: pokemon, pokemonList: filteredPokemons });
  };

  const renderRow = ({ item, index }: any) => {
    return <CardPokemon onClickCard={goProfilePokemon} key={index} pokemon={item} />;
  };
  const keyExtractor = (item: Pokemon) => item.id.toString();

  if (loading) return <Load />;

  return (
    <View style={styles.container}>
      <View style={styles.wrappedContainer}>
        <StatusBar barStyle="dark-content" translucent />
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
            keyExtractor={keyExtractor}
            renderItem={renderRow}
            onEndReachedThreshold={0.2}
            onEndReached={({ distanceFromEnd }) => {
              handleFetchMore(distanceFromEnd);
            }}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator style={{ marginVertical: 20 }} color={Theme.FIRE} size="large" />
              ) : (
                <></>
              )
            }
          />
        </View>

        <Search />
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
    paddingTop: Platform.OS === "ios" ? 40 : 15,
    paddingHorizontal: 10,
    flex: 1,
  },
  title: {
    fontFamily: Fonts.Pop600,
    fontSize: 26,
    paddingLeft: 15,
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
