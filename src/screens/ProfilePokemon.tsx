import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../styles/colors";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { getColorByType, getNumberPokemon, TouchableOpacity, width } from "../common/utils";
import { Fonts } from "../styles/fonts";
import PokemonImageScroll from "../components/PokemonImageScroll";
import ModalSeeMore from "../components/ModalSeeMore";

import pokeballBg from "../assets/pokeball-icon.png";
import { api, getSpecies } from "../services/api";
import { Load } from "../components/Load";
import { Alert } from "react-native";

const SPECIES = "Species";
const ABILITIES = "Abilities";

const ProfilePokemon = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const flatList = useRef<FlatList>(null);
  const modalRef = useRef<any>();

  const [pokemon, setPokemon] = useState<Pokemon>();
  const [pokemonList, setPokemonList] = useState<Array<Pokemon>>([]);
  const [species, setSpecies] = useState<any>();
  const [titleModal, setTitleModal] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params.pokemon) {
      setPokemon(route.params.pokemon);
      fetchSpecies(route.params.pokemon);
      fetchOnePokemon(route.params.pokemon.id);
    }
  }, []);

  const fetchSpecies = async (pokemon: Pokemon) => {
    try {
      if (pokemon) {
        const resp = await getSpecies(pokemon.id);
        if (resp) {
          setSpecies(resp.data);
        }
      }
    } catch (error) {
      Alert.alert("Ops", "Tivemos um erro ao carregar as species 🤔");
    }
  };

  const fetchOnePokemon = async (id: number) => {
    setLoading(true);
    if (id == 0) return;
    let initialIndex = id - 2;
    if (id <= 2) initialIndex = 1;

    try {
      for (let index = initialIndex; index <= id + 2; index++) {
        const resp: any = await api.get(`pokemon/${index}`);
        console.log("fetchOnePokemon: " + index);
        setPokemonList((old) => [...old, resp.data]);
      }
      setLoading(false);
    } catch (error) {
      Alert.alert("Ops", "Tivemos um erro ao carregar os pokemons 🤔");
    }
  };

  const fetchMorePokemons = async (id: number, currentIndex: number, oldIndex: number) => {
    try {
      if (id == 0) return;
      let idPokemon = id;

      const scrolledTofront = oldIndex < currentIndex;
      if (scrolledTofront) idPokemon += 1;
      else idPokemon -= 1;

      const filtered = pokemonList.filter((pokemon) => pokemon.id === idPokemon);
      if (filtered.length == 0) {
        const resp: any = await api.get(`pokemon/${idPokemon}`);
        console.log("fetchMorePokemons: " + idPokemon);

        console.log("scrolledTofront: " + scrolledTofront);
        if (scrolledTofront) setPokemonList((old) => [...old, resp.data]);
        else {
          console.log("INSERIU ANTES: " + resp.data.id);
          setPokemonList((old) => [resp.data, ...old]);
        }
      } else {
      }
    } catch (error) {
      Alert.alert("Ops", "Tivemos um erro ao carregar o proximo pokemon 🤔");
    }
  };

  // Function used for convert Hectograma to pound
  const convertHectoToLbs = (lbs: number) => {
    return (lbs / 4.536).toFixed(1);
  };

  // Function used for convert decimetres to Pol
  const convertDecToPol = (dec: number) => {
    let converted = (dec * 3.937).toFixed(2);
    converted = converted[0] + '"' + converted[1] + "." + converted[2] + "'";
    return converted;
  };

  const openModal = (type: string) => {
    if (type === SPECIES) {
      setTitleModal(SPECIES);
      modalRef?.current.open();
    } else {
      setTitleModal(ABILITIES);
      modalRef?.current.open();
    }
  };

  // Function used for improve performance of Flatlist
  const getItemLayout = (item: any, index: any) => ({
    length: 150,
    offset: width * index - 1,
    index,
  });

  const renderItem = ({ item, index }: any) => {
    return <PokemonImageScroll idPokemon={item?.id} />;
  };

  const keyExtractor = (item: Pokemon) => item?.id?.toString();

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let pageNumber = Math.min(
      Math.max(Math.floor(e.nativeEvent.contentOffset.x / width + 0.5) + 1, 0),
      pokemonList.length
    );
    let fixedPage = pageNumber - 1;
    setPokemon(pokemonList[fixedPage]);
    if (pokemon)
      fetchMorePokemons(pokemonList[fixedPage].id, pokemonList[fixedPage].id, pokemon?.id);
  };

  const getInitialScrollIndex = () => {
    if (pokemonList.length > 1 && route.params.pokemon.id <= 1) return 0;
    else if (route.params.pokemon.id == 2) return 1;
    else if (pokemonList.length > 2) {
      return 2;
    } else return null;
  };

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
      <View style={{ zIndex: 2, height: 250, alignItems: "center" }}>
        <View style={{ position: "absolute" }}>
          {/* <Image
            width={220}
            height={220}
            style={{ width: 220, height: 220, top: 20, position: "relative" }}
            source={pokeballBg}
          /> */}
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            ref={flatList}
            data={pokemonList}
            horizontal
            pagingEnabled
            keyExtractor={keyExtractor}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            onMomentumScrollEnd={onScrollEnd}
            //getItemLayout={getItemLayout}
            initialScrollIndex={getInitialScrollIndex()}
          />
        )}
      </View>

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

          {pokemon && (
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
                {/* {pokemon?.stats.length >= 2 ? (
                  <TouchableOpacity
                    onPress={() => openModal(SPECIES)}
                    style={[
                      styles.seeMore,
                      { backgroundColor: getColorByType(pokemon.types[0].type.name) },
                    ]}
                  >
                    <Text style={{ fontFamily: Fonts.Pop700, fontSize: 11, color: "#fff" }}>
                      see more
                    </Text>
                  </TouchableOpacity>
                ) : null} */}
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
                {Object.keys(pokemon?.abilities).map((id, index) =>
                  index < 2 ? (
                    <Text key={id} style={[styles.infoPokemon]}>
                      {pokemon?.abilities[parseFloat(id)].ability.name}
                      {index != 1 ? ", " : null}
                    </Text>
                  ) : null
                )}
              </View>
              {pokemon?.abilities.length > 2 ? (
                <TouchableOpacity
                  onPress={() => openModal(ABILITIES)}
                  style={[
                    styles.seeMore,
                    { backgroundColor: getColorByType(pokemon.types[0].type.name), marginLeft: 0 },
                  ]}
                >
                  <Text style={{ fontFamily: Fonts.Pop700, fontSize: 11, color: "#fff" }}>
                    see more
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
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
      <ModalSeeMore pokemon={pokemon} titleModal={titleModal} modalRef={modalRef} />
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
