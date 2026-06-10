import { cva } from "class-variance-authority"
import Brand from "./brand"
import { ModeToggle } from "./theme/mode-toggle"
import { Link } from "@tanstack/react-router"
import { POKEDEX } from "@/const/pokemon"
import { cn } from "@/lib/utils"
import Search from "./search"
import { typography } from "../common/typography"

const action = cva([
  typography({ variant: "small" }),
  "px-1 py-1.5 font-semibold text-foreground hover:not-data-[status=active]:text-heading",
])
const active = cva("text-primary")

export default function Header() {
  return (
    <header className="container-spacing sticky top-0 z-100 flex items-center border-b bg-background/75 backdrop-blur-xs">
      <Brand className="mr-auto" />

      <Link
        className={cn(action())}
        activeProps={{ className: active() }}
        to="/"
      >
        Home
      </Link>
      <Link
        className={cn(action())}
        activeProps={{ className: active() }}
        to="/pokedex/national"
      >
        {POKEDEX}
      </Link>
      <Link
        className={cn(action())}
        activeProps={{ className: active() }}
        to="/types"
      >
        Types
      </Link>

      <Search className={cn(action())} />
      <ModeToggle className={cn(action())} />
    </header>
  )
}
