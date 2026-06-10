import type { PokeAPI } from "@/lib/pokedex-api"
import type { PokemonColor, PokemonType } from "./pokedex-colors"

export interface Abilities {
  name: string
  description: string
  is_hidden: boolean
}

export interface Info {
  flavorText: string
  generation: string
  genus: string
  id: number
  name: string
  stats: PokeAPI.PokemonStat[]
}

export interface Artwork {
  height: number
  is_baby: boolean
  is_legendary: boolean
  is_mythical: boolean
  name: string
  image: string
  color: PokemonColor
  shape: string
  types: PokemonType[]
  weight: number
}

export interface Details {
  evolvesFrom: string
  generation: string
  genus: string
  growthRate: string
  habitat: string
  color: PokemonColor
  shape: string
}

export type ChainWithImage = {
  species: string
  image: string
  evolves_to: ChainWithImage[]
}

export type EvolutionChain = {
  id: number
  chain: ChainWithImage
}
