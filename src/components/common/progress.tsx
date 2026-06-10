import { cn } from "@/lib/utils"
import { useRouterState } from "@tanstack/react-router"
import React from "react"

export function ProgressBar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const state = useRouterState()
  const mainRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!mainRef.current) {
      mainRef.current = document.querySelector("main")
    }

    const main = mainRef.current
    if (!main) return

    if (state.isLoading) {
      main.setAttribute("aria-busy", "true")
      main.setAttribute("aria-describedby", "router-state")
    } else {
      main.removeAttribute("aria-busy")
      main.removeAttribute("aria-describedby")
    }
  }, [state.isLoading])

  return state.isLoading ? (
    <div
      role="progress"
      id="router-state"
      aria-label="Content loading..."
      className={cn("animate-progress", className)}
      {...props}
    />
  ) : null
}
