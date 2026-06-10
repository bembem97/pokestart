import { BackToTop } from "@/components/common/back-to-top"
import {
  PokemonCard,
  PokemonCardGroup,
  PokemonCardMedia,
} from "@/components/common/pokemon-item"
import Typography from "@/components/common/typography"
import { POKEMON } from "@/const/pokemon"
import { Pokemon } from "@/lib/pokedex-api"
import { getPokemon } from "@/lib/pokemon-utils"
import { createTitle } from "@/lib/seo"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const getPokedex = createServerFn()
  .inputValidator((generation: string) => generation)
  .handler(async ({ data: id }) => {
    return await Pokemon.getGenerationByName(id)
      .then((res) => {
        const { main_region, names, pokemon_species } = res
        const pokemon = pokemon_species
          .map(getPokemon)
          .sort((a, b) => a.id - b.id)
        const generation = names.filter((res) => res.language.name === "en")[0]
          .name
        return {
          region: main_region.name,
          pokemon,
          generation,
        }
      })
      .catch((err) => {
        console.error(
          'Error in "pokestart/src/routes/pokedex.$generation.tsx"',
          err
        )
        return {
          region: "",
          pokemon: [],
          generation: "",
        }
      })
  })

export const Route = createFileRoute("/pokedex/$generation")({
  component: RouteComponent,
  loader: ({ params }) => getPokedex({ data: params.generation }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: createTitle(
          `${loaderData?.generation} | Region ${loaderData?.region} | All ${loaderData?.pokemon.length} ${POKEMON}`
        ),
      },
    ],
  }),
})

function RouteComponent() {
  const { generation, pokemon, region } = Route.useLoaderData()
  return (
    <div className="container-spacing space-y-8 py-6">
      <div className="flex flex-col gap-x-2 gap-y-2.5">
        <Typography variant="h1">{generation}</Typography>
        <Typography className="capitalize">Main Region — {region}</Typography>
      </div>

      <div className="space-y-4">
        <Typography variant="h2">{POKEMON}</Typography>
        <PokemonCardGroup>
          {pokemon.map(({ id, image, name }) => (
            <PokemonCard key={id} name={name}>
              <PokemonCardMedia id={id} image={image} name={name} />
            </PokemonCard>
          ))}
        </PokemonCardGroup>
      </div>

      <BackToTop />
    </div>
  )
}
