import type { PokemonType } from "@/types/pokedex-colors"
import BugIcon from "../pokemon/bug"
import DarkIcon from "../pokemon/dark"
import DragonIcon from "../pokemon/dragon"
import ElectricIcon from "../pokemon/electric"
import FairyIcon from "../pokemon/fairy"
import FightingIcon from "../pokemon/fighting"
import FireIcon from "../pokemon/fire"
import FlyingIcon from "../pokemon/flying"
import GhostIcon from "../pokemon/ghost"
import GrassIcon from "../pokemon/grass"
import GroundIcon from "../pokemon/ground"
import IceIcon from "../pokemon/ice"
import NormalIcon from "../pokemon/normal"
import PoisonIcon from "../pokemon/poison"
import PsychicIcon from "../pokemon/psychic"
import RockIcon from "../pokemon/rock"
import SteelIcon from "../pokemon/steel"
import WaterIcon from "../pokemon/water"
import { cn } from "@/lib/utils"

interface Props extends React.ComponentProps<"svg"> {
  type: PokemonType
}

export function PokemonType({ className, type, ...props }: Props) {
  switch (type) {
    case "bug":
      return <BugIcon {...props} className={cn("text-type-bug", className)} />
    case "dark":
      return <DarkIcon {...props} className={cn("text-type-dark", className)} />
    case "dragon":
      return (
        <DragonIcon {...props} className={cn("text-type-dragon", className)} />
      )
    case "electric":
      return (
        <ElectricIcon
          {...props}
          className={cn("text-type-electric", className)}
        />
      )
    case "fairy":
      return (
        <FairyIcon {...props} className={cn("text-type-fairy", className)} />
      )
    case "fighting":
      return (
        <FightingIcon
          {...props}
          className={cn("text-type-fighting", className)}
        />
      )
    case "fire":
      return <FireIcon {...props} className={cn("text-type-fire", className)} />
    case "flying":
      return (
        <FlyingIcon {...props} className={cn("text-type-flying", className)} />
      )
    case "ghost":
      return (
        <GhostIcon {...props} className={cn("text-type-ghost", className)} />
      )
    case "grass":
      return (
        <GrassIcon {...props} className={cn("text-type-grass", className)} />
      )
    case "ground":
      return (
        <GroundIcon {...props} className={cn("text-type-ground", className)} />
      )
    case "ice":
      return <IceIcon {...props} className={cn("text-type-ice", className)} />
    case "normal":
      return (
        <NormalIcon {...props} className={cn("text-type-normal", className)} />
      )
    case "poison":
      return (
        <PoisonIcon {...props} className={cn("text-type-poison", className)} />
      )
    case "psychic":
      return (
        <PsychicIcon
          {...props}
          className={cn("text-type-psychic", className)}
        />
      )
    case "rock":
      return <RockIcon {...props} className={cn("text-type-rock", className)} />
    case "steel":
      return (
        <SteelIcon {...props} className={cn("text-type-steel", className)} />
      )
    case "water":
      return (
        <WaterIcon {...props} className={cn("text-type-water", className)} />
      )
    default:
      return null
  }
}
