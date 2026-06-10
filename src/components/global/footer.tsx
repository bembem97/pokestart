import { POKESTART } from "@/const/pokemon"
export default function Footer() {
  return (
    <footer className="container-spacing min-h-16 border-t bg-background/75 py-4 text-sm text-muted-foreground backdrop-blur-xs">
      <div className="flex flex-col items-center gap-y-2">
        <p>
          <small suppressHydrationWarning>
            {" "}
            &copy; {new Date().getFullYear()} {POKESTART}
          </small>
        </p>
        <p>
          <small>
            Powered by{" "}
            <a
              target="_blank"
              href="https://pokeapi.co/"
              className="contents text-primary"
            >
              PokéAPI
            </a>
          </small>
        </p>
      </div>
    </footer>
  )
}
