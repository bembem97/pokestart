import { cn } from "@/lib/utils"
import React from "react"

export default function PokemonTypeIcon({
  children,
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      data-slot="pokemon-type"
      className={cn("size-[1.75em] select-none", className)}
      {...props}
    >
      {children}
    </svg>
  )
}
