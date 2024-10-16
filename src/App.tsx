import { useEffect, useState } from "react"
import type { Board } from "./types/board"
import type { Position } from "./types/position"
import { getStyleForCellType } from "./utils/get-style-for-cell-type"
import { getIconForCellType } from "./utils/get-icon-for-cell-type"

export const App = () => {
  const [board, setBoard] = useState<Board>([])
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [isFoundTreasure, setIsFoundTreasure] = useState(false)

  const constructorBoard = () => {
    const board: Board = Array.from({ length: 8 }, (_, indexX) => {
      return Array.from({ length: 8 }, (_, indexY) => ({ 
        id: `c${indexX}-${indexY}`, 
        value: null, 
        position: { x: indexX, y: indexY },
      }))
    })

    board[0][0].value = 'player'

    allocateTrunkExtremityRandomly(board)
    allocateTrunkExtremityRandomly(board, true)
    allocateTrunkExtremityRandomly(board, false, true)

    allocateMapRandomly(board)

    allocateMonsterRandomly(board)
    allocateMonsterRandomly(board)
    allocateMonsterRandomly(board)

    allocateStoneRandomly(board)
    allocateStoneRandomly(board)
    allocateStoneRandomly(board)
    allocateStoneRandomly(board)
    allocateStoneRandomly(board)
    allocateStoneRandomly(board)
    allocateStoneRandomly(board)
    allocateStoneRandomly(board)
    allocateStoneRandomly(board)
    allocateStoneRandomly(board)

    return board
  }

  const startBoard = () => {
    const newBoard = constructorBoard()
    setBoard(newBoard)
  }

  const resetBoard = () => {
    startBoard()
    setPlayerPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    startBoard()
  }, [])

  const cloneBoard = () => board.map(line => line.map(cell => cell))

  const isValidPosition = ({ x, y }: Position) => x >= 0 && x < 8 && y >= 0 && y < 8

  const verifyPositionMove = ({ x, y }: Position) => {
    if (!isValidPosition({ x, y })) return false

    const isMoveLeft = x === playerPosition.x && y === playerPosition.y - 1 && board[x][y].value !== "stone"
    const isMoveRight = x === playerPosition.x && y === playerPosition.y + 1 && board[x][y].value !== "stone"
    const isMoveUp = x === playerPosition.x - 1 && y === playerPosition.y && board[x][y].value !== "stone"
    const isMoveDown = x === playerPosition.x + 1 && y === playerPosition.y && board[x][y].value !== "stone"

    return isMoveUp || isMoveDown || isMoveLeft || isMoveRight
  }

  const move = ({ x, y }: Position) => {
    if (!verifyPositionMove({ x, y })) return

    const block = board[x][y]

    if (block.value === 'map') {
      if (!block.positionTrunk) return
      
      setIsFoundTreasure(true)
      setBoard((oldBoard) => {
        if (isValidPosition(block.positionTrunk)) {
          oldBoard[block.positionTrunk.x][block.positionTrunk.y].value = 'trunk'
          return oldBoard
        }

        return oldBoard
      })
    }

    if (block.value === 'trunk') {
      if (block.isTreasure) {
        alert('You found the treasure!🎉')
        resetBoard()
        return
      }

      if (block.isTrap) {
        setIsFoundTreasure(false)
        alert('Game over!😣')
        resetBoard()
        return
      }

      alert('You found a trunk!📦')
    }

    setBoard(() => {
      const newBoard = cloneBoard()
      newBoard[playerPosition.x][playerPosition.y] = {
        ...newBoard[playerPosition.x][playerPosition.y],
        value: null,
      }
      newBoard[x][y] = {
        ...newBoard[x][y],
        value: 'player',
      }
      setPlayerPosition({ x, y })
      return newBoard
    })
  }

  const allocateMapRandomly = (board: Board) => {
    const x = Math.floor(Math.random() * 7)
    const y = Math.floor(Math.random() * 7)
  
    const positionMap = board[x][y].value  
  
    if (positionMap) {
      return allocateMapRandomly(board)
    }
    
    board[x][y] = {
      ...board[x][y],
      value: 'map',
      positionTrunk: board.flatMap(line => line.filter(cell => cell.value === 'trunk' && cell.isTreasure).map(cell => cell.position))[0],
    }
  }

  const allocateMonsterRandomly = (board: Board) => {
    const x = Math.floor(Math.random() * 7)
    const y = Math.floor(Math.random() * 7)
    
    if (x < 2 && y < 2) {
      return allocateMonsterRandomly(board)
    } 
  
    const positionMonster = board[x][y].value  
  
    if (positionMonster) {
      return allocateMonsterRandomly(board)
    }

    board[x][y] = {
      ...board[x][y],
      value: 'monster',
    } 
  }

  const allocateStoneRandomly = (board: Board) => {
    const x = Math.floor(Math.random() * 7)
    const y = Math.floor(Math.random() * 7)
    
    if (x < 2 && y < 2 ) {
      return allocateStoneRandomly(board)
    }
  
    const positionStone = board[x][y].value  
  
    if (positionStone) {
      return allocateStoneRandomly(board)
    }
    
    board[x][y] = {
      ...board[x][y],
      value: 'stone',
    }
  }

  const allocateTrunkExtremityRandomly = (board: Board, isTreasure: boolean = false, isTrap: boolean = false) => {
    const random = Math.floor(Math.random() * 2);
    const randomPosition = Math.floor(Math.random() * 8);

    const { x, y } = random === 1 
      ? { x: 7, y: randomPosition } 
      : { x: randomPosition, y: 7 };

    const upValue = x > 0 
      ? board[x - 1][y].value 
      : null;
    const downValue = x < 7 
      ? board[x + 1][y].value 
      : null;
    const leftValue = y > 0 
      ? board[x][y - 1].value 
      : null;
    const rightValue = y < 7 
      ? board[x][y + 1].value 
      : null;

    if (upValue || downValue || leftValue || rightValue) {
      return allocateTrunkExtremityRandomly(board);
    }
    
    if (board[x][y].value) {
      return allocateTrunkExtremityRandomly(board);
    }

    board[x][y] = {
      id: `c${x}-${y}`,
      position: { x, y },
      isTreasure,
      value: 'trunk',
      isTrap,
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-8">
        {board.map(line => 
          line.map(cell => (
            <button 
              key={cell.id} 
              className={getStyleForCellType(cell)} 
              onClick={() => {
                if (cell.value === 'monster') {
                  resetBoard()
                  alert('Game over!😣')
                } else {
                  move(cell.position)
                }
              }}
            >
              {getIconForCellType(cell, isFoundTreasure)}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
              
