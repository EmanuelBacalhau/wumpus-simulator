import { useEffect, useState } from "react"
import type { Board } from "./types/board"
import type { Position } from "./types/position"
import { getStyleForCellType } from "./utils/get-style-for-cell-type"

export const App = () => {
  const [board, setBoard] = useState<Board>([])
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [monsterPositions, setMonsterPositions] = useState<Position[]>([])

  const constructorBoard = () => {
    const board: Board = Array.from({ length: 8 }, (_, indexX) => {
      return Array.from({ length: 8 }, (_, indexY) => ({ 
        id: `c${indexX}-${indexY}`, 
        value: null, 
        position: { x: indexX, y: indexY },
        icon: ''
      }))
    })

    board[0][0] = {
      icon: '🐱',
      id: 'c0-0',
      value: 'player',
      position: playerPosition
    }

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
    const initialMonsterPosition = newBoard.flatMap(line => 
      line.filter(cell => cell.value === 'monster').map(cell => cell.position)
    )
    setBoard(newBoard)
    setMonsterPositions(initialMonsterPosition)
  }

  const resetBoard = () => {
    startBoard()
    setPlayerPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    startBoard()
  }, [])

  // TODO - Segunda parte do desafio
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     moveMonster()
  //   }, 1000)
  //   return () => clearInterval(interval)
  // }, [monsterPositions])

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
      setBoard((oldBoard) => {
        oldBoard[block.positionTrunk.x][block.positionTrunk.y].icon = '🪙'
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
        alert('Game over!😣')
        resetBoard()
        return
      }
    }

    setBoard(() => {
      const newBoard = cloneBoard()
      newBoard[playerPosition.x][playerPosition.y] = {
        ...newBoard[playerPosition.x][playerPosition.y],
        value: null,
        icon: ''
      }
      newBoard[x][y] = {
        ...newBoard[x][y],
        value: 'player',
        icon: '🐱'
      }
      setPlayerPosition({ x, y })
      return newBoard
    })
  }
  
  // const moveMonster = () => {
  //   let isCollisionPlayer = false
  //   let newMonsterPositions = []
  
  //   const newBoard = cloneBoard()
    
  //   newMonsterPositions = monsterPositions.map(position => {
  //     const random = Math.floor(Math.random() * 4)
  //     const { x, y } = position
      
  //     const positionUp = isValidPosition({ x: x - 1, y }) ? newBoard[x - 1][y] : null
  //     const positionDown = isValidPosition({ x: x + 1, y }) ? newBoard[x + 1][y] : null
  //     const positionLeft = isValidPosition({ x, y: y - 1 }) ? newBoard[x][y - 1] : null
  //     const positionRight = isValidPosition({ x, y: y + 1 }) ? newBoard[x][y + 1] : null
  
  //     const isMoveUp = positionUp && (positionUp.value === 'player' || positionUp.value === null)
  //     const isMoveDown = positionDown && (positionDown.value === 'player' || positionDown.value === null)
  //     const isMoveLeft = positionLeft && (positionLeft.value === 'player' || positionLeft.value === null)
  //     const isMoveRight = positionRight && (positionRight.value === 'player' || positionRight.value === null)
  
  //     if ((isMoveUp && positionUp?.value === 'player') || 
  //         (isMoveDown && positionDown?.value === 'player') ||
  //         (isMoveLeft && positionLeft?.value === 'player') || 
  //         (isMoveRight && positionRight?.value === 'player')) {
  //       isCollisionPlayer = true
  //       return { x, y }
  //     }
  
  //     if (isMoveUp && random === 0) {
  //       newBoard[x][y].value = null
  //       newBoard[x - 1][y].value = 'monster'
  //       return { x: x - 1, y }
  //     } else if (isMoveDown && random === 1) {
  //       newBoard[x][y].value = null
  //       newBoard[x + 1][y].value = 'monster'
  //       return { x: x + 1, y }
  //     } else if (isMoveLeft && random === 2) {
  //       newBoard[x][y].value = null
  //       newBoard[x][y - 1].value = 'monster'
  //       return { x, y: y - 1 }
  //     } else if (isMoveRight && random === 3) {
  //       newBoard[x][y].value = null
  //       newBoard[x][y + 1].value = 'monster'
  //       return { x, y: y + 1 }
  //     }
      
  //     return position
  //   })
  
   
  //   setBoard(newBoard)
  //   setMonsterPositions(newMonsterPositions)
  
  //   if (isCollisionPlayer) {
  //     startBoard()
  //     setPlayerPosition({ x: 0, y: 0 })
  //     alert('Game over!😣')
  //   }
  // }

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
      icon: '🗺️'
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
      icon: '👾'
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
      icon: '🪨'
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
      icon: '📦'
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
              {cell.icon}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
