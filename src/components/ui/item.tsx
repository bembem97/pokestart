import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { typography } from "../common/typography"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-2", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-none border text-sm transition-colors duration-75 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-foreground/15 dark:[a]:hover:bg-muted/50",
  {
    variants: {
      variant: {
        none: undefined,
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
        pokemon: [
          "border-(--contrast-color)/10 bg-(--item-color)/15",
          "dark:bg-(--item-color)/5",
          "[a]:hover:bg-(--item-color)/9 not-dark:[a]:hover:border-(--contrast-color)/35",
        ],
      },
      size: {
        default: "gap-3.5 px-4 py-3.5",
        sm: "gap-2.5 px-3.5 py-3",
        xs: "gap-2 px-3 py-2.5 in-data-[slot=dropdown-menu-content]:p-0",
      },
      color: {
        // todo: POKEMON TYPES
        fire: "[--contrast-color:var(--pokemon-fire-contrast)] [--item-color:var(--pokemon-fire)]",
        water:
          "[--contrast-color:var(--pokemon-water-contrast)] [--item-color:var(--pokemon-water)]",
        grass:
          "[--contrast-color:var(--pokemon-grass-contrast)] [--item-color:var(--pokemon-grass)]",
        electric:
          "[--contrast-color:var(--pokemon-electric-contrast)] [--item-color:var(--pokemon-electric)]",
        ice: "[--contrast-color:var(--pokemon-ice-contrast)] [--item-color:var(--pokemon-ice)]",
        fighting:
          "[--contrast-color:var(--pokemon-fighting-contrast)] [--item-color:var(--pokemon-fighting)]",
        poison:
          "[--contrast-color:var(--pokemon-poison-contrast)] [--item-color:var(--pokemon-poison)]",
        ground:
          "[--contrast-color:var(--pokemon-ground-contrast)] [--item-color:var(--pokemon-ground)]",
        flying:
          "[--contrast-color:var(--pokemon-flying-contrast)] [--item-color:var(--pokemon-flying)]",
        psychic:
          "[--contrast-color:var(--pokemon-psychic-contrast)] [--item-color:var(--pokemon-psychic)]",
        bug: "[--contrast-color:var(--pokemon-bug-contrast)] [--item-color:var(--pokemon-bug)]",
        rock: "[--contrast-color:var(--pokemon-rock-contrast)] [--item-color:var(--pokemon-rock)]",
        ghost:
          "[--contrast-color:var(--pokemon-ghost-contrast)] [--item-color:var(--pokemon-ghost)]",
        dragon:
          "[--contrast-color:var(--pokemon-dragon-contrast)] [--item-color:var(--pokemon-dragon)]",
        dark: "[--contrast-color:var(--pokemon-dark-contrast)] [--item-color:var(--pokemon-dark)]",
        steel:
          "[--contrast-color:var(--pokemon-steel-contrast)] [--item-color:var(--pokemon-steel)]",
        fairy:
          "[--contrast-color:var(--pokemon-fairy-contrast)] [--item-color:var(--pokemon-fairy)]",
        normal:
          "[--contrast-color:var(--pokemon-normal-contrast)] [--item-color:var(--pokemon-normal)]",
        // todo: POKEMON COLORS
        black:
          "[--contrast-color:var(--pokemon-black-contrast)] [--item-color:var(--pokemon-black)]",
        blue: "[--contrast-color:var(--pokemon-blue-contrast)] [--item-color:var(--pokemon-blue)]",
        brown:
          "[--contrast-color:var(--pokemon-brown-contrast)] [--item-color:var(--pokemon-brown)]",
        gray: "[--contrast-color:var(--pokemon-gray-contrast)] [--item-color:var(--pokemon-gray)]",
        green:
          "[--contrast-color:var(--pokemon-green-contrast)] [--item-color:var(--pokemon-green)]",
        pink: "[--contrast-color:var(--pokemon-pink-contrast)] [--item-color:var(--pokemon-pink)]",
        purple:
          "[--contrast-color:var(--pokemon-purple-contrast)] [--item-color:var(--pokemon-purple)]",
        red: "[--contrast-color:var(--pokemon-red-contrast)] [--item-color:var(--pokemon-red)]",
        white:
          "[--contrast-color:var(--pokemon-white-contrast)] [--item-color:var(--pokemon-white)]",
        yellow:
          "[--contrast-color:var(--pokemon-yellow-contrast)] [--item-color:var(--pokemon-yellow)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  color,
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size, className, color })),
      },
      props
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-none group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 group-data-[size=xs]/item:rounded-none [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0.5 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        typography({ variant: "h6" }),
        "line-clamp-1 flex w-fit items-center gap-2 font-semibold text-heading capitalize underline-offset-4 group-data-[variant=pokemon]/item:text-(--item-color) dark:font-semibold dark:group-data-[variant=pokemon]/item:text-(--contrast-color)",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        typography({ variant: "p" }),
        "line-clamp-2 text-left text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
