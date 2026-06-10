import { POKESTART } from "@/const/pokemon"

const APP_NAME = POKESTART

export function createTitle(title?: string) {
  return title ? `${title} | ${APP_NAME}` : APP_NAME
}
