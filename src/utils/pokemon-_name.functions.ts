import { Pokemon, type PokeAPI } from "@/lib/pokedex-api"
import { getIdFromURL, getImagePathname } from "@/lib/pokemon-utils"
import type { PokemonColor, PokemonType } from "@/types/pokedex-colors"
import type {
  Abilities,
  Artwork,
  ChainWithImage,
  Details,
  EvolutionChain,
  Info,
} from "@/types/route-pokemon-_name"
import { createServerFn } from "@tanstack/react-start"

const file_path = "pokestart/src/utils/pokemon-_name.functions.ts"

export const getPokemonFn = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: current }) => {
    const pokemon = await Pokemon.getPokemonByName(current)
      .then((res) => res)
      .catch((err) => {
        console.error(`Error in "${file_path}"`, err)
        return {} as PokeAPI.Pokemon
      })
    const species = await Pokemon.getPokemonSpeciesByName(pokemon.species.name)
      .then((res) => res)
      .catch((err) => {
        console.error(`Error in "${file_path}"`, err)
        return {} as PokeAPI.PokemonSpecies
      })
    const _abilities = pokemon.abilities.map(abilitiesFn)
    const _evolutionChain = evolutionChainFn(species.evolution_chain.url)

    const [evolutionChain, ...abilities] = await Promise.all([
      _evolutionChain,
      ..._abilities,
    ])

    // todo: INFO
    const info: Info = {
      flavorText: species.flavor_text_entries.filter(
        ({ language }) => language.name === "en"
      )[0].flavor_text,
      generation: species.generation.name,
      genus: species.genera.filter(({ language }) => language.name === "en")[0]
        .genus,
      id: pokemon.id,
      name: pokemon.name,
      stats: pokemon.stats,
    }
    // todo: ARTWORK
    const artwork: Artwork = {
      height: pokemon.height / 10,
      is_baby: species.is_baby,
      is_legendary: species.is_legendary,
      is_mythical: species.is_mythical,
      name: pokemon.name,
      image:
        pokemon.sprites.other["official-artwork"].front_default ||
        "/pokeball-multicolor.svg",
      color: species.color.name as PokemonColor,
      shape: species.shape.name,
      types: pokemon.types.map(({ type }) => type.name as PokemonType),
      weight: pokemon.weight / 10,
    }
    // todo: DETAILS
    const details: Details = {
      evolvesFrom: species.evolves_from_species?.name || "",
      generation: species.generation.name,
      genus: species.genera.filter(({ language }) => language.name === "en")[0]
        .genus,
      growthRate: species.growth_rate.name,
      habitat: species.habitat?.name || "",
      color: species.color.name as PokemonColor,
      shape: species.shape.name,
    }

    // todo: Abilities
    const _abilities_: Abilities[] = [...abilities]
    const _evolutionChain_: EvolutionChain = evolutionChain

    return {
      abilities: _abilities_,
      artwork,
      details,
      evolutionChain: _evolutionChain_,
      info,
      _name: pokemon.name,
    }
  })

async function abilitiesFn(args: PokeAPI.PokemonAbility) {
  const { ability, is_hidden } = args
  const _ability = await Pokemon.getAbilityByName(ability.name)
  const eff_entries = _ability.effect_entries.filter(
    ({ language }) => language.name === "en"
  )[0].short_effect

  const description = eff_entries

  return { name: ability.name, description, is_hidden }
}

async function evolutionChainFn(url: string) {
  const chainId = getIdFromURL(url)
  const evolutionChain = Pokemon.getEvolutionChainById(Number(chainId)!)
    .then((res) => {
      return {
        id: res.id,
        chain: chainWithImage(res.chain),
      }
    })
    .catch((err) => {
      console.error('Error in "pokestart/src/utils/pokemon-_name.ts"', err)
      return {} as {
        id: number
        chain: ChainWithImage
      }
    })
  return evolutionChain
}

function chainWithImage(chain: PokeAPI.Chain): ChainWithImage {
  return {
    species: chain.species.name,
    image: getImagePathname(getIdFromURL(chain.species.url)),
    evolves_to: chain.evolves_to.map(chainWithImage),
  }
}

// TODO: Pokemon Neighbors | Prev and Next Pokemon | Navigation
export const getPokemonNeighborsFn = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: currentPokemon }) => {
    const { results } = (await Pokemon.getPokemonsList()) as {
      results: { name: string; url: string }[]
    }
    const index = results.findIndex((p) => p.name === currentPokemon)

    if (index === -1) return { prev: null, next: null }

    const prevPokemon = results[index - 1]?.name
      ? await Pokemon.getPokemonByName(results[index - 1].name).then((res) => ({
          id: res.id,
          name: res.name,
          image:
            res.sprites.other.showdown.front_default ||
            res.sprites.front_default,
        }))
      : null

    const nextPokemon = results[index + 1]?.name
      ? await Pokemon.getPokemonByName(results[index + 1].name).then((res) => ({
          id: res.id,
          name: res.name,
          image:
            res.sprites.other.showdown.front_default ||
            res.sprites.front_default,
        }))
      : null

    return {
      prev: prevPokemon ?? null,
      next: nextPokemon ?? null,
    }
  })
