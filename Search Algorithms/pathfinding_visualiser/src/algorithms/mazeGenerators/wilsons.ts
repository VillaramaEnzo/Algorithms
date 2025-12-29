import { CellType } from '../types'
import { GridInterface } from '../gridInterface'

/**
 * Wilson's Algorithm for perfect maze generation (with visualization)
 * Uses loop-erased random walk to build the maze
 */
export function* wilsonsPerfectMazeVisualized(
  grid: GridInterface,
  visited: boolean[][]
): Generator<void, void, unknown> {
  const size = grid.getSize()
  
  // Get all odd-indexed interior cells as potential maze cells
  const unvisitedCells: Set<string> = new Set()
  for (let row = 1; row < size - 1; row += 2) {
    for (let col = 1; col < size - 1; col += 2) {
      unvisitedCells.add(`${row},${col}`)
    }
  }

  if (unvisitedCells.size === 0) return

  // Start with a random cell in the maze
  const startCell = Array.from(unvisitedCells)[Math.floor(Math.random() * unvisitedCells.size)]
  const [startRow, startCol] = startCell.split(',').map(Number)
  grid.setCell(startRow, startCol, CellType.Empty)
  visited[startRow][startCol] = true
  unvisitedCells.delete(startCell)
  yield // Yield after starting cell

  // While there are unvisited cells
  while (unvisitedCells.size > 0) {
    // Pick a random unvisited cell to start the walk
    const unvisitedArray = Array.from(unvisitedCells)
    const randomCell = unvisitedArray[Math.floor(Math.random() * unvisitedArray.length)]
    const [currentRow, currentCol] = randomCell.split(',').map(Number)

    // Perform a loop-erased random walk until we hit the maze
    const path: [number, number][] = [[currentRow, currentCol]]
    const pathSet = new Set<string>([randomCell])
    let [walkRow, walkCol] = [currentRow, currentCol]

    while (unvisitedCells.has(`${walkRow},${walkCol}`)) {
      // Get valid neighbors (2 steps away, odd-indexed)
      const neighbors: [number, number][] = []
      const directions: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]]

      for (const [dr, dc] of directions) {
        const newRow = walkRow + dr
        const newCol = walkCol + dc

        if (newRow > 0 && newRow < size - 1 &&
            newCol > 0 && newCol < size - 1 &&
            newRow % 2 === 1 && newCol % 2 === 1) {
          neighbors.push([newRow, newCol])
        }
      }

      if (neighbors.length === 0) break

      // Randomly choose a neighbor
      const [nextRow, nextCol] = neighbors[Math.floor(Math.random() * neighbors.length)]
      const nextKey = `${nextRow},${nextCol}`

      // If we've seen this cell before, erase the loop
      if (pathSet.has(nextKey)) {
        const loopStartIndex = path.findIndex(([r, c]) => r === nextRow && c === nextCol)
        if (loopStartIndex !== -1) {
          // Remove everything after the loop start
          for (let i = loopStartIndex + 1; i < path.length; i++) {
            const [r, c] = path[i]
            pathSet.delete(`${r},${c}`)
          }
          path.splice(loopStartIndex + 1)
        }
      } else {
        // Add to path
        path.push([nextRow, nextCol])
        pathSet.add(nextKey)
      }

      walkRow = nextRow
      walkCol = nextCol

      // If we hit the maze, break
      if (grid.getCell(walkRow, walkCol) === CellType.Empty) {
        break
      }
    }

    // Carve the path into the maze
    for (let i = 0; i < path.length; i++) {
      const [row, col] = path[i]
      grid.setCell(row, col, CellType.Empty)
      visited[row][col] = true
      unvisitedCells.delete(`${row},${col}`)
      yield // Yield after carving each cell

      // Carve the wall between this cell and the next (if not the last cell)
      if (i < path.length - 1) {
        const [nextRow, nextCol] = path[i + 1]
        const wallRow = row + Math.floor((nextRow - row) / 2)
        const wallCol = col + Math.floor((nextCol - col) / 2)
        
        if (grid.isValid(wallRow, wallCol) &&
            wallRow > 0 && wallRow < size - 1 &&
            wallCol > 0 && wallCol < size - 1) {
          grid.setCell(wallRow, wallCol, CellType.Empty)
          visited[wallRow][wallCol] = true
          yield // Yield after carving wall
        }
      }
    }
  }
}

/**
 * Wilson's Algorithm for perfect maze generation (non-visualized version)
 * Uses loop-erased random walk to build the maze
 */
export function wilsonsPerfectMaze(
  grid: GridInterface,
  visited: boolean[][]
): void {
  const size = grid.getSize()
  
  // Get all odd-indexed interior cells as potential maze cells
  const unvisitedCells: Set<string> = new Set()
  for (let row = 1; row < size - 1; row += 2) {
    for (let col = 1; col < size - 1; col += 2) {
      unvisitedCells.add(`${row},${col}`)
    }
  }

  if (unvisitedCells.size === 0) return

  // Start with a random cell in the maze
  const startCell = Array.from(unvisitedCells)[Math.floor(Math.random() * unvisitedCells.size)]
  const [startRow, startCol] = startCell.split(',').map(Number)
  grid.setCell(startRow, startCol, CellType.Empty)
  visited[startRow][startCol] = true
  unvisitedCells.delete(startCell)

  // While there are unvisited cells
  while (unvisitedCells.size > 0) {
    // Pick a random unvisited cell to start the walk
    const unvisitedArray = Array.from(unvisitedCells)
    const randomCell = unvisitedArray[Math.floor(Math.random() * unvisitedArray.length)]
    const [currentRow, currentCol] = randomCell.split(',').map(Number)

    // Perform a loop-erased random walk until we hit the maze
    const path: [number, number][] = [[currentRow, currentCol]]
    const pathSet = new Set<string>([randomCell])
    let [walkRow, walkCol] = [currentRow, currentCol]

    while (unvisitedCells.has(`${walkRow},${walkCol}`)) {
      // Get valid neighbors (2 steps away, odd-indexed)
      const neighbors: [number, number][] = []
      const directions: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]]

      for (const [dr, dc] of directions) {
        const newRow = walkRow + dr
        const newCol = walkCol + dc

        if (newRow > 0 && newRow < size - 1 &&
            newCol > 0 && newCol < size - 1 &&
            newRow % 2 === 1 && newCol % 2 === 1) {
          neighbors.push([newRow, newCol])
        }
      }

      if (neighbors.length === 0) break

      // Randomly choose a neighbor
      const [nextRow, nextCol] = neighbors[Math.floor(Math.random() * neighbors.length)]
      const nextKey = `${nextRow},${nextCol}`

      // If we've seen this cell before, erase the loop
      if (pathSet.has(nextKey)) {
        const loopStartIndex = path.findIndex(([r, c]) => r === nextRow && c === nextCol)
        if (loopStartIndex !== -1) {
          // Remove everything after the loop start
          for (let i = loopStartIndex + 1; i < path.length; i++) {
            const [r, c] = path[i]
            pathSet.delete(`${r},${c}`)
          }
          path.splice(loopStartIndex + 1)
        }
      } else {
        // Add to path
        path.push([nextRow, nextCol])
        pathSet.add(nextKey)
      }

      walkRow = nextRow
      walkCol = nextCol

      // If we hit the maze, break
      if (grid.getCell(walkRow, walkCol) === CellType.Empty) {
        break
      }
    }

    // Carve the path into the maze
    for (let i = 0; i < path.length; i++) {
      const [row, col] = path[i]
      grid.setCell(row, col, CellType.Empty)
      visited[row][col] = true
      unvisitedCells.delete(`${row},${col}`)

      // Carve the wall between this cell and the next (if not the last cell)
      if (i < path.length - 1) {
        const [nextRow, nextCol] = path[i + 1]
        const wallRow = row + Math.floor((nextRow - row) / 2)
        const wallCol = col + Math.floor((nextCol - col) / 2)
        
        if (grid.isValid(wallRow, wallCol) &&
            wallRow > 0 && wallRow < size - 1 &&
            wallCol > 0 && wallCol < size - 1) {
          grid.setCell(wallRow, wallCol, CellType.Empty)
          visited[wallRow][wallCol] = true
        }
      }
    }
  }
}

