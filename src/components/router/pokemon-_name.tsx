import { Link } from "@tanstack/react-router"
import { Button } from "../ui/button"
import { Image } from "@unpic/react"
import { Item, ItemContent, ItemTitle } from "../ui/item"
import { cn, hyphenToWhitespace } from "@/lib/utils"
import type {
  ChainWithImage,
  EvolutionChain,
} from "@/types/route-pokemon-_name"
import React from "react"
import Typography from "../common/typography"

type PokemonRef = {
  id: number
  name: string
  image: string | null
} | null

interface PokemonNavProps {
  prev: PokemonRef
  next: PokemonRef
}

export function PokemonNav({ prev, next }: PokemonNavProps) {
  return (
    <nav className="container-spacing mx-auto mt-6 flex justify-between gap-2 3xl:gap-4">
      {prev ? (
        <>
          <Button
            nativeButton={false}
            render={<Link to="/pokemon/$name" params={{ name: prev.name }} />}
            className="h-full shrink grow basis-full px-1.5 py-2.5 capitalize"
            variant="outline"
          >
            <div className="grid grid-cols-[max-content_1fr] items-center gap-x-0.5">
              <Typography
                variant="small"
                render={<span />}
                className="col-start-2 col-end-3 2xl:row-start-1 2xl:row-end-2"
              >
                #{prev.id}
              </Typography>
              <Typography
                variant="h6"
                render={<span />}
                className="col-span-full row-span-2 whitespace-break-spaces max-2xl:text-sm 2xl:col-start-2 2xl:col-end-3 2xl:row-start-2 2xl:row-end-3"
              >
                {hyphenToWhitespace(prev.name)}
              </Typography>
              <div className="col-start-1 col-end-2 row-start-1 row-end-2 grid place-items-center 2xl:row-start-1 2xl:row-end-3">
                <Image
                  alt={prev.name}
                  src={prev?.image || "/pokeball-monocolor.svg"}
                  layout="fixed"
                  height={44}
                  width={44}
                  className="size-11 object-contain"
                />
              </div>
            </div>
          </Button>
        </>
      ) : null}

      {next ? (
        <>
          <Button
            nativeButton={false}
            render={<Link to="/pokemon/$name" params={{ name: next.name }} />}
            className="h-full shrink grow basis-full px-1.5 py-2.5 capitalize"
            variant="outline"
          >
            <div className="grid grid-cols-[1fr_max-content] items-center gap-x-0.5">
              <Typography
                variant="small"
                render={<span />}
                className="col-start-1 col-end-2 text-end 2xl:row-start-1 2xl:row-end-2"
              >
                #{next.id}
              </Typography>
              <Typography
                variant="h6"
                render={<span />}
                className="col-span-full row-span-2 text-end whitespace-break-spaces max-2xl:text-sm 2xl:col-start-1 2xl:col-end-2 2xl:row-start-2 2xl:row-end-3"
              >
                {hyphenToWhitespace(next.name)}
              </Typography>
              <div className="col-start-2 col-end-3 row-start-1 row-end-2 grid place-items-center 2xl:row-start-1 2xl:row-end-3">
                <Image
                  alt={next.name}
                  src={next?.image || "/pokeball-monocolor.svg"}
                  layout="fixed"
                  height={44}
                  width={44}
                  className="size-11 object-contain"
                />
              </div>
            </div>
          </Button>
        </>
      ) : null}
    </nav>
  )
}

// todo: Evolution Chain
export function EvolutionChain({ data }: { data: EvolutionChain }) {
  return (
    <>
      <EvolutionStage
        data={data.chain}
        index={2}
        className="group/base mx-auto w-fit max-w-4xl"
        style={
          {
            "--chevron": `var(--chevron-right-img)`,
          } as React.CSSProperties
        }
      />
    </>
  )
}

function EvolutionStage({
  data,
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & { data: ChainWithImage; index: number }) {
  const { evolves_to, image, species } = data
  const evolutions = evolves_to.length
  const evolutionChain =
    evolutions > 3
      ? "multi"
      : evolutions > 2
        ? "tri"
        : evolutions > 1
          ? "split"
          : evolutions === 1
            ? "linear"
            : "none"

  return (
    <div
      {...props}
      data-next-chain={evolutionChain}
      className={cn(
        "flex flex-col flex-wrap justify-center gap-x-8 gap-y-6 3xl:flex-row",
        // todo: linear evolution chain
        "group-data-[evolution=2]/evolution:before:size-9 group-data-[evolution=2]/evolution:before:self-center group-data-[evolution=2]/evolution:before:bg-(image:--chevron) group-data-[evolution=2]/evolution:before:bg-center group-data-[evolution=2]/evolution:before:bg-no-repeat",
        "max-3xl:group-data-[evolution=2]/evolution:before:rotate-90",
        // todo: non-linear evolution chain
        "group-data-evolution/evolution:group-has-[>:nth-child(2)]/evolution:before:rotate-90",
        "group-data-[evolution=2]/evolution:group-has-[>[data-next-chain='split']]/evolution:before:rotate-90",
        //  todo: unique chain like Eevee.
        "group-data-[evolution=2]/evolution:group-has-[>:nth-child(4)]/evolution:before:hidden",
        { "group/chain": index === 3 },
        className
      )}
    >
      <EvolutionCard
        data-stage={index - 1}
        image={image}
        name={species}
        className={cn([
          // todo: linear evolution stage
          "3xl:group-data-[evolution=2]/evolution:group-not-has-[>:is([data-next-chain='none'],[data-next-chain='split'],[data-next-chain='tri'],[data-next-chain='multi'])]/evolution:group-has-[>[data-next-chain='linear']]/evolution:group-has-[>:only-child]/evolution:flex-1",
          "3xl:group-data-[evolution=2]/evolution:group-not-has-[>:is([data-next-chain='none'],[data-next-chain='split'],[data-next-chain='tri'],[data-next-chain='multi'])]/evolution:group-has-[>[data-next-chain='linear']]/evolution:group-has-[>:only-child]/evolution:basis-auto",
          "3xl:group-data-[evolution=2]/evolution:group-not-has-[>:is([data-next-chain='none'],[data-next-chain='split'],[data-next-chain='tri'],[data-next-chain='multi'])]/evolution:group-has-[>[data-next-chain='linear']]/evolution:group-has-[>:only-child]/evolution:before:grow",
        ])}
      />
      {evolutions > 0 && (
        <div
          data-evolution={index}
          className={cn([
            { "group/evolution": index === 2 },
            "flex items-start",
            "has-[[data-evolution='3']>:nth-child(2)]:basis-full has-[>:nth-child(2)]:basis-full",
            // todo: If the evolution chain is linear, then:
            "has-[>:only-child]:has-[[data-evolution='3']>:only-child]:grow",
            //  //: ----------------------------------------------------------------------------------------------------
            // todo: Kung labaw sa 3 ang anaswagan (pananglitan si Eevee).
            "has-[>:nth-child(4)]:flex-wrap has-[>:nth-child(4)]:*:shrink-0 has-[>:nth-child(4)]:*:grow has-[>:nth-child(4)]:*:basis-1/2 3xl:has-[>:nth-child(4)]:*:basis-1/4",
            // todo: Eevee evolution chevron
            "data-[evolution=2]:has-[>:nth-child(4)]:before:size-9 data-[evolution=2]:has-[>:nth-child(4)]:before:basis-full data-[evolution=2]:has-[>:nth-child(4)]:before:rotate-90 data-[evolution=2]:has-[>:nth-child(4)]:before:self-center data-[evolution=2]:has-[>:nth-child(4)]:before:bg-(image:--chevron) data-[evolution=2]:has-[>:nth-child(4)]:before:bg-center data-[evolution=2]:has-[>:nth-child(4)]:before:bg-no-repeat",
          ])}
        >
          {evolves_to.map((evolution, i) => (
            <EvolutionStage
              key={i}
              data={evolution}
              index={index + 1}
              className={cn([
                "flex-1",
                "group-data-[evolution=2]/evolution:group-has-[>:nth-child(2)]/evolution:flex-col",
                "group-data-[evolution=2]/evolution:group-has-[>:nth-child(2)]/evolution:flex-nowrap",
                "group-data-[evolution=2]/evolution:group-has-[[data-evolution='3']>:nth-child(2)]/evolution:flex-col",
                "group-data-[evolution=2]/evolution:group-has-[[data-evolution='3']>:nth-child(2)]/evolution:flex-nowrap",
              ])}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EvolutionCard({
  className,
  image,
  name,
  ...props
}: {
  image: string
  name: string
} & React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex flex-col justify-center 2xl:flex-row", className)}
    >
      <Item
        render={<Link to="/pokemon/$name" params={{ name }} />}
        className="w-fit"
      >
        <ItemContent className="flex flex-col items-center">
          <Image
            alt={name}
            src={image}
            layout="fixed"
            width={128}
            height={128}
            className={cn("size-32 object-contain")}
          />
          <ItemTitle className="capitalize max-lg:text-xs">{name}</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  )
}
