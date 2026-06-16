import { PokemonType } from "@/components/common/pokemon-type"
import Typography from "@/components/common/typography"
import { EvolutionChain, PokemonNav } from "@/components/router/pokemon-_name"
import { Badge } from "@/components/ui/badge"
import { Item, ItemContent } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { POKEDEX, POKEMON } from "@/const/pokemon"
import { Pokemon, type PokeAPI } from "@/lib/pokedex-api"
import { getIdFromURL, getImagePathname } from "@/lib/pokemon-utils"
import { createTitle } from "@/lib/seo"
import { capitalFirstLetter, hyphenToWhitespace } from "@/lib/utils"
import type {
  PokemonColor,
  PokemonType as PokemonTypeProps,
} from "@/types/pokedex-colors"
import type {
  Abilities,
  Artwork,
  ChainWithImage,
  Details,
  EvolutionChain as EvolutionChainProps,
  Info,
} from "@/types/route-pokemon-_name"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Image } from "@unpic/react"
import React from "react"

const file_path = "pokestart/src/function/pokemon-_name.ts"

export const getPokemonFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: current }) => {
    try {
      const pokemon = await Pokemon.getPokemonByName(current)
      const species = await Pokemon.getPokemonSpeciesByName(
        pokemon.species.name
      )
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
        genus: species.genera.filter(
          ({ language }) => language.name === "en"
        )[0].genus,
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
          pokemon.sprites.other.dream_world.front_default ||
          pokemon.sprites.other.home.front_default ||
          getImagePathname(getIdFromURL(pokemon.species.url)) ||
          "/pokeball-multicolor.svg",
        color: species.color.name as PokemonColor,
        shape: species.shape.name,
        types: pokemon.types.map(({ type }) => type.name as PokemonTypeProps),
        weight: pokemon.weight / 10,
      }
      // todo: DETAILS
      const details: Details = {
        evolvesFrom: species.evolves_from_species?.name || "",
        generation: species.generation.name,
        genus: species.genera.filter(
          ({ language }) => language.name === "en"
        )[0].genus,
        growthRate: species.growth_rate.name,
        habitat: species.habitat?.name || "",
        color: species.color.name as PokemonColor,
        shape: species.shape.name,
      }

      // todo: Abilities
      const _abilities_: Abilities[] = [...abilities]
      const _evolutionChain_: EvolutionChainProps = evolutionChain

      return {
        abilities: _abilities_,
        artwork,
        details,
        evolutionChain: _evolutionChain_,
        info,
        _name: pokemon.name,
      }
    } catch (error) {
      throw redirect({
        to: "/pokemon/variant/$name",
        params: { name: current },
        throw: true,
      })
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
      console.error('Error in "pokestart/src/function/pokemon-_name.ts"', err)
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
  .validator((id: string) => id)
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

const getPokemon = createServerFn({ method: "GET" })
  .validator((name: string) => name)
  .handler(async ({ data: name }) => {
    const pokemon = await getPokemonFn({ data: name })
    const neighbors = await getPokemonNeighborsFn({ data: pokemon._name })

    return { pokemon, neighbors }
  })

export const Route = createFileRoute("/pokemon/$name")({
  component: RouteComponent,
  loader: ({ params }) => getPokemon({ data: params.name }),
  head: ({ params }) => ({
    meta: [{ title: createTitle(capitalFirstLetter(params.name)) }],
  }),
})

function RouteComponent() {
  const { pokemon, neighbors } = Route.useLoaderData()
  const { abilities, artwork, details, evolutionChain, info } = pokemon

  return (
    <div className="space-y-6 py-6">
      <section className="container-spacing grid grid-cols-1 gap-x-4 gap-y-6 3xl:grid-cols-2">
        <PokemonInfo data={info} />
        <PokemonArtwork data={artwork} />
        <PokemonAbilities data={abilities} />
        <PokemonDetails data={details} />
      </section>

      <div className="container-spacing inset-shadow-lg scanlines space-y-6 bg-foreground/2 py-8">
        <Typography variant="h2" className="mx-auto w-fit">
          Evolutions
        </Typography>
        <EvolutionChain data={evolutionChain} />
      </div>

      <PokemonNav next={neighbors.next} prev={neighbors.prev} />
    </div>
  )
}

function PokemonInfo({ data }: { data: Info }) {
  const { flavorText, generation, genus, id, name, stats } = data

  return (
    <div className="space-y-4 3xl:col-start-2 3xl:col-end-3 3xl:row-start-1 3xl:row-end-2">
      <Typography aria-hidden="true" className="before:content-['#']">
        {id}
      </Typography>
      <span className="sr-only">
        {POKEDEX} {id}
      </span>
      <Typography variant="h1" className="capitalize">
        {hyphenToWhitespace(name)}
      </Typography>
      {/* //TODO: [GENUS_NAME, GENERATION] */}
      <div className="flex items-center gap-x-2 px-4 2xl:px-0">
        <Badge variant="ghost" className={`capitailize px-0`}>
          {genus}
        </Badge>
        <span aria-hidden="true" className="text-xs">
          &bull;
        </span>
        <Badge variant="ghost" className="px-0">
          {generation}
        </Badge>
      </div>
      {/* //TODO: [FLAVOR_TEXT]: [DESCRIPTION] */}
      <Typography
        variant="p"
        className="inline-flex px-4 before:mr-2.5 before:inline-block before:border-l-4 before:border-primary 2xl:px-0"
      >
        {flavorText}
      </Typography>
      {/* //TODO: POKEMON STATS: [BASE_STATS] */}
      <div className="space-y-2 px-4 2xl:px-0">
        <Typography variant="h6" render={<h2 />}>
          Base Stats
        </Typography>
        <dl className="grid grid-cols-[max-content_1fr_3rem] items-center gap-2">
          {stats.map(({ stat, base_stat }) => {
            const MAX_STAT = 180
            const WIDTH =
              Math.trunc(Math.min((base_stat / MAX_STAT) * 100, 100)) / 100
            const STAT_NAME = stat.name

            const STAT_LABEL =
              STAT_NAME === "special-attack"
                ? "spc. atk"
                : STAT_NAME === "special-defense"
                  ? "spc. def"
                  : STAT_NAME
            return (
              <React.Fragment key={stat.name}>
                <dt className="pr-4 text-xs capitalize first:uppercase">
                  <span aria-hidden="true">{STAT_LABEL}</span>
                  <span className="sr-only">{STAT_NAME}</span>
                </dt>
                <div className="flex h-2 bg-foreground/15 px-0.5 dark:bg-muted/50">
                  <span
                    style={{ "--w": WIDTH } as React.CSSProperties}
                    className="block h-full w-full shrink grow basis-auto origin-left scale-x-(--w) scale-y-50 animate-fill-up bg-primary"
                  />
                </div>
                <dd className="text-xs">{base_stat}</dd>
              </React.Fragment>
            )
          })}
        </dl>
      </div>
    </div>
  )
}

function PokemonArtwork({ data }: { data: Artwork }) {
  const {
    color,
    height,
    image,
    is_baby,
    is_legendary,
    is_mythical,
    name,
    shape,
    types,
    weight,
  } = data

  return (
    <div className="shrink grow basis-1/2 max-3xl:row-start-1 max-3xl:row-end-2">
      <Item variant="pokemon" color={color}>
        <ItemContent className="space-y-4 pb-4">
          <Image
            src={image}
            alt={name}
            layout="fixed"
            width={200}
            height={200}
            className="mx-auto size-80 object-contain"
          />
          <div
            className="flex justify-center gap-2"
            aria-label={`${POKEMON} Type`}
          >
            {types.map((type) => (
              <Badge
                key={type}
                variant="pokemon"
                color={type}
                className="capitalize"
              >
                <PokemonType className="size-6" type={type} />
                {type}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1 empty:hidden">
            {is_baby && <Badge>Baby</Badge>}
            {is_legendary && <Badge>Legendary</Badge>}
            {is_mythical && <Badge>Mythical</Badge>}
          </div>

          <dl className="grid grid-cols-3 justify-evenly divide-x">
            <div className="flex flex-col items-center gap-y-1 pl-3">
              <Typography variant="small" render={<dt />}>
                Height
              </Typography>
              <Typography
                variant="h6"
                render={<dd />}
                aria-label={`${height} meters`}
              >
                {height}m
              </Typography>
            </div>

            <div className="flex flex-col items-center gap-y-1 px-3">
              <Typography variant="small" render={<dt />}>
                Weight
              </Typography>
              <Typography
                variant="h6"
                render={<dd />}
                aria-label={`${weight} kilograms`}
              >
                {weight}kg
              </Typography>
            </div>

            <div className="flex flex-col items-center gap-y-1 pr-3">
              <Typography variant="small" render={<dt />}>
                Shape
              </Typography>
              <Typography variant="h6" render={<dd />} className="capitalize">
                {shape}
              </Typography>
            </div>
          </dl>
        </ItemContent>
      </Item>
    </div>
  )
}

function PokemonAbilities({ data }: { data: Abilities[] }) {
  return (
    <div className="shrink grow basis-1/2">
      <Item data-slot="pokemon-abilities">
        <ItemContent>
          <Typography variant="h6" render={<h2 />} className="mb-4 uppercase">
            Abilities
          </Typography>

          <div className="flex flex-col">
            {data.map(({ name, description, is_hidden }, i, arr) => (
              <React.Fragment key={name}>
                <div className="capitalize">
                  {name.replace(/-/, " ")}{" "}
                  {is_hidden && <Badge variant="outline">Hidden</Badge>}
                </div>
                <div className="text-muted-foreground">{description}</div>
                {i !== arr.length - 1 ? (
                  <Separator role="none" className="my-3" />
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </ItemContent>
      </Item>
    </div>
  )
}

function PokemonDetails({ data }: { data: Details }) {
  const { color, evolvesFrom, generation, genus, growthRate, habitat, shape } =
    data

  return (
    <div className="shrink grow basis-1/2">
      <Item variant="default">
        <ItemContent>
          <Typography variant="h6" render={<h2 />} className="mb-4 uppercase">
            Details
          </Typography>

          <dl className="details-card divide-y **:[dd]:grow **:[dd]:text-right **:[dd]:capitalize **:[dt]:w-24 **:[dt]:text-muted-foreground">
            <div className="flex items-center py-2.5">
              <dt>Color</dt>
              <dd>{color}</dd>
            </div>
            <div className="flex items-center py-2.5">
              <dt>Generation</dt>
              <dd
                aria-labelledby="generation"
                className="lowercase! first-letter:capitalize"
              >
                {hyphenToWhitespace(generation)}
                <span id="generation" className="sr-only">
                  {generation}
                </span>
              </dd>
            </div>
            <div className="flex items-center py-2.5">
              <dt>Category</dt>
              <dd>{genus}</dd>
            </div>
            <div className="flex items-center py-2.5">
              <dt>Shape</dt>
              <dd>{shape}</dd>
            </div>
            <div className="flex items-center py-2.5">
              <dt>Habitat</dt>
              <dd>
                {habitat || (
                  <div className={String.raw`after:content-["—"]`}>
                    <span className="sr-only">{"unknown"}</span>
                  </div>
                )}
              </dd>
            </div>
            <div className="flex items-center py-2.5">
              <dt>Growth Rate</dt>
              <dd>{hyphenToWhitespace(growthRate)}</dd>
            </div>
            <div className="flex items-center py-2.5">
              <dt>Evolved from</dt>
              <dd>
                {evolvesFrom || (
                  <div className={String.raw`after:content-["—"]`}>
                    <span className="sr-only">
                      {"none, because it's a base species"}
                    </span>
                  </div>
                )}
              </dd>
            </div>
          </dl>
        </ItemContent>
      </Item>
    </div>
  )
}
