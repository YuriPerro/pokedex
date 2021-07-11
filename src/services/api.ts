import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

// API for get single pokemon details
const getPokemon = async (pokemon: any) => {
  return await axios.get(pokemon.url);
};

// API for get species pokemon details
const getSpecies = async (pokemonId: number) => {
  return await axios.get("https://pokeapi.co/api/v2/pokemon-species/" + pokemonId);
};

export { api, getPokemon, getSpecies };
