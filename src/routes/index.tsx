import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { POKEDEX, POKEMON } from "@/const/pokemon"
import {
  getGenerations,
  getIconicPokemon,
  getRandomPokemon,
} from "@/utils/home"
import { Pokemon as PokemonAPI } from "@/lib/pokedex-api"
import { createTitle } from "@/lib/seo"
import { type PokemonType } from "@/types/pokedex-colors"
import type {
  Generation,
  PokemonIconic,
  WhosThatPokemon,
} from "@/types/route-home"
import { createFileRoute, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { ChevronsRightIcon } from "lucide-react"
import { Image } from "@unpic/react"
import Typography from "@/components/common/typography"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { PokemonType as Pokemon } from "@/components/common/pokemon-type"
import {
  PokedexGeneration,
  PokemonCard,
  PokemonCardMedia,
  TypeBadges,
  TypeItem,
  TypeItemGroup,
} from "@/components/common/pokemon-item"

const home = createServerFn().handler(async () => {
  const _species = PokemonAPI.getPokemonSpeciesList()
  const _types = PokemonAPI.getTypesList({ limit: 18 })
  const _generations = getGenerations()
  const _iconic = getIconicPokemon()
  const _random = getRandomPokemon()

  const [species, types, generations, iconic, random] = await Promise.all([
    _species,
    _types,
    _generations,
    _iconic,
    _random,
  ])

  const stats = {
    total_pokemon: species.count,
    total_generation: generations.count,
    total_types: types.results.length,
  }

  return {
    whosThatPokemon: random,
    iconic,
    generation: generations.data,
    types: types.results.map((type) => type.name as PokemonType),
    stats,
  }
})

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [{ title: createTitle("Homepage") }],
  }),
  loader: () => home(),
})

function App() {
  const { generation, iconic, stats, types, whosThatPokemon } =
    Route.useLoaderData()
  const { total_generation, total_pokemon } = stats

  return (
    <>
      <HeroSection
        data={whosThatPokemon}
        stats={{ total_generation, total_pokemon }}
      />
      <PokedexStats stats={stats} />
      <div className="container-spacing space-y-10 py-8">
        <PokemonTypes data={types} />
        <IconicPokemon data={iconic} />
        <Generations data={generation} />
      </div>
    </>
  )
}

// todo: Hero Section | Random Pokemon
function HeroSection({
  data,
  stats,
}: {
  data: WhosThatPokemon
  stats: { total_pokemon: number; total_generation: number }
}) {
  const { color, image, name, types } = data

  return (
    <section className="container-spacing relative grid grid-cols-1 pt-6 4xl:grid-cols-2">
      {/* //todo: Left Column */}
      <div className="flex flex-col gap-4">
        <Badge>National {POKEDEX}</Badge>
        <Typography variant="h1">
          CATCH{" "}
          <span className="text-[size:inherit] text-primary">
            {"'EM"} ALL
            <span className="text-[size:inherit] text-foreground">.</span>
          </span>
        </Typography>

        <Typography variant="p" className="space-y-1 *:block">
          <span>
            Browse all {stats.total_pokemon} {POKEMON} across{" "}
            {stats.total_generation} generations.
          </span>
          <span>Explore stats, abilities, evolutions, and more.</span>
        </Typography>

        <div className="flex items-center gap-2 xl:gap-4">
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link to="/pokedex/national" />}
            className="min-w-0 max-xl:shrink max-xl:grow max-xl:basis-auto"
          >
            Browse {POKEDEX}
          </Button>

          <Button
            nativeButton={false}
            render={<Link to="/pokemon/$name" params={{ name }} />}
            className="min-w-0 max-xl:shrink max-xl:grow max-xl:basis-auto"
          >
            Random {POKEMON}
            <ChevronsRightIcon className="group-hover/button:animate-this-way" />
          </Button>
        </div>
      </div>

      {/* //todo: Right Column */}
      <div
        className="relative grid place-items-center py-4 *:[grid-area:a]"
        style={{ gridTemplate: "'a' 1fr / 1fr" }}
      >
        <div className="relative isolate -z-10 grid size-full overflow-x-clip perspective-midrange transform-3d before:absolute before:inset-0 before:translate-y-10 before:translate-z-100 before:rotate-x-60 before:bg-[url('/pokeball-monocolor.svg')] before:bg-size-[25%] before:bg-center before:bg-no-repeat before:opacity-10" />
        <figure className="flex flex-col items-center gap-y-1">
          <Image
            alt={name}
            src={image}
            layout="fixed"
            width={200}
            height={200}
            className="animate-float"
          />
          <Typography
            variant="h5"
            render={<figcaption />}
            className="capitalize"
          >
            {name}
          </Typography>
        </figure>

        <Item
          size="sm"
          className="absolute right-1 bottom-1 size-fit"
          variant="pokemon"
          color={color}
        >
          <ItemContent className="flex-col-reverse">
            <ItemDescription>Color</ItemDescription>
            <ItemTitle className="capitalize">{color}</ItemTitle>
          </ItemContent>
        </Item>

        <div
          aria-label={`${POKEMON} types`}
          className="absolute top-1 left-1 flex flex-col gap-2.5"
        >
          {types.map((type) => (
            <Badge key={type} variant="pokemon" color={type}>
              <Pokemon type={type} />
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}

// todo: Pokemon overalls
function PokedexStats({
  stats,
}: {
  stats: {
    total_generation: number
    total_pokemon: number
    total_types: number
  }
}) {
  const { total_generation, total_pokemon, total_types } = stats
  return (
    <section className="container-spacing mt-16 grid h-24 grid-cols-3 divide-x border-y backdrop-blur-xs">
      <Item variant="none" className="border-y-0 border-l-0 last:border-r-0">
        <ItemContent className="items-center">
          <ItemTitle>{total_pokemon}</ItemTitle>
          <ItemDescription>Total {POKEMON}</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="none" className="border-y-0 border-l-0 last:border-r-0">
        <ItemContent className="items-center">
          <ItemTitle>{total_types}</ItemTitle>
          <ItemDescription>Types</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="none" className="border-y-0 border-l-0 last:border-r-0">
        <ItemContent className="items-center">
          <ItemTitle>{total_generation}</ItemTitle>
          <ItemDescription>Generations</ItemDescription>
        </ItemContent>
      </Item>
    </section>
  )
}

// todo: Pokemon Types
function PokemonTypes({ data }: { data: PokemonType[] }) {
  return (
    <section className="space-y-4">
      <Typography variant="h2">Browse by type</Typography>
      <TypeItemGroup>
        {data.map((type) => (
          <TypeItem key={type} type={type} />
        ))}
      </TypeItemGroup>
    </section>
  )
}

// todo: Pokemon
function IconicPokemon({ data }: { data: PokemonIconic[] }) {
  return (
    <section className="space-y-4">
      <Typography variant="h2">Iconic {POKEMON}</Typography>

      <div className="item-gap grid grid-cols-2 2xl:grid-cols-4">
        {data.map(({ id, image, name, types }) => (
          <PokemonCard key={id} name={name}>
            <TypeBadges types={types} />
            <PokemonCardMedia id={id} image={image} name={name} />
          </PokemonCard>
        ))}
      </div>
    </section>
  )
}

// todo: Pokemon Generation
function Generations({ data }: { data: Generation[] }) {
  return (
    <section className="space-y-4">
      <Typography variant="h2">Generations</Typography>
      <PokedexGeneration data={data} />
    </section>
  )
}

/*
<div className="my-8">
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="grid size-fit place-items-center border border-red-400/10 bg-red-400/30 p-4 font-bold text-red-900/80 uppercase dark:border-red-400/20 dark:bg-red-400/5 dark:text-red-400/80">
              red
            </div>
            <div className="grid size-fit place-items-center border border-yellow-400/10 bg-yellow-300/30 p-4 font-bold text-yellow-900/80 uppercase dark:border-yellow-500/20 dark:bg-yellow-400/5 dark:text-yellow-500/80">
              yellow
            </div>
            <div className="grid size-fit place-items-center border border-green-400/10 bg-green-300/30 p-4 font-bold text-green-900/80 uppercase dark:border-green-600/20 dark:bg-green-400/5 dark:text-green-500/80">
              green
            </div>
            <div className="grid size-fit place-items-center border border-blue-400/10 bg-blue-500/30 p-4 font-bold text-blue-900/80 uppercase dark:border-blue-600/20 dark:bg-blue-400/5 dark:text-blue-400/80">
              blue
            </div>
            <div className="grid size-fit place-items-center border border-purple-500/10 bg-purple-500/30 p-4 font-bold text-purple-900/80 uppercase dark:border-purple-500/20 dark:bg-purple-500/5 dark:text-purple-400/80">
              purple
            </div>
            <div className="grid size-fit place-items-center border border-amber-400/10 bg-amber-500/30 p-4 font-bold text-amber-900/80 uppercase dark:border-amber-600/20 dark:bg-amber-500/5 dark:text-amber-500/80">
              brown
            </div>
            <div className="grid size-fit place-items-center border border-pink-500/10 bg-pink-400/30 p-4 font-bold text-pink-900/80 uppercase dark:border-pink-300/20 dark:bg-pink-400/5 dark:text-pink-400/80">
              pink
            </div>
            <div className="grid size-fit place-items-center border border-stone-600/10 bg-stone-200/30 p-4 font-bold text-stone-700/80 uppercase dark:border-stone-500/20 dark:bg-stone-200/5 dark:text-stone-200/80">
              white
            </div>
            <div className="grid size-fit place-items-center border border-gray-600/10 bg-gray-400/30 p-4 font-bold text-gray-800/80 uppercase dark:border-gray-500/20 dark:bg-gray-400/5 dark:text-gray-300/80">
              gray
            </div>
            <div className="grid size-fit place-items-center border border-zinc-600/10 bg-zinc-500/30 p-4 font-bold text-zinc-900/80 uppercase dark:border-zinc-500/20 dark:bg-zinc-600/5 dark:text-zinc-400/80">
              black
            </div>
          </div>
        </div>
*/
