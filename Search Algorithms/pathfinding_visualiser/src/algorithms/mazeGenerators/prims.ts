import { CellType } from '../types'
import { GridInterface } from '../gridInterface'
import { addUnvisitedNeighborsToFrontier } from '../mazeHelpers'

/**
 * Prim's Algorithm for perfect maze generation (with visualization)
 * Starts with a random cell and grows the maze by adding random unvisited cells to the maze
 */
export function* primsPerfectMazeVisualized(
  grid: GridInterface,
  visited: boolean[][]
): Generator<void, void, unknown> {
  const size = grid.getSize()
  
  // Get all odd-indexed interior cells as potential maze cells
  const allCells: [number, number][] = []
  for (let row = 1; row < size - 1; row += 2) {
    for (let col = 1; col < size - 1; col += 2) {
      allCells.push([row, col])
    }
  }

  if (allCells.length === 0) return

  // Start with a random cell
  const startCell = allCells[Math.floor(Math.random() * allCells.length)]
  const [startRow, startCol] = startCell
  grid.setCell(startRow, startCol, CellType.Empty)
  visited[startRow][startCol] = true
  yield // Yield after starting cell

  // Frontier: unvisited cells that are adjacent (2 steps away) to visited cells
  const frontier: [number, number][] = []
  addUnvisitedNeighborsToFrontier(grid, startRow, startCol, frontier, visited)

  // While there are cells in the frontier
  while (frontier.length > 0) {
    // Pick a random cell from the frontier
    const randomIndex = Math.floor(Math.random() * frontier.length)
    const [cellRow, cellCol] = frontier[randomIndex]
    frontier.splice(randomIndex, 1)

    // Find visited neighbors (2 steps away)
    const visitedNeighbors: [number, number][] = []
    const directions: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]]
    
    for (const [dr, dc] of directions) {
      const neighborRow = cellRow + dr
      const neighborCol = cellCol + dc
      
      if (grid.isValid(neighborRow, neighborCol) && 
          neighborRow > 0 && neighborRow < size - 1 &&
          neighborCol > 0 && neighborCol < size - 1 &&
          neighborRow % 2 === 1 && neighborCol % 2 === 1 &&
          visited[neighborRow][neighborCol]) {
        visitedNeighbors.push([neighborRow, neighborCol])
      }
    }

    // Pick a random visited neighbor
    if (visitedNeighbors.length > 0) {
      const [visitedRow, visitedCol] = visitedNeighbors[Math.floor(Math.random() * visitedNeighbors.length)]
      
      // Carve the current cell
      grid.setCell(cellRow, cellCol, CellType.Empty)
      visited[cellRow][cellCol] = true
      yield // Yield after carving cell

      // Carve the wall between them (1 step away)
      const wallRow = cellRow + Math.floor((visitedRow - cellRow) / 2)
      const wallCol = cellCol + Math.floor((visitedCol - cellCol) / 2)
      
      if (grid.isValid(wallRow, wallCol) &&
          wallRow > 0 && wallRow < size - 1 &&
          wallCol > 0 && wallCol < size - 1) {
        grid.setCell(wallRow, wallCol, CellType.Empty)
        visited[wallRow][wallCol] = true
        yield // Yield after carving wall
      }
      
      // Add new unvisited neighbors to frontier
      addUnvisitedNeighborsToFrontier(grid, cellRow, cellCol, frontier, visited)
    }
  }
}

/**
 * Prim's Algorithm for perfect maze generation (non-visualized version)
 * Starts with a random cell and grows the maze by adding random unvisited cells to the maze
 */
export function primsPerfectMaze(
  grid: GridInterface,
  visited: boolean[][]
): void {
  const size = grid.getSize()
  
  // Get all odd-indexed interior cells as potential maze cells
  const allCells: [number, number][] = []
  for (let row = 1; row < size - 1; row += 2) {
    for (let col = 1; col < size - 1; col += 2) {
      allCells.push([row, col])
    }
  }

  if (allCells.length === 0) return

  // Start with a random cell
  const startCell = allCells[Math.floor(Math.random() * allCells.length)]
  const [startRow, startCol] = startCell
  grid.setCell(startRow, startCol, CellType.Empty)
  visited[startRow][startCol] = true

  // Frontier: unvisited cells that are adjacent (2 steps away) to visited cells
  const frontier: [number, number][] = []
  addUnvisitedNeighborsToFrontier(grid, startRow, startCol, frontier, visited)

  // While there are cells in the frontier
  while (frontier.length > 0) {
    // Pick a random cell from the frontier
    const randomIndex = Math.floor(Math.random() * frontier.length)
    const [cellRow, cellCol] = frontier[randomIndex]
    frontier.splice(randomIndex, 1)

    // Find visited neighbors (2 steps away)
    const visitedNeighbors: [number, number][] = []
    const directions: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]]
    
    for (const [dr, dc] of directions) {
      const neighborRow = cellRow + dr
      const neighborCol = cellCol + dc
      
      if (grid.isValid(neighborRow, neighborCol) && 
          neighborRow > 0 && neighborRow < size - 1 &&
          neighborCol > 0 && neighborCol < size - 1 &&
          neighborRow % 2 === 1 && neighborCol % 2 === 1 &&
          visited[neighborRow][neighborCol]) {
        visitedNeighbors.push([neighborRow, neighborCol])
      }
    }

    // Pick a random visited neighbor
    if (visitedNeighbors.length > 0) {
      const [visitedRow, visitedCol] = visitedNeighbors[Math.floor(Math.random() * visitedNeighbors.length)]
      
      // Carve the current cell
      grid.setCell(cellRow, cellCol, CellType.Empty)
      visited[cellRow][cellCol] = true

      // Carve the wall between them (1 step away)
      const wallRow = cellRow + Math.floor((visitedRow - cellRow) / 2)
      const wallCol = cellCol + Math.floor((visitedCol - cellCol) / 2)
      
      if (grid.isValid(wallRow, wallCol) &&
          wallRow > 0 && wallRow < size - 1 &&
          wallCol > 0 && wallCol < size - 1) {
        grid.setCell(wallRow, wallCol, CellType.Empty)
        visited[wallRow][wallCol] = true
      }
      
      // Add new unvisited neighbors to frontier
      addUnvisitedNeighborsToFrontier(grid, cellRow, cellCol, frontier, visited)
    }
  }
}

