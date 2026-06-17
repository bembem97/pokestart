import { TypeCard } from "@/components/common/pokemon-item"
import Typography from "@/components/common/typography"
import { POKEMON } from "@/const/pokemon"
import { Pokemon } from "@/lib/pokedex-api"
import { createTitle } from "@/lib/seo"
import type { Types } from "@/types/route-types"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const getPokemonTypes = createServerFn().handler(async () => {
  const types: Types[] = await Pokemon.getTypesList({ limit: 18 })
    .then((res) => {
      const data = res.results.map(async ({ name }) => {
        const type = await Pokemon.getTypeByName(name)
        const total = type.pokemon.length
        const weakness = type.damage_relations.double_damage_from.map(
          ({ name }) => name
        )
        return { name, total, weakness } as Types
      })
      return Promise.all(data)
    })
    .catch((err) => {
      console.error('Error in "pokestart/src/routes/types.tsx"', err)
      return [] as Types[]
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
      <div className="flex flex-wrap gap-1">
        <Typography variant="h1" className="basis-full">
          {POKEMON} Types
        </Typography>
        <Typography
          variant="p"
          className="after:ml-1 after:inline-block after:content-['•']"
        >
          {types.length} Types
        </Typography>
        <Typography variant="p">Weaknesses shown per card.</Typography>
      </div>
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-3 5xl:grid-cols-4 6xl:grid-cols-6">
        {types.map((type) => (
          <TypeCard key={type.name} type={type} />
        ))}
      </div>
    </div>
  )
}
