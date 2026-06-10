import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-none border-0 bg-transparent px-0 py-0 text-[0.625rem] font-semibold tracking-widest whitespace-nowrap uppercase transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-0 has-data-[icon=inline-start]:pl-0 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none",
    "not-dark:[a]:hover:scale-102 not-dark:[a]:hover:shadow not-dark:hover:[a]:shadow-foreground/50",
    "px-2 py-0.5 has-[svg]:py-0.5 has-[svg]:pl-0.5",
  ],
  {
    variants: {
      variant: {
        // default: "text-foreground [a]:hover:text-foreground/70",
        default: [
          "bg-primary text-primary-foreground transition-all not-dark:[a]:hover:bg-primary/80",
          "dark:border dark:border-primary/25 dark:bg-primary-foreground/15 dark:text-primary/75",
          "dark:hover:[a]:hover:border-primary/75 dark:hover:[a]:hover:text-primary",
        ],
        secondary: "text-muted-foreground [a]:hover:text-foreground",
        destructive:
          "text-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:text-destructive/70",
        outline: "border text-foreground [a]:hover:text-foreground/70",
        ghost: "[a]:text-muted-foreground [a]:hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        pokemon: [
          "border border-(--item-color)/50 text-foreground transition-all not-dark:[a]:hover:bg-(--item-color)/80",
          "bg-(--item-color)/15",
          "dark:border-(--item-color)/25 dark:bg-(--item-color)/5 dark:text-foreground/75",
          "dark:hover:[a]:hover:border-(--item-color)/50 dark:hover:[a]:hover:text-foreground",
        ],
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
    },
  }
)

function Badge({
  className,
  variant = "default",
  color,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, color }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
