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
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { getBottomSpace, getStatusBarHeight } from "react-native-iphone-x-helper";
import { Theme } from "../styles/colors";
import { Fonts } from "../styles/fonts";
import { AntDesign } from "@expo/vector-icons";

import pokeballBg from "../assets/pokeball-icon.png";
import { api, getPokemon } from "../services/api";
import { Load } from "../components/Load";
import { useState } from "react";
import CardPokemon from "../components/CardPokemon";
import { height, TouchableOpacity, width } from "../common/utils";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";

const Home = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [marginBottom, setMarginBottom] = useState(30);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
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

        <KeyboardAvoidingView behavior="padding">
          <View style={[styles.containerSearch, { width: searchIsOpen ? "95%" : 60 }]}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setSearchIsOpen(true)}
              disabled={searchIsOpen}
              style={{
                width: searchIsOpen ? "95%" : 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {searchIsOpen ? (
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                  <TextInput
                    placeholder="Pesquisar Pokemon"
                    style={{
                      fontFamily: Fonts.Pop500,
                      color: Theme.BACKGROUND,
                      fontSize: 16,
                      paddingLeft: 10,
                      borderRadius: 25,
                      marginRight: 15,
                      height: 60,
                      width: "80%",
                    }}
                  />
                  <TouchableOpacity onPress={() => setSearchIsOpen(false)}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              ) : (
                <AntDesign name="search1" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  containerSearch: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.ELETRIC,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.9,
    elevation: 2,
    bottom: Platform.OS === "ios" ? getBottomSpace() : 25,
    right: 10,
    alignSelf: "flex-end",
  },
});

export default Home;
