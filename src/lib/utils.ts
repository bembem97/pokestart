import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalFirstLetter(name: string | undefined) {
  if (name === undefined) return ""

  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function hyphenToWhitespace(str: string | undefined | null) {
  if (!str) return ""

  return str.replace(/-/g, " ")
}
