import type { Position } from "./position"

type BaseCell = {
  id: string
  position: Position
  icon: string
}

type PlayerCell = BaseCell & {
  value: 'player'
}

type MonsterCell = BaseCell & {
  value: 'monster'
}

type StoneCell = BaseCell & {
  value: 'stone'
}

type MapCell = BaseCell & {
  value: 'map'
  positionTrunk: Position
}

type TrunkCell = BaseCell & {
  value: 'trunk'
  isTrap: boolean
  isTreasure: boolean
}

type EmptyCell = BaseCell & {
  value: null
}

export type Cell = PlayerCell | MonsterCell | StoneCell | MapCell | TrunkCell | EmptyCell