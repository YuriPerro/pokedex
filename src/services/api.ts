import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

const getPokemon = async (pokemon: any) => {
  return await axios.get(pokemon.url);
};

const getSpecies = async (pokemonId: number) => {
  return await axios.get("https://pokeapi.co/api/v2/pokemon-species/" + pokemonId);
};

export { api, getPokemon, getSpecies };
