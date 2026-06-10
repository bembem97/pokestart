import {
  PokemonCard,
  PokemonCardGroup,
  PokemonCardMedia,
} from "@/components/common/pokemon-item"
import Typography from "@/components/common/typography"
import { Pokemon } from "@/lib/pokedex-api"
import { getPokemon } from "@/lib/pokemon-utils"
import { createTitle } from "@/lib/seo"
import { capitalFirstLetter } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const getVariant = createServerFn()
  .inputValidator((name: string) => name)
  .handler(async ({ data: name }) => {
    const pokemon = await Pokemon.getPokemonSpeciesByName(name)
    return {
      species: pokemon.name,
      pokemon: pokemon.varieties.map(({ pokemon }) => getPokemon(pokemon)),
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
  const { pokemon, species } = Route.useLoaderData()

  return (
    <div className="container-spacing py-6">
      <Typography variant="h1" className="capitalize">
        {species} Variants
      </Typography>

      <PokemonCardGroup>
        {pokemon.map(({ id, image, name }) => (
          <PokemonCard key={id} name={name}>
            <PokemonCardMedia id={id} image={image} name={name} />
          </PokemonCard>
        ))}
      </PokemonCardGroup>
    </div>
  )
}
