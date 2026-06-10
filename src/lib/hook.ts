import React from "react"

export function useDebounce(value: string) {
  const [debounce, setDebounce] = React.useState("")

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(value)
    }, 250)

    return () => {
      clearTimeout(timer)
    }
  }, [value, setDebounce])

  return debounce
}
