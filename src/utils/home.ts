import { Pokemon } from "@/lib/pokedex-api"
import type { PokemonColor, PokemonType } from "@/types/pokedex-colors"
import type {
  PokemonGeneration,
  PokemonIconic,
  WhosThatPokemon,
} from "@/types/route-home"

// todo: Get Pokemon Generation List
const gen = [
  {
    id: 6,
    color: "red",
    description: "Kanto — where it all began. 151 originals.",
    region: "kanto",
  },
  {
    id: 156,
    color: "yellow",
    description: "Johto — day & night, friendship & steel.",
    region: "johto",
  },
  {
    id: 253,
    color: "green",
    description: "Hoenn — land, sea, and ancient legends.",
    region: "hoenn",
  },
  {
    id: 394,
    color: "blue",
    description: "Sinnoh — myth, time, and space collide.",
    region: "sinnoh",
  },
  {
    id: 510,
    color: "purple",
    description: "Unova — stories, seasons, and duality.",
    region: "unova",
  },
  {
    id: 659,
    color: "brown",
    description: "Kalos — mega evolutions and elegance.",
    region: "kalos",
  },
  {
    id: 733,
    color: "black",
    description: "Alola — island trials and Z-Moves.",
    region: "alola",
  },
  {
    id: 869,
    color: "white",
    description: "Galar — dynamax and the Wild Area.",
    region: "galar",
  },
  {
    id: 957,
    color: "pink",
    description: "Paldea — open world, three paths.",
    region: "paldea",
  },
]

export async function getGenerations(): Promise<PokemonGeneration> {
  const list = await Pokemon.getGenerationsList()

  const generations = list.results.map(async ({ name }, index) => {
    return await Pokemon.getGenerationByName(name).then((res) => ({
      name: res.names.filter(({ language }) => language.name === "en")[0].name,
      id: res.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${gen[index].id}.png`,
      color: gen[index].color as PokemonColor,
    }))
  })

  const result = await Promise.all(generations)

  return { count: list.count, data: result }
}

// todo: Get Iconic Pokemon
export async function getIconicPokemon(): Promise<PokemonIconic[]> {
  const species = await Pokemon.getPokemonSpeciesByName([
    "pikachu",
    "bulbasaur",
    "charmander",
    "squirtle",
  ])

  const pokemon = species.map(async ({ color, id, name }) => {
    const { types, sprites } = await Pokemon.getPokemonByName(name)
    return {
      name,
      types: types.map(({ type }) => type.name as PokemonType),
      id,
      color: color.name as PokemonColor,
      image:
        sprites.other["official-artwork"].front_default ||
        "/pokeball-multicolor.svg",
    }
  })

  return await Promise.all(pokemon)
}

// const generationItems = [
//   "generation-i",
//   "generation-ii",
//   "generation-iii",
//   "generation-iv",
//   "generation-v",
//   "generation-vi",
//   "generation-vii",
//   "generation-viii",
//   "generation-ix",
// ]

export async function getRandomPokemon(): Promise<WhosThatPokemon> {
  // const randomGeneration = Math.floor(Math.random() * generationItems.length)
  const gens = await Pokemon.getGenerationByName("generation-i")

  const randomNumber =
    Math.floor(Math.random() * gens.pokemon_species.length) + 1

  const gen1Pokemon = gens.pokemon_species[randomNumber - 1]
  const getPokemon = Pokemon.getPokemonByName(gen1Pokemon.name)
  const getPokemonBySpecies = Pokemon.getPokemonSpeciesByName(gen1Pokemon.name)
  const [pokemon, pokemonSpecies] = await Promise.all([
    getPokemon,
    getPokemonBySpecies,
  ])

  return {
    id: pokemon.id,
    name: pokemon.name,
    color: pokemonSpecies.color.name as PokemonColor,
    types: pokemon.types.map(({ type }) => type.name) as PokemonType[],
    image:
      pokemon.sprites.other["official-artwork"].front_default ||
      "/pokeball-multicolor.svg",
  }
}
