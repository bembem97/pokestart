import {
  PokemonCard,
  PokemonCardGroup,
  PokemonCardMedia,
} from "@/components/common/pokemon-item"
import { PokemonType as Pokemon } from "@/components/common/pokemon-type"
import Typography from "@/components/common/typography"
import { Badge } from "@/components/ui/badge"
import { Item, ItemContent } from "@/components/ui/item"
import { POKEMON } from "@/const/pokemon"
import { Pokemon as PokemonAPI, type PokeAPI } from "@/lib/pokedex-api"
import { getPokemon } from "@/lib/pokemon-utils"
import { createTitle } from "@/lib/seo"
import type { PokemonType } from "@/types/pokedex-colors"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { HashIcon, SwordIcon, TimerResetIcon } from "lucide-react"

interface DamageRelationsProps {
  double_damage_from: PokemonType[]
  double_damage_to: PokemonType[]
  half_damage_from: PokemonType[]
  half_damage_to: PokemonType[]
  no_damage_from: PokemonType[]
  no_damage_to: PokemonType[]
}

interface PokemonList {
  id: number
  name: string
  image: string
}

interface PokemonTypeProps {
  name: PokemonType
  id: number
  generation: string
  move_damage_class: PokeAPI.NamedAPIResource | null
  damage_relations: DamageRelationsProps
  pokemon: PokemonList[]
}

const damageRelation = (data: PokeAPI.NamedAPIResource) =>
  data.name as PokemonType

const getType = createServerFn()
  .inputValidator((type: PokemonType) => type)
  .handler(async ({ data: name }) => {
    const type: PokemonTypeProps | null = await PokemonAPI.getTypeByName(name)
      .then((res) => {
        const {
          damage_relations,
          generation,
          id,
          move_damage_class,
          name,
          pokemon,
        } = res
        return {
          damage_relations: {
            double_damage_from:
              damage_relations.double_damage_from.map(damageRelation),
            double_damage_to:
              damage_relations.double_damage_to.map(damageRelation),
            half_damage_from:
              damage_relations.half_damage_from.map(damageRelation),
            half_damage_to: damage_relations.half_damage_to.map(damageRelation),
            no_damage_from: damage_relations.no_damage_from.map(damageRelation),
            no_damage_to: damage_relations.no_damage_to.map(damageRelation),
          },
          generation: generation.name.replace(/-/, " "),
          id,
          move_damage_class,
          name: name as PokemonType,
          pokemon: pokemon.map((p) => getPokemon(p.pokemon)),
        }
      })
      .catch((err) => {
        console.error('Error in "pokestart/src/routes/type.$id.tsx"', err)
        return null
      })

    if (!type) throw notFound()

    return type
  })

export const Route = createFileRoute("/type/$id")({
  component: RouteComponent,
  loader: ({ params }) => getType({ data: params.id as PokemonType }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: createTitle(
          `${loaderData !== undefined ? loaderData?.name.charAt(0).toUpperCase() + loaderData?.name.slice(1) : ""} Type ${POKEMON}`
        ),
      },
    ],
  }),
})

function RouteComponent() {
  const { damage_relations, generation, id, move_damage_class, name, pokemon } =
    Route.useLoaderData()

  return (
    <div className="container-spacing space-y-6 pt-2 pb-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex shrink grow basis-full items-center gap-2">
          <Typography variant="h1" className="capitalize">
            {name} Type
          </Typography>

          <Pokemon type={name} className="size-16" />
        </div>
        {move_damage_class ? (
          <Badge variant="outline">
            <SwordIcon className="size-3" />
            {move_damage_class.name}
          </Badge>
        ) : null}
        <Badge variant="outline">
          <TimerResetIcon className="size-3" />
          {generation}
        </Badge>
        <Badge variant="outline">
          <HashIcon className="size-3" />
          Type {id}
        </Badge>
      </div>

      {/* //todo: Damage Relations */}
      <section className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <Item variant="outline">
          <ItemContent className="gap-y-4">
            <Typography variant="h6" render={<span />} className="uppercase">
              Offense — Damage Dealt
            </Typography>
            <DamageRelation
              damage={damage_relations.double_damage_to}
              label="2×"
              title="Super Effective Against"
            />
            <DamageRelation
              damage={damage_relations.half_damage_to}
              label="½×"
              title="Not Very Effective Against"
            />
            <DamageRelation
              damage={damage_relations.no_damage_to}
              label="0×"
              title="No Effect Against"
            />
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemContent className="gap-y-4">
            <Typography variant="h6" render={<span />} className="uppercase">
              Defense — Damage Received
            </Typography>
            <DamageRelation
              damage={damage_relations.double_damage_from}
              label="2×"
              title="Weak To"
            />
            <DamageRelation
              damage={damage_relations.half_damage_from}
              label="½×"
              title="Weak To"
            />
            <DamageRelation
              damage={damage_relations.no_damage_from}
              label="0×"
              title="Immune To"
            />
          </ItemContent>
        </Item>
      </section>

      <section className="space-y-6">
        <Typography variant="h2">
          {POKEMON} With This Type ({pokemon.length})
        </Typography>
        <PokemonCardGroup>
          {pokemon.map(({ id, image, name }) => (
            <PokemonCard key={id} name={name}>
              <PokemonCardMedia id={id} image={image} name={name} />
            </PokemonCard>
          ))}
        </PokemonCardGroup>
      </section>
    </div>
  )
}

function DamageRelation({
  damage,
  label,
  title,
}: {
  damage: PokemonType[]
  label: string
  title: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
      <Badge
        variant="ghost"
        className="shrink-0 grow-0 basis-auto text-destructive"
      >
        {label}
      </Badge>
      <Typography variant="small" className="shrink grow basis-auto uppercase">
        {title}
      </Typography>
      <div className="flex shrink grow basis-full flex-wrap items-center gap-2">
        {damage.map((name) => (
          <Badge
            key={name}
            variant="pokemon"
            color={name}
            className="capitalize"
          >
            <Pokemon type={name} className="size-3.5" />
            {name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
