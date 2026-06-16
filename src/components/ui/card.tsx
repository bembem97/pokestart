import * as React from "react"

import { cn } from "@/lib/utils"
import { mergeProps, useRender } from "@base-ui/react"

function Card({
  className,
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          [
            "group/card flex flex-col overflow-hidden text-sm text-card-foreground has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-none *:[img:last-child]:rounded-none",
            "border transition-all duration-75 not-dark:border-border hover:scale-105 not-dark:hover:border-foreground/25 not-dark:hover:shadow-sm not-dark:hover:shadow-foreground/50",
            "dark:hover:border-primary/25 dark:hover:bg-primary/2",
          ],
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "card",
      size,
    },
  })
  // return (
  //   <Link
  //     data-slot="card"
  //     data-size={size}
  //     className={cn(
  //       [
  //         "group/card flex flex-col overflow-hidden text-sm text-card-foreground has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-none *:[img:last-child]:rounded-none",
  //         "border transition-all not-dark:border-border hover:scale-105 not-dark:hover:border-foreground/25 not-dark:hover:shadow-sm not-dark:hover:shadow-foreground/50",
  //         "dark:hover:border-primary/50 dark:hover:bg-primary/2",
  //       ],
  //       className
  //     )}
  //     {...props}
  //   />
  // )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-none px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-lg font-semibold tracking-wider uppercase",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
