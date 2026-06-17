import type { PokemonItem } from "@/types/pokemon-query"
import { type PokeAPI } from "./pokedex-api"

export function sortByInput(array: PokemonItem[], input: string) {
  const lowerCase = input.toLowerCase()

  return [...array].sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(lowerCase)
    const bStarts = b.name.toLowerCase().startsWith(lowerCase)

    // Prioritize items that start with input
    if (aStarts && !bStarts) return -1
    if (!aStarts && bStarts) return 1

    // If both match (or both don't), sort alphabetically
    //! return a.name.localeCompare(b.name)
    return 0
  })
}

export function getIdFromURL(url: string) {
  const result = url.match(/\/(\d+)\/$/)?.[1]

  return Number(result)!
}

export function getImagePathname(id: string | number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export function getPokemon({
  name,
  url,
}: PokeAPI.NamedAPIResource): PokemonItem {
  const id = getIdFromURL(url)
  return {
    name,
    id,
    image: getImagePathname(id),
  }
}

export function fetchPage({
  cursor,
  data,
  pageSize,
}: {
  cursor: string | null
  data: PokemonItem[]
  pageSize: number
}) {
  const startIndex = cursor
    ? data.findIndex((item) => item.id.toString() === cursor)
    : 0

  const results = data.slice(startIndex, startIndex + pageSize)
  const nextItem = data[startIndex + pageSize] ?? null // null = no more pages

  return {
    results,
    next: nextItem, // this becomes your next cursor
  }
}

export function generationLabel(generation: string) {
  const gen_1st_word = generation.split(" ")[0]
  const _generation =
    gen_1st_word && gen_1st_word.charAt(0).toUpperCase() + gen_1st_word.slice(1)
  const _roman = generation.split(" ")[1].toUpperCase()
  const GENERATION = _generation + " " + _roman
  return GENERATION
}
