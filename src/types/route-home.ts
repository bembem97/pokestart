import type { PokemonColor, PokemonType } from "./pokedex-colors"

export type Generation = {
  name: string
  id: string
  image: string
  color: PokemonColor
}

export type PokemonGeneration = {
  count: number
  data: Generation[]
}

export type PokemonIconic = {
  color: PokemonColor
  id: number
  image: string
  name: string
  types: PokemonType[]
}

export type WhosThatPokemon = {
  color: PokemonColor
  id: number
  image: string
  name: string
  types: PokemonType[]
}
