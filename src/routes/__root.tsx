import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import appCss from "../styles.css?url"
import Header from "@/components/global/header"
import { ThemeProvider } from "@/components/global/theme/theme-provider"
import Footer from "@/components/global/footer"
import { POKESTART } from "@/const/pokemon"
import { ProgressBar } from "@/components/common/progress"
import Typography from "@/components/common/typography"

const queryClient = new QueryClient()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: POKESTART,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container-spacing container mx-auto pt-16">
      <Typography variant="h1">404</Typography>
      <Typography variant="p">
        The requested page could not be found.
      </Typography>
    </main>
  ),
  errorComponent: ({ error, info }) => (
    <main className="container-spacing pt-16">
      <Typography variant="h1">{error.name}</Typography>
      <Typography variant="p">
        {error.message || "An error has occured"}
      </Typography>
      <Typography variant="small">{error.stack}</Typography>
      <Typography variant="small">{info?.componentStack}</Typography>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <QueryClientProvider client={queryClient}>
            <Header />
            <main>{children}</main>
            <Footer />
            <ProgressBar />
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
            <Scripts />
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-left"
            />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
