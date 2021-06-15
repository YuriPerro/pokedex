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
import {
  getColorByType,
  getNumberPokemon,
  getUrlImages,
  TouchableOpacity,
  width,
} from "../common/utils";
import { Fonts } from "../styles/fonts";
import PokemonImageScroll from "../components/PokemonImageScroll";
import Modal from "react-native-modalbox";

import pokeballBg from "../assets/pokeball-icon.png";
import { api, getPokemon, getSpecies } from "../services/api";
import { Load } from "../components/Load";

const FRONT = "FRONT";
const BACK = "BACK";

const ProfilePokemon = () => {
  const route = useRoute<any>();
  const flatList = useRef<FlatList>(null);
  const navigation = useNavigation();
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [pokemonList, setPokemonList] = useState<Array<Pokemon>>([]);
  const [species, setSpecies] = useState<any>();
  const modalRef = useRef<any>();

  const [currentIndex, setCurrentIndex] = useState(1);
  const [oldIndex, setOldIndex] = useState(0);

  useEffect(() => {
    if (route.params.pokemon) {
      setPokemon(route.params.pokemon);
      fetchSpecies(route.params.pokemon);
      // setCurrentIndex(route.params.pokemon.id);
      // async function fetch() {
      //   if (pokemonList.length == 0) {
      //     const pok: any = await fetchPokemons(route.params.pokemon);
      //     console.log("retornou");
      //     setPokemonList(pok);
      //   }
      // }

      // fetch();
    }
  }, []);

  const fetchSpecies = async (pokemon: Pokemon) => {
    if (pokemon) {
      const resp = await getSpecies(pokemon.id);
      if (resp) {
        setSpecies(resp.data);
      }
    }
  };

  const fetchPokemons = async (pokemon: Pokemon) => {
    return new Promise(async (resolve, reject) => {
      let listPokemon: Array<Pokemon> = [];
      for (let i = pokemon.id - 1; i <= pokemon.id + 1; i++) {
        if (i == 0) continue;
        console.log("chamou com: " + i);
        const resp: any = await api.get(`pokemon/${i}`);
        listPokemon.push(resp.data);
      }
      resolve(listPokemon);
    });

    // const results = resp.data.results;
    // const _pokemons: Array<Pokemon> = await Promise.all(
    //   results.map(async (pokemon: Pokemon) => {
    //     let pokemonFetched = await (await getPokemon(pokemon)).data;
    //     return pokemonFetched;
    //   })
    // );

    // setPokemonList(_pokemons);
  };

  const fetchOnePokemon = async (id: string, position: string) => {
    const resp: any = await api.get(`pokemon/${id}`);
    console.log("DEU FETCH EM: " + id);
    if (position === FRONT) {
      setPokemonList((old) => [...old, resp.data]);
    } else {
      setPokemonList((old) => [resp.data, ...old]);
    }
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
    return <PokemonImageScroll idPokemon={item?.id} key={item.id?.toString()} />;
  };
  const keyExtractor = (item: Pokemon) => item?.id?.toString();
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let pageNumber = Math.min(
      Math.max(Math.floor(e.nativeEvent.contentOffset.x / width + 0.5) + 1, 0),
      pokemonList.length
    );
    let fixedPage = pageNumber - 1;
    // let indexFetch = 0;
    // console.log("Antigo: " + fixedPage);
    // console.log("Novo: " + pageNumber);
    // if (oldIndex > currentIndex) {
    //   indexFetch = currentIndex - 2;
    //   if (indexFetch > 0) {
    //     fetchOnePokemon(String(indexFetch), FRONT);
    //   }
    // } else {
    //   indexFetch = currentIndex + 2;
    //   fetchOnePokemon(String(indexFetch), BACK);
    // }
    // setOldIndex(currentIndex);
    // setCurrentIndex(pageNumber);
    setPokemon(pokemonList[fixedPage]);
  };

  const getItemLayout = (data: any, index: any) => ({ length: 150, offset: 370 * index, index });

  if (!pokemon) return <Load />;

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
        </View>
        {pokemonList.length > 0 && (
          <FlatList
            ref={flatList}
            data={pokemonList}
            horizontal
            keyExtractor={keyExtractor}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            renderItem={renderItem}
            onMomentumScrollEnd={onScrollEnd}
            //initialScrollIndex={pokemon.id == 1 ? 0 : 1}
            getItemLayout={getItemLayout}
            // onScrollToIndexFailed={(info) => {
            //   const wait = new Promise((resolve) => setTimeout(resolve, 100));
            //   wait.then(() => {
            //     flatList.current?.scrollToIndex({ index: info.index, animated: true });
            //   });
            // }}
          />
        )}
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
                {Object.keys(pokemon?.stats).map((id, index) =>
                  index < 2 ? (
                    <Text key={id} style={[styles.infoPokemon]}>
                      {pokemon?.stats[parseFloat(id)].stat.name}
                      {index != 1 ? ", " : null}
                    </Text>
                  ) : null
                )}
                {pokemon?.stats.length >= 2 ? (
                  <TouchableOpacity
                    onPress={() => modalRef.current.open()}
                    style={[
                      styles.seeMore,
                      { backgroundColor: getColorByType(pokemon.types[0].type.name) },
                    ]}
                  >
                    <Text style={{ fontFamily: Fonts.Pop700, fontSize: 11, color: "#fff" }}>
                      Ver mais
                    </Text>
                  </TouchableOpacity>
                ) : null}
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
              {species && (
                <View style={styles.itemInfo}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="gender-male"
                      style={{ transform: [{ rotateZ: "-45deg" }] }}
                      size={21}
                      color="blue"
                    />
                    <Text style={[styles.infoPokemon, { marginRight: 15 }]}>
                      {(((8 - species.gender_rate) / 8) * 100).toFixed(1)}%
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="gender-female" size={24} color="pink" />
                    <Text style={styles.infoPokemon}>
                      {((species.gender_rate / 8) * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              )}

              {species && (
                <View style={styles.itemInfo}>
                  {Object.keys(species.egg_groups).map((id, index) => (
                    <Text key={id} style={styles.infoPokemon}>
                      {species?.egg_groups[id]?.name}
                      {species.egg_groups.length != index + 1 ? ", " : null}
                    </Text>
                  ))}
                </View>
              )}
              <View style={[styles.itemInfo, { top: 2 }]}>
                <Text style={styles.infoPokemon}>{species?.hatch_counter}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      <Modal
        ref={modalRef}
        backdrop
        style={{
          width: width * 0.7,
          height: 380,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          borderBottomColor: getColorByType(pokemon.types[0].type.name),
          borderBottomWidth: 15
        }}
      >
        <Image
          width={60}
          height={60}
          style={{ width: 60, height: 60 }}
          source={{ uri: getUrlImages(String(pokemon.id)) }}
        />
        <Text style={{ fontFamily: Fonts.Pop600, fontSize: 19 }}>{pokemon.name}</Text>
        <Text style={{ fontFamily: Fonts.Pop300, fontSize: 12, marginBottom: 30 }}>Species</Text>
        <View style={{ alignItems: "center" }}>
          {Object.keys(pokemon?.stats).map((id, index) => (
            <Text key={id} style={[styles.infoPokemon]}>
              {pokemon?.stats[parseFloat(id)].stat.name}
              {index != 1 ? ", " : null}
            </Text>
          ))}
        </View>
      </Modal>
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
    flexWrap: "wrap",
  },
  seeMore: {
    width: 70,
    height: 15,
    marginLeft: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
