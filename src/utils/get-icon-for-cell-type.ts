import type { Cell } from "../types/cell"

export const getIconForCellType = (cell: Cell, isFoundTreasure: boolean = false) => {
  switch (cell.value) {
    case 'player':
      return '🐱'
    case 'monster':
      return '👾'
    case 'stone':
      return '🪨'
    case 'map':
      return '🗺️'
    case 'trunk':
      return cell.isTreasure && isFoundTreasure ? '🏆' : '📦'
    default:
      return ''
  }
}