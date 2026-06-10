import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { mergeProps, useRender } from "@base-ui/react"
import React from "react"

export const typography = cva(undefined, {
  variants: {
    variant: {
      span: "text-sm leading-none font-light text-foreground",
      p: "text-sm leading-5 font-light text-foreground",
      small: "text-xs leading-none font-light text-foreground",
      h1: "scroll-m-20 font-heading text-[clamp(var(--text-2xl),4vw,var(--text-4xl))] font-extrabold tracking-tight text-balance text-heading",
      h2: "scroll-m-20 font-heading text-2xl font-semibold tracking-tight text-heading",
      h3: "scroll-m-20 font-heading text-xl font-semibold tracking-tight text-heading",
      h4: "scroll-m-20 font-heading text-lg font-medium tracking-wide text-heading",
      h5: "scroll-m-20 font-heading text-base font-normal tracking-wide text-heading",
      h6: "scroll-m-20 font-heading text-sm font-normal text-heading",
      none: undefined,
    },
  },
  defaultVariants: {
    variant: "span",
  },
})

type TypographyProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof typography>

export default function Typography({
  render,
  variant = "span",
  ...props
}: TypographyProps) {
  const _render = render as
    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
    | undefined

  const slot = `typography-${_render?.type || variant}`

  const _variant: typeof variant =
    variant === undefined ||
    variant === "none" ||
    variant === null ||
    typeof variant === undefined
      ? "span"
      : variant

  const element = useRender({
    defaultTagName: _variant || "span",
    props: mergeProps<"span">(
      { className: cn(typography({ variant })) },
      props
    ),
    render,
    state: {
      slot,
      variant,
    },
  })

  return element
}
