import { cn, hyphenToWhitespace } from "@/lib/utils"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../ui/item"
import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ChevronsRightIcon } from "lucide-react"
import type { Generation } from "@/types/route-home"
import { Image } from "@unpic/react"
import type { PokemonType } from "@/types/pokedex-colors"
import { Badge } from "../ui/badge"
import { PokemonType as Pokemon } from "./pokemon-type"
import React from "react"
import { CardContent, Card, CardAction, CardHeader } from "../ui/card"
import type { Types } from "@/types/route-types"
import Typography from "./typography"
import { POKEMON } from "@/const/pokemon"

// todo: Pokedex Generation Items
export function GenerationItemGroup({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ItemGroup>) {
  return (
    <ItemGroup
      {...props}
      className={cn("gap-0! 3xl:flex-row 3xl:flex-wrap", className)}
    >
      {children}
    </ItemGroup>
  )
}

export function GenerationItem({
  children,
  className,
  id,
  ...props
}: React.ComponentProps<typeof Item> & { id: string }) {
  return (
    <Item
      {...props}
      corner="br"
      className={cn(["shrink grow basis-full 3xl:basis-1/3"], className)}
      render={<Link to="/pokedex/$generation" params={{ generation: id }} />}
    >
      {children}
    </Item>
  )
}

export function GenerationItemMedia({
  image,
  name,
  id,
  ...props
}: React.ComponentProps<typeof ItemMedia> & { image: string; name: string }) {
  return (
    <ItemMedia {...props}>
      <Avatar
        size="lg"
        className="group-hover/item:after:border-foreground/25 dark:group-hover/item:after:border-primary/25"
      >
        <AvatarImage src={image} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
    </ItemMedia>
  )
}

export function GenerationItemContent({
  name,
  id,
  ...props
}: React.ComponentProps<typeof ItemContent> & { name: string }) {
  return (
    <ItemContent {...props}>
      <ItemDescription>{name}</ItemDescription>
    </ItemContent>
  )
}

export function GenerationItemActions({
  id,
  ...props
}: React.ComponentProps<typeof ItemActions>) {
  return (
    <ItemActions {...props}>
      <ChevronsRightIcon className="size-4 text-(--contrast-color) group-hover/item:animate-this-way group-hover/item:text-primary" />
    </ItemActions>
  )
}

export function PokedexGeneration({ data }: { data: Generation[] }) {
  return (
    <GenerationItemGroup>
      {data.map(({ id, image, name }) => (
        <GenerationItem key={id} id={id}>
          <GenerationItemMedia image={image} name={name} />
          <GenerationItemContent name={name} />
          <GenerationItemActions />
        </GenerationItem>
      ))}
    </GenerationItemGroup>
  )
}

// todo: Pokemon Card Items
export function PokemonCardGroup({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "grid grid-cols-3 gap-x-2 gap-y-8 2xl:grid-cols-4 3xl:gap-x-4 5xl:grid-cols-5",
        className
      )}
    >
      {children}
    </div>
  )
}

export function PokemonCard({
  name,
  children,
  ...props
}: React.ComponentProps<typeof Item> & { name: string }) {
  return (
    <Item
      {...props}
      corner="dia"
      render={<Link to="/pokemon/$name" params={{ name }} />}
      variant="default"
      className="isolote @container/iconic relative before:absolute before:inset-0 before:-z-10 before:bg-[url('/pokeball-monocolor.svg')] before:bg-size-[60%] before:bg-position-[100%_50%] before:bg-no-repeat before:opacity-5"
    >
      <ItemContent>
        <ItemTitle className="w-fit whitespace-break-spaces text-foreground">
          {hyphenToWhitespace(name)}
        </ItemTitle>
        {children}
      </ItemContent>
    </Item>
  )
}

export function PokemonCardMedia({
  id,
  image,
  name,
}: {
  id: number
  image: string
  name: string
}) {
  const [src, setSrc] = React.useState(image)
  return (
    <>
      <span
        className="absolute bottom-2 left-2 -z-10 font-extrabold tracking-tighter text-muted-foreground/18 dark:text-muted-foreground/5"
        style={{
          fontSize: "clamp(2.5rem, 32cqi, 5rem)",
          lineHeight: "0.75",
        }}
      >
        {id}
      </span>
      <Image
        alt={name}
        src={src}
        layout="constrained"
        width={200}
        height={200}
        className="ml-auto size-auto flex-1 object-contain text-[8px] break-all whitespace-break-spaces text-transparent"
        onError={() =>
          setSrc(
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`
          )
        }
      />
    </>
  )
}

// todo: Pokemon Type Badges
export function TypeBadges({ types }: { types: PokemonType[] }) {
  return (
    <div className="flex items-center @sm/iconic:gap-2">
      {types.map((type) => (
        <Badge key={type} variant="secondary">
          <Pokemon type={type} className="text-[0.875em]" />
          {type}
        </Badge>
      ))}
    </div>
  )
}

export function TypeItemGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("item-gap flex flex-wrap justify-center", className)}
    >
      {children}
    </div>
  )
}

export function TypeItem({
  children,
  className,
  type,
  ...props
}: React.ComponentProps<typeof Item> & { type: PokemonType }) {
  return (
    <Item
      {...props}
      corner="dia"
      render={<Link to="/type/$id" params={{ id: type }} />}
      key={type}
      className="shrink grow basis-1/4 3xl:basis-1/5 5xl:basis-1/7"
    >
      <ItemContent className="items-center">
        <Pokemon type={type} className="size-16" />
        <ItemDescription className="capitalize">{type}</ItemDescription>
      </ItemContent>
    </Item>
  )
}

export function TypeCard({
  children,
  className,
  type,
  ...props
}: React.ComponentProps<typeof Card> & { type: Types }) {
  return (
    <Card
      {...props}
      className={cn(
        "shrink grow basis-1/4 3xl:basis-1/5 5xl:basis-1/7",
        className
      )}
      render={<Link to="/type/$id" params={{ id: type.name }} />}
    >
      <CardHeader>
        <Pokemon type={type.name} className="size-11" />
        <CardAction className="flex h-full items-center p-2.5 pr-1">
          <ChevronsRightIcon className="size-4 -translate-y-1/2 group-hover/card:animate-this-way group-hover/card:text-primary" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex grow flex-col gap-y-1.5 p-2.5 capitalize">
        <Typography variant="span">{type.name}</Typography>
        <Typography
          variant="small"
          render={<span />}
          className="text-muted-foreground"
        >
          {type.total} {POKEMON}
        </Typography>

        <div className="flex h-full flex-wrap content-end items-end gap-0.5">
          {type.weakness.map((agay) => (
            <Badge key={agay} variant="pokemon" color={agay as PokemonType}>
              {agay}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
