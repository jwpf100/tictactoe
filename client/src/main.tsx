import React, { ChangeEvent, FormEvent, useState } from 'react'
import { range } from 'lodash'
import { XorO } from './types'

export const Main = () => {
  const createNewBoardArray = (boardSize: number) =>
    Array.from({ length: boardSize }, () => {
      return Array.from({ length: boardSize }, () => undefined)
    })
  const [board, setBoard] = useState<(XorO | undefined)[][]>(
    createNewBoardArray(3)
  )
  const [currentPlayer, setPlayer] = useState<XorO>('X')
  const [winner, setWinner] = useState<XorO | null>(null)
  const [gameSize, setGameSize] = useState<number>(3)
  const players: XorO[] = ['X', 'O']

  // Winning options
  const checkGroup = (group: (XorO | undefined)[], player: XorO) => {
    return group.every((value) => value === player)
  }

  const checkWinningOptions = (board: (XorO | undefined)[][]) => {
    let result: XorO | null = null
    // Check Row Win
    players.forEach((player: XorO) => {
      board.forEach((row) => {
        if (checkGroup(row, player)) result = player
      })
    })
    // Check Column Win
    players.forEach((player: XorO) => {
      const numberOfColumns = board[0].length
      for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
        let columnValues: (XorO | undefined)[] = []
        board.forEach((row) => {
          columnValues.push(row[columnIndex])
        })
        if (checkGroup(columnValues, player)) result = player
      }
    })
    // Check Diagonal Win
    players.forEach((player: XorO) => {
      const numberOfColumns = board[0].length
      let diagonalValuesTopToBottom: (XorO | undefined)[] = []
      let diagonalValuesBottomToTop: (XorO | undefined)[] = []
      // debugger
      let topRow = 0
      let bottomRow = board.length - 1 // Number of arrays
      for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
        // 2 diagonals top to bottom, bottom to top.
        diagonalValuesTopToBottom.push(board[topRow][columnIndex])
        diagonalValuesBottomToTop.push(board[bottomRow][columnIndex])
        topRow++
        bottomRow--
      }
      if (checkGroup(diagonalValuesTopToBottom, player)) result = player
      if (checkGroup(diagonalValuesBottomToTop, player)) result = player
    })
    return result
  }

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    if (board[rowIndex][columnIndex] !== undefined || winner) return
    const newBoard = [...board]
    newBoard[rowIndex][columnIndex] = currentPlayer
    const winnerCheck = checkWinningOptions(newBoard)
    if (winnerCheck) {
      setWinner(winnerCheck)
    }
    setBoard(newBoard)
    setPlayer(currentPlayer === 'X' ? 'O' : 'X')
  }

  const handleNewGameClick = () => {
    setWinner(null)
    setBoard(createNewBoardArray(gameSize))
  }

  const handleGameSizeOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const gameSizeValue: number = Number(event.target.value)
    setGameSize(gameSizeValue)
    setBoard(createNewBoardArray(gameSizeValue))
  }

  const BoardSizeSelectComponent = () => {
    return (
      <div className='flex flex-row items-center gap-10'>
        <label htmlFor='quantity' className='mr-2'>
          Change Board Size (Will reset game):
        </label>
        <select
          id='quantity'
          className='bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500'
          onChange={handleGameSizeOnChange}
        >
          {range(3, 15 + 1).map((number) => {
            return <option value={number}>{number}</option>
          })}
        </select>
      </div>
    )
  }
  return (
    <div className='flex flex-col mt-10 items-center gap-10'>
      <div className='font-bold text-2xl'>Tic Tac Toe</div>
      {winner ? (
        <>
          <div className='font-bold'>Player {winner} wins!</div>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={handleNewGameClick}
            type='button'
          >
            Start new game
          </button>
        </>
      ) : (
        <div className='font-bold '>Player {currentPlayer}'s turn:</div>
      )}
      <div className='flex flex-col gap-1'>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className='flex gap-1'>
            {row.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className='border-2 border-gray-900 w-10 h-10 cursor-pointer items-center justify-center text-2xl font-bold flex'
                onClick={() => handleCellClick(rowIndex, columnIndex)}
              >
                {column}
              </div>
            ))}
          </div>
        ))}
      </div>
      <BoardSizeSelectComponent />
    </div>
  )
}
