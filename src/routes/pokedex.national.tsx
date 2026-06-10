import { BackToTop } from "@/components/common/back-to-top"
import { PokedexGeneration } from "@/components/common/pokemon-item"
import Typography from "@/components/common/typography"
import { PokemonSpeciesInfinite } from "@/components/router/pokedex-national"
import { POKEDEX, POKEMON } from "@/const/pokemon"
import { getGenerations } from "@/utils/home"
import { Pokemon } from "@/lib/pokedex-api"
import { createTitle } from "@/lib/seo"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const getPokedex = createServerFn().handler(async () => {
  const _generationsList = getGenerations()
  const _species = Pokemon.getPokemonSpeciesList()

  const [generations, species] = await Promise.all([_generationsList, _species])

  return {
    entries: species.count,
    generations,
  }
})

export const Route = createFileRoute("/pokedex/national")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: createTitle(`National ${POKEDEX}`) }],
  }),
  loader: () => getPokedex(),
})

function RouteComponent() {
  const { entries, generations } = Route.useLoaderData()

  return (
    <div className="container-spacing space-y-8 py-6">
      <div className="flex flex-wrap items-center gap-x-2">
        <Typography variant="h1" className="shrink grow basis-full">
          National {POKEDEX}
        </Typography>

        <Typography>{entries} Entries</Typography>
        <span aria-hidden="true">&bull;</span>
        <Typography>{generations.count} Generations</Typography>
      </div>

      <div className="flex flex-col gap-y-4">
        <Typography variant="h2">Generations</Typography>
        <PokedexGeneration data={generations.data} />
      </div>

      <div className="space-y-4">
        <Typography variant="h2">{POKEMON}</Typography>
        <PokemonSpeciesInfinite />
      </div>

      <BackToTop />
    </div>
  )
}
