import { ArrowUpIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      className="fixed right-4 bottom-20 z-50 animate-bounce backdrop-blur-xs"
      aria-label="Back to top"
      size="icon-lg"
    >
      <ArrowUpIcon />
    </Button>
  )
}
