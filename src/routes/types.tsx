import { TypeItem, TypeItemGroup } from "@/components/common/pokemon-item"
import Typography from "@/components/common/typography"
import { POKEMON } from "@/const/pokemon"
import { Pokemon } from "@/lib/pokedex-api"
import { createTitle } from "@/lib/seo"
import type { PokemonType } from "@/types/pokedex-colors"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const getPokemonTypes = createServerFn().handler(async () => {
  const types: PokemonType[] = await Pokemon.getTypesList({ limit: 18 })
    .then((res) => res.results.map(({ name }) => name as PokemonType))
    .catch((err) => {
      console.error('Error in "pokestart/src/routes/types.tsx"', err)
      return [] as PokemonType[]
    })
  return types
})

export const Route = createFileRoute("/types")({
  component: RouteComponent,
  loader: () => getPokemonTypes(),
  head: () => ({
    meta: [{ title: createTitle(`${POKEMON} Types`) }],
  }),
})

function RouteComponent() {
  const types = Route.useLoaderData()
  return (
    <div className="container-spacing space-y-6 pt-2 pb-6">
      <Typography variant="h1">
        {POKEMON} Types ({types.length})
      </Typography>
      <TypeItemGroup>
        {types.map((type) => (
          <TypeItem key={type} type={type} />
        ))}
      </TypeItemGroup>
    </div>
  )
}
