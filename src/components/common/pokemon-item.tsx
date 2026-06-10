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
      className={cn("shrink grow basis-full 3xl:basis-1/3", className)}
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
      <Avatar size="lg">
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
      <ChevronsRightIcon className="size-4 text-(--contrast-color) group-hover/item:animate-this-way" />
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
      render={<Link to="/pokemon/$name" params={{ name }} />}
      variant="default"
      className="isolote @container/iconic relative before:absolute before:inset-0 before:-z-10 before:bg-[url('/pokeball-monocolor.svg')] before:bg-size-[60%] before:bg-position-[100%_50%] before:bg-no-repeat before:opacity-5"
    >
      <ItemContent>
        <ItemTitle className="text-foreground">
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
        src={image}
        layout="fixed"
        width={200}
        height={200}
        className="ml-auto h-fit w-42 object-contain"
      />
    </>
  )
}

// todo: Pokemon Type Badges
export function TypeBadges({ types }: { types: PokemonType[] }) {
  return (
    <div className="flex gap-2">
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
      render={<Link to="/type/$id" params={{ id: type }} />}
      key={type}
      variant="default"
      className="shrink grow basis-1/4 3xl:basis-1/5 5xl:basis-1/7"
    >
      <ItemContent className="items-center">
        <Pokemon type={type} className="size-16" />
        <ItemDescription className="capitalize">{type}</ItemDescription>
      </ItemContent>
    </Item>
  )
}
