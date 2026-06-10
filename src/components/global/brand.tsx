import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import React from "react"

export default function Brand({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-block w-fit font-heading text-lg font-bold text-heading focus:outline-0 focus:outline-none xl:text-2xl",
        className
      )}
      {...props}
    >
      Pok
      <span className="text-[size:inherit] font-[weight:inherit] text-primary">
        é
      </span>
      Start
    </Link>
  )
}
