import { Pokemon } from "@/lib/pokedex-api"
import { getPokemon } from "@/lib/pokemon-utils"
import type { PokemonItem } from "@/types/pokemon-query"
import { createServerFn } from "@tanstack/react-start"
import { useInfiniteQuery } from "@tanstack/react-query"
import PokeBallIcon from "../common/pokeball-icon"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertOctagonIcon } from "lucide-react"
import React from "react"
import { Button } from "../ui/button"
import {
  PokemonCard,
  PokemonCardGroup,
  PokemonCardMedia,
} from "../common/pokemon-item"
import { useInView } from "react-intersection-observer"

const LIMIT = 50

interface PokemonPagination {
  results: PokemonItem[]
  count: number
  next: null | string
  previous: null | string
}

const getNationalPokedex = createServerFn()
  .validator((pageParam: number) => pageParam)
  .handler(async ({ data: pageParam }) => {
    const pokemon: PokemonPagination = await Pokemon.getPokemonSpeciesList({
      limit: LIMIT,
      offset: pageParam,
    })
      .then(({ results, ...rest }) => {
        const pokemon = results.map(getPokemon)
        return { ...rest, results: pokemon }
      })
      .catch((err) => {
        console.error(
          'Error in "pokestart/src/components/router/pokedex-national.tsx"',
          err
        )
        return { count: 0, next: null, previous: null, results: [] }
      })
    return pokemon
  })

const pokemonQueryFn = async ({ pageParam }: { pageParam: number }) =>
  await getNationalPokedex({ data: pageParam })

export function PokemonSpeciesInfinite() {
  const { ref, inView } = useInView({ threshold: 1 })
  const {
    data,
    status,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["pokedex"],
    queryFn: pokemonQueryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // lastPage.next is null when there are no more pages
      if (!lastPage.next) return undefined

      // Calculate next offset from total items fetched so far
      const nextOffset = allPages.length * LIMIT
      return nextOffset
    },
  })

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="flex flex-col gap-y-8">
      <>
        {status === "pending" ? (
          <div className="grid place-items-center">
            <PokeBallIcon className="size-12 animate-spin text-primary" />
          </div>
        ) : status === "error" ? (
          <Alert variant="destructive">
            <AlertOctagonIcon className="size-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>An error has occured.</AlertDescription>
          </Alert>
        ) : (
          <PokemonCardGroup>
            {data.pages.map(({ results }, i) => (
              <React.Fragment key={i}>
                {results.map(({ id, image, name }) => (
                  <PokemonCard key={id} name={name}>
                    <PokemonCardMedia id={id} image={image} name={name} />
                  </PokemonCard>
                ))}
              </React.Fragment>
            ))}
          </PokemonCardGroup>
        )}
      </>

      {!isLoading && (
        <Button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="mx-auto flex items-center"
        >
          {isFetchingNextPage ? (
            <>
              Loading{" "}
              <PokeBallIcon className="size-5 animate-spin text-muted dark:text-primary" />
            </>
          ) : hasNextPage ? (
            "Load More"
          ) : (
            "Nothing more to load"
          )}
        </Button>
      )}
    </div>
  )
}
