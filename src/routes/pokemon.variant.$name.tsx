import {
  PokemonCard,
  PokemonCardGroup,
  PokemonCardMedia,
} from "@/components/common/pokemon-item"
import Typography from "@/components/common/typography"
import { Badge } from "@/components/ui/badge"
import { Pokemon } from "@/lib/pokedex-api"
import { getPokemon } from "@/lib/pokemon-utils"
import { createTitle } from "@/lib/seo"
import { capitalFirstLetter, hyphenToWhitespace } from "@/lib/utils"
import type { PokemonType } from "@/types/pokedex-colors"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const getVariant = createServerFn()
  .validator((name: string) => name)
  .handler(async ({ data: name }) => {
    try {
      const species = await Pokemon.getPokemonSpeciesByName(name)
      const default_variant = species.varieties.find(
        ({ is_default }) => is_default === true
      )!

      const pokemon = await Promise.all([
        Pokemon.getPokemonByName(default_variant.pokemon.name),
        Pokemon.getGenerationByName(species.generation.name),
        species.varieties.map(async ({ pokemon }) => {
          const result = await Pokemon.getPokemonByName(pokemon.name)
          return result.types.map(({ type }) => type.name)
        }),
      ])

      const _variants = await Promise.all(pokemon[2])
      const sets = _variants.map((types) => new Set(types))
      const variants = sets.reduce((acc, curr) => acc.intersection(curr))

      const info = {
        category: species.genera.filter(
          ({ language }) => language.name === "en"
        )[0].genus,
        generation: hyphenToWhitespace(species.generation.name),
        types: pokemon[0].types.map(({ type }) => type.name as PokemonType),
        ability: pokemon[0].abilities
          .map(({ ability }) => ability.name)
          .join(", "),
        region: pokemon[1].main_region.name,
      }

      return {
        species: species.name,
        pokemon: species.varieties.map(({ pokemon }) => getPokemon(pokemon)),
        flavor_text: species.flavor_text_entries.filter(
          ({ language }) => language.name === "en"
        )[0].flavor_text,
        info,
        variants,
      }
    } catch (err) {
      console.error(`Error in "src/routes/pokemon.variant.$name.tsx"`, err)
      throw Error("An error has occured.")
    }
  })

export const Route = createFileRoute("/pokemon/variant/$name")({
  component: RouteComponent,
  loader: ({ params }) => getVariant({ data: params.name }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: createTitle(capitalFirstLetter(loaderData?.species)),
      },
    ],
  }),
})

function RouteComponent() {
  const { pokemon, species, flavor_text, info, variants } =
    Route.useLoaderData()

  const gen_1st_word = info && info.generation.split(" ")[0]
  const _generation =
    gen_1st_word && gen_1st_word.charAt(0).toUpperCase() + gen_1st_word.slice(1)
  const _roman = info && info.generation.split(" ")[1].toUpperCase()
  const GENERATION = _generation + " " + _roman

  return (
    <div className="container-spacing space-y-12 py-6">
      <div>
        <div className="flex items-center gap-2.5">
          <Typography variant="h1" className="capitalize">
            {species} Variants
          </Typography>
          <Badge>{pokemon.length} forms</Badge>
        </div>
        <Typography variant="p" className="max-w-2xl">
          {flavor_text}
        </Typography>
      </div>

      <PokemonCardGroup>
        {pokemon.map(({ id, image, name }) => (
          <PokemonCard key={id} name={name}>
            <PokemonCardMedia id={id} image={image} name={name} />
          </PokemonCard>
        ))}
      </PokemonCardGroup>

      <div className="space-y-4 border border-border bg-muted/5 p-4">
        <Typography className="block font-bold uppercase">
          Shared across all forms
        </Typography>

        <dl className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="flex flex-col gap-1">
            <Typography render={<dt />} variant="small">
              Category
            </Typography>
            <Typography render={<dd />} variant="h6">
              {info.category}
            </Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography render={<dt />} variant="small">
              Generation
            </Typography>
            <Typography render={<dd />} variant="h6">
              <span className="after:mx-1 after:inline-block after:content-['•']">
                {GENERATION}
              </span>
              <span className="capitalize">{info.region}</span>
            </Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography render={<dt />} variant="small">
              Shared Type
            </Typography>
            <div className="flex flex-wrap gap-1">
              {[...variants].map((type) => (
                <Typography key={type} render={<dd />} variant="h6">
                  <Badge variant="outline">{type}</Badge>
                </Typography>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Typography render={<dt />} variant="small">
              Ability
            </Typography>
            <Typography render={<dd />} variant="h6" className="capitalize">
              {info.ability}
            </Typography>
          </div>
        </dl>
      </div>
    </div>
  )
}
