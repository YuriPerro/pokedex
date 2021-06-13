import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../styles/colors";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { getColorByType, getNumberPokemon, TouchableOpacity, width } from "../common/utils";
import { Fonts } from "../styles/fonts";
import PokemonImageScroll from "../components/PokemonImageScroll";

import pokeballBg from "../assets/pokeball-icon.png";
import PokeballBG from "../components/PokeballBG";
import { api, getPokemon } from "../services/api";

const ProfilePokemon = () => {
  const route = useRoute<any>();
  const flatList = useRef<FlatList>(null);
  const navigation = useNavigation();
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [pokemonList, setPokemonList] = useState<Array<Pokemon>>([]);

  useEffect(() => {
    if (route.params.pokemon) {
      setPokemon(route.params.pokemon);

      fetchPokemons();
    }
  }, []);

  const fetchPokemons = async () => {
    const resp = await api.get(`pokemon?limit=6&offset=0`);
    const results = resp.data.results;
    const _pokemons: Array<Pokemon> = await Promise.all(
      results.map(async (pokemon: Pokemon) => {
        let pokemonFetched = await (await getPokemon(pokemon)).data;
        return pokemonFetched;
      })
    );

    setPokemonList(_pokemons);
  };

  // Function used for convert Hectograma to pound
  const convertHectoToLbs = (lbs: number) => {
    return (lbs / 4.536).toFixed(1);
  };

  // Function used for convert decimetres to
  const convertDecToPol = (dec: number) => {
    return (dec * 3.937).toFixed(2);
  };

  const renderItem = ({ item, index }: any) => {
    console.log(item.id);
    return <PokemonImageScroll idPokemon={item?.id} key={index} />;
  };
  const keyExtractor = (item: Pokemon) => item.id.toString();
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let pageNumber = Math.min(
      Math.max(Math.floor(e.nativeEvent.contentOffset.x / width + 0.5) + 1, 0),
      pokemonList.length
    );
    setPokemon(pokemonList[pageNumber - 1]);
  };

  const getItemLayout = (data: any, index: any) => ({ length: 150, offset: 370 * index, index });

  return (
    <View
      style={[styles.container, { backgroundColor: getColorByType(pokemon?.types[0].type.name) }]}
    >
      <StatusBar barStyle={"light-content"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <MaterialCommunityIcons name="arrow-left" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.idPokemon}>{getNumberPokemon(String(pokemon?.id))}</Text>
      </View>
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
      <View style={{ zIndex: 999, height: 250, alignItems: "center" }}>
        <View style={{ position: "absolute" }}>
          {/* <Image
            width={220}
            height={220}
            style={{ width: 220, height: 220, top: 20, position: "relative" }}
            source={pokeballBg}
          /> */}
          <PokeballBG width={100} height={100} style={{ height: 100, width: 100 }} />
        </View>
        <FlatList
          ref={flatList}
          data={pokemonList}
          horizontal
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={renderItem}
          onMomentumScrollEnd={onScrollEnd}
          initialScrollIndex={3}
          getItemLayout={getItemLayout}
          // onScrollToIndexFailed={(info) => {
          //   const wait = new Promise((resolve) => setTimeout(resolve, 100));
          //   wait.then(() => {
          //     flatList.current?.scrollToIndex({ index: info.index, animated: true });
          //   });
          // }}
        />
      </View>
      {pokemon && (
        <View style={styles.contentProfilePokemon}>
          <View style={styles.firstSectionInfo}>
            <View>
              <View style={styles.itemInfo}>
                <Text style={styles.typeInfo}>Species</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.typeInfo}>Height</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.typeInfo}>Weight</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.typeInfo}>Abilities</Text>
              </View>
            </View>

            <View style={{ marginLeft: 45 }}>
              <View style={styles.itemInfo}>
                {Object.keys(pokemon?.stats).map((id) => (
                  <Text key={id} style={styles.infoPokemon}>
                    {pokemon?.stats[parseFloat(id)].stat.name}
                    {", "}
                  </Text>
                ))}
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.infoPokemon}>
                  {convertDecToPol(pokemon?.weight)} ({pokemon?.height * 10} cm)
                </Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.infoPokemon}>
                  {convertHectoToLbs(pokemon?.weight)} lbs ({pokemon?.weight / 10} kg)
                </Text>
              </View>
              <View style={styles.itemInfo}>
                {Object.keys(pokemon?.abilities).map((id) => (
                  <Text key={id} style={styles.infoPokemon}>
                    {pokemon?.abilities[parseFloat(id)].ability.name}
                    {pokemon?.abilities.length == parseFloat(id) + 1 ? "" : ", "}
                  </Text>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.secondSectionInfo}>
            <View>
              <View style={styles.viewSubTitle}>
                <Text style={styles.subTitleSection}>Breeding</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.typeInfo}>Gender</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.typeInfo}>Egg Group</Text>
                <Text style={styles.infoPokemon}></Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.typeInfo}>Egg Cycle</Text>
              </View>
            </View>
            <View style={{ marginLeft: 25 }}>
              <View style={styles.viewSubTitle}>
                <Text style={styles.subTitleSection}> </Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.infoPokemon}>dds</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.infoPokemon}>xxcc</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.infoPokemon}>aa</Text>
              </View>
            </View>
          </View>
        </View>
      )}
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
    zIndex: 1,
  },
  firstSectionInfo: {
    width: "100%",
    marginTop: 100,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  typeInfo: {
    fontFamily: Fonts.Pop300,
    fontSize: 17,
  },
  secondSectionInfo: {
    width: "100%",
    marginTop: 35,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  viewSubTitle: {},
  subTitleSection: {
    fontFamily: Fonts.Pop600,
    fontSize: 18,
  },
  infoPokemon: {
    fontFamily: Fonts.Pop600,
    fontSize: 16,
    textAlign: "left",
  },
});

export default ProfilePokemon;
