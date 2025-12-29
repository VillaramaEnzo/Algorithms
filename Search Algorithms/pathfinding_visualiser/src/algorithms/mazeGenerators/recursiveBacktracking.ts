import { CellType } from '../types'
import { GridInterface } from '../gridInterface'

/**
 * Recursive backtracking specifically for perfect maze generation (with visualization)
 * Uses standard perfect maze algorithm: work with odd-indexed cells (checkerboard pattern)
 * This ensures single walls between paths, no double walls
 */
export function* recursiveBacktrackPerfectMazeVisualized(
  grid: GridInterface,
  row: number,
  col: number,
  visited: boolean[][]
): Generator<void, void, unknown> {
  const size = grid.getSize()
  
  // Only work with interior cells (1 to size-2) and odd-indexed cells (checkerboard pattern)
  // This ensures single walls between paths, no double walls
  if (!grid.isValid(row, col) || visited[row][col] || 
      row <= 0 || row >= size - 1 || col <= 0 || col >= size - 1 ||
      row % 2 === 0 || col % 2 === 0) { // Only work with odd-indexed cells
    return
  }

  // Mark current cell as visited and carve it
  visited[row][col] = true
  grid.setCell(row, col, CellType.Empty)
  yield // Yield after carving cell

  // Get all unvisited neighbors (2 steps away - this creates single walls between paths)
  // Since we work with odd-indexed cells, neighbors are also odd-indexed
  const neighbors: [number, number][] = []
  const directions: [number, number][] = [
    [-2, 0], [2, 0], [0, -2], [0, 2],
  ]

  for (const [dr, dc] of directions) {
    const newRow = row + dr
    const newCol = col + dc

    // Only consider odd-indexed interior cells (1, 3, 5, ... up to size-2) that are walls and unvisited
    if (
      newRow > 0 && newRow < size - 1 &&
      newCol > 0 && newCol < size - 1 &&
      newRow % 2 === 1 && newCol % 2 === 1 && // Must be odd-indexed
      !visited[newRow][newCol] &&
      grid.getCell(newRow, newCol) === CellType.Wall
    ) {
      neighbors.push([newRow, newCol])
    }
  }

  // Shuffle neighbors for randomness
  neighbors.sort(() => Math.random() - 0.5)

  // Visit each neighbor
  for (const [newRow, newCol] of neighbors) {
    if (!visited[newRow][newCol]) {
      // Carve the wall between current cell and neighbor (the cell in between)
      // This is always exactly 1 step away, creating a single wall
      const wallRow = row + Math.floor((newRow - row) / 2)
      const wallCol = col + Math.floor((newCol - col) / 2)
      
      // Ensure the wall cell is interior and carve it
      if (wallRow > 0 && wallRow < size - 1 &&
          wallCol > 0 && wallCol < size - 1) {
        grid.setCell(wallRow, wallCol, CellType.Empty)
        yield // Yield after carving wall
      }
      
      // Recursively visit the new cell
      yield* recursiveBacktrackPerfectMazeVisualized(grid, newRow, newCol, visited)
    }
  }
}

/**
 * Recursive backtracking specifically for perfect maze generation (non-visualized version)
 * Uses standard perfect maze algorithm: work with odd-indexed cells (checkerboard pattern)
 * This ensures single walls between paths, no double walls
 */
export function recursiveBacktrackPerfectMaze(
  grid: GridInterface,
  row: number,
  col: number,
  visited: boolean[][]
): void {
  const size = grid.getSize()
  
  // Only work with interior cells (1 to size-2) and odd-indexed cells (checkerboard pattern)
  // This ensures single walls between paths, no double walls
  if (!grid.isValid(row, col) || visited[row][col] || 
      row <= 0 || row >= size - 1 || col <= 0 || col >= size - 1 ||
      row % 2 === 0 || col % 2 === 0) { // Only work with odd-indexed cells
    return
  }

  // Mark current cell as visited and carve it
  visited[row][col] = true
  grid.setCell(row, col, CellType.Empty)

  // Get all unvisited neighbors (2 steps away - this creates single walls between paths)
  // Since we work with odd-indexed cells, neighbors are also odd-indexed
  const neighbors: [number, number][] = []
  const directions: [number, number][] = [
    [-2, 0], [2, 0], [0, -2], [0, 2],
  ]

  for (const [dr, dc] of directions) {
    const newRow = row + dr
    const newCol = col + dc

    // Only consider odd-indexed interior cells (1, 3, 5, ... up to size-2) that are walls and unvisited
    if (
      newRow > 0 && newRow < size - 1 &&
      newCol > 0 && newCol < size - 1 &&
      newRow % 2 === 1 && newCol % 2 === 1 && // Must be odd-indexed
      !visited[newRow][newCol] &&
      grid.getCell(newRow, newCol) === CellType.Wall
    ) {
      neighbors.push([newRow, newCol])
    }
  }

  // Shuffle neighbors for randomness
  neighbors.sort(() => Math.random() - 0.5)

  // Visit each neighbor
  for (const [newRow, newCol] of neighbors) {
    if (!visited[newRow][newCol]) {
      // Carve the wall between current cell and neighbor (the cell in between)
      // This is always exactly 1 step away, creating a single wall
      const wallRow = row + Math.floor((newRow - row) / 2)
      const wallCol = col + Math.floor((newCol - col) / 2)
      
      // Ensure the wall cell is interior and carve it
      if (wallRow > 0 && wallRow < size - 1 &&
          wallCol > 0 && wallCol < size - 1) {
        grid.setCell(wallRow, wallCol, CellType.Empty)
      }
      
      // Recursively visit the new cell
      recursiveBacktrackPerfectMaze(grid, newRow, newCol, visited)
    }
  }
}

/**
 * Recursive backtracking algorithm to generate a perfect maze
 * Ensures all carved cells are connected
 */
export function recursiveBacktrack(
  grid: GridInterface,
  row: number,
  col: number,
  visited: boolean[][]
): void {
  if (!grid.isValid(row, col) || visited[row][col]) {
    return
  }

  // Mark current cell as visited and carve it
  visited[row][col] = true
  grid.setCell(row, col, CellType.Empty)

  // Get all unvisited neighbors (1 step away)
  const neighbors: [number, number][] = []
  const directions: [number, number][] = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ]

  for (const [dr, dc] of directions) {
    const newRow = row + dr
    const newCol = col + dc

    if (
      grid.isValid(newRow, newCol) &&
      !visited[newRow][newCol] &&
      grid.getCell(newRow, newCol) === CellType.Wall
    ) {
      neighbors.push([newRow, newCol])
    }
  }

  // Shuffle neighbors for randomness
  neighbors.sort(() => Math.random() - 0.5)

  // Visit each neighbor
  for (const [newRow, newCol] of neighbors) {
    if (!visited[newRow][newCol]) {
      // Recursively visit the new cell (it's already a wall, will be carved)
      recursiveBacktrack(grid, newRow, newCol, visited)
    }
  }
}

