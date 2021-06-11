import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

const getPokemon = async (pokemon: any) => {
  return await axios.get(pokemon.url);
};

export { api, getPokemon };
