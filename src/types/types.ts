type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility;
  forms: any;
  game_indices: any;
  held_items: any;
  location_area_encounters: any;
  moves: any;
  sprites: any;
  species: any;
  stats: any;
  types: Array<PokemonType>;
};

type PokemonAbility = {
  is_hidden: boolean;
  slot: number;
  ability: Array<any>;
};

type PokemonType = {
  slot: number;
  type: Type;
};

type Type = {
  name: string;
  url: string;
};
