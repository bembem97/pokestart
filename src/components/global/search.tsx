import React from "react"
import { Button } from "../ui/button"
import { SearchIcon } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { sortByInput } from "@/lib/pokemon-utils"
import { useDebounce } from "@/lib/hook"
import type { PokemonItem } from "@/types/pokemon-query"
import { POKEMON } from "@/const/pokemon"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { createServerFn } from "@tanstack/react-start"
import Typography from "../common/typography"

type SearchQuery = UseQueryResult<NoInfer<PokemonItem[]>, Error>

const query = `
query pokeAPIQuery($name: String) {
  pokemon: pokemon(
    where: { name: { _iregex: $name }}
    order_by: { id: asc }
    limit: 20
  ) {
    name
    id
  }
}
`

type QueryResult = { data: { pokemon: Omit<PokemonItem, "image">[] } }

const getPokemonQuery = createServerFn({ method: "GET" })
  .inputValidator((name: string) => name)
  .handler(async ({ data: name }) => {
    {
      const res = await fetch("https://graphql.pokeapi.co/v1beta2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          query,
          variables: { name },
          operationName: "pokeAPIQuery",
        }),
      })
      const response: QueryResult = await res.json()

      const queryWithImage: PokemonItem[] = response.data.pokemon.map(
        (value) => ({
          ...value,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value.id}.png`,
        })
      )
      const pokemon_result = sortByInput(queryWithImage, name)

      return pokemon_result
    }
  })

function SearchButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="icon" {...props}>
      <SearchIcon className="size-4" />
    </Button>
  )
}

const CloseOnClickContext = React.createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {})

export default function Search(props: React.ComponentProps<typeof Button>) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <SearchButton onClick={() => setOpen(true)} {...props} />

      <CloseOnClickContext value={setOpen}>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <SearchContent />
        </CommandDialog>
      </CloseOnClickContext>
    </>
  )
}

function SearchContent() {
  const [input, setInput] = React.useState("")
  const result = useQuery({
    queryKey: ["search", `${input}`],
    queryFn: () => getPokemonQuery({ data: input }),
    enabled: input.length > 0,
  })

  return (
    <Command shouldFilter={false}>
      <TextField setQueryInput={setInput} />
      <CommandList>
        <QueryResult query={input} result={result} />
      </CommandList>
    </Command>
  )
}

function TextField({
  setQueryInput,
}: {
  setQueryInput: React.Dispatch<React.SetStateAction<string>>
}) {
  const [input, setInput] = React.useState("")
  const searchQuery = useDebounce(input)

  React.useEffect(() => {
    setQueryInput(searchQuery)
  }, [searchQuery, setQueryInput])
  return <CommandInput value={input} onValueChange={setInput} />
}

function QueryResult({
  query,
  result,
}: {
  query: string
  result: SearchQuery
}) {
  const setIsOpen = React.use(CloseOnClickContext)
  const router = useRouter()
  const { data, isError, isLoading, error } = result

  if (isLoading)
    return (
      <CommandGroup heading="Searching...">
        {Array.from({ length: 6 }, (_, i) => (
          <CommandItem key={i} className="h-14 px-4 *:[svg]:hidden">
            <Avatar className="animate-pulse bg-muted" />
            <div className="h-4 w-20 animate-pulse bg-muted" />
            <span className="ml-auto h-4 w-10 animate-pulse bg-muted"></span>
          </CommandItem>
        ))}
      </CommandGroup>
    )

  if (isError)
    return (
      <CommandEmpty>
        <Typography variant="small">
          {error?.message || "An error has occured."}
        </Typography>
      </CommandEmpty>
    )

  if (data === undefined)
    return (
      <CommandEmpty>
        <Typography variant="p" className="text-muted-foreground">
          Try to search a {POKEMON}.
        </Typography>
      </CommandEmpty>
    )

  if (data.length === 0)
    return (
      <CommandEmpty>
        <Typography variant="p">
          No pokemon matched your search for &quot;
          <span
            data-nostyle
            className="text-semibold text-wrap break-all text-primary"
          >
            {query}
          </span>
          &quot; . Try different names or refine your search.
        </Typography>
      </CommandEmpty>
    )

  return (
    <CommandGroup heading={`${data.length} results`}>
      {data.map(({ id, image, name }) => (
        <CommandItem
          key={name}
          value={`pokemon-${name}`}
          onSelect={() => {
            router.navigate({
              to: "/pokemon/$name",
              params: { name },
            })
            setIsOpen(false)
          }}
          className="*:[svg]:hidden"
        >
          <Avatar size="lg">
            <AvatarImage alt={name} src={image} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="typograhy-p capitalize">{name}</div>
          <span
            data-nostyle
            className="ml-auto text-muted-foreground"
            aria-label={`pokedex ${id}`}
          >
            #{id}
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
