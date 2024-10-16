import type { Cell } from "../types/cell"

export const getStyleForCellType = (cell: Cell) => {
  switch (cell.value) {
    case 'player':
      return 'w-12 h-12 text-2xl border border-gray-500 bg-yellow-400'
    case 'monster':
      return 'w-12 h-12 text-2xl border border-gray-500 bg-purple-400'
    case 'stone':
      return 'w-12 h-12 text-2xl border border-gray-500 bg-gray-400'
    case 'map':
      return 'w-12 h-12 text-2xl border border-gray-500 bg-green-400'
    case 'trunk':
      return 'w-12 h-12 text-2xl border border-gray-500 bg-blue-400'
    default:
      return 'w-12 h-12 text-2xl border border-gray-500 bg-slate-200'
  }
}