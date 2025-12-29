import { CellType } from './types'
import { GridInterface } from './gridInterface'

/**
 * Check if a cell is within a 3x3 region around a given position
 */
export function isInProtectedRegion(
  row: number,
  col: number,
  centerPos?: [number, number]
): boolean {
  if (!centerPos) return false
  
  const [centerRow, centerCol] = centerPos
  const rowDiff = Math.abs(row - centerRow)
  const colDiff = Math.abs(col - centerCol)
  
  // Check if within 3x3 region (1 cell radius in each direction)
  return rowDiff <= 1 && colDiff <= 1
}

/**
 * Clear a 3x3 area around a position, but respect outer walls
 * Only clears interior walls, not the outer wall border
 */
export function clearProtectedRegion(
  grid: GridInterface,
  centerPos: [number, number]
): void {
  const [centerRow, centerCol] = centerPos
  const size = grid.getSize()
  
  // Clear a 3x3 area around the center, but exclude outer wall cells
  for (let row = centerRow - 1; row <= centerRow + 1; row++) {
    for (let col = centerCol - 1; col <= centerCol + 1; col++) {
      // Only clear if it's a valid interior cell (not on outer wall)
      // Outer walls are at row 0, row size-1, col 0, col size-1
      if (grid.isValid(row, col) && 
          row > 0 && row < size - 1 && 
          col > 0 && col < size - 1) {
        // Only clear if it's currently a wall (don't overwrite already cleared paths)
        if (grid.getCell(row, col) === CellType.Wall) {
          grid.setCell(row, col, CellType.Empty)
        }
      }
    }
  }
}

/**
 * Count cells of a specific type
 */
export function countCells(grid: GridInterface, cellType: CellType): number {
  let count = 0
  const size = grid.getSize()
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid.getCell(row, col) === cellType) {
        count++
      }
    }
  }
  return count
}

/**
 * Get all cells in a 3x3 corner region
 */
export function getCornerCells(
  size: number,
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
): [number, number][] {
  const cells: [number, number][] = []
  let startRow: number, endRow: number, startCol: number, endCol: number

  switch (corner) {
    case 'top-left':
      startRow = 0
      endRow = Math.min(2, size - 1)
      startCol = 0
      endCol = Math.min(2, size - 1)
      break
    case 'top-right':
      startRow = 0
      endRow = Math.min(2, size - 1)
      startCol = Math.max(0, size - 3)
      endCol = size - 1
      break
    case 'bottom-left':
      startRow = Math.max(0, size - 3)
      endRow = size - 1
      startCol = 0
      endCol = Math.min(2, size - 1)
      break
    case 'bottom-right':
      startRow = Math.max(0, size - 3)
      endRow = size - 1
      startCol = Math.max(0, size - 3)
      endCol = size - 1
      break
  }

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      cells.push([row, col])
    }
  }

  return cells
}

/**
 * Add unvisited cells (2 steps away) to the frontier (for Prim's algorithm)
 */
export function addUnvisitedNeighborsToFrontier(
  grid: GridInterface,
  row: number,
  col: number,
  frontier: [number, number][],
  visited: boolean[][]
): void {
  const size = grid.getSize()
  const directions: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]]
  
  for (const [dr, dc] of directions) {
    const neighborRow = row + dr
    const neighborCol = col + dc
    
    if (grid.isValid(neighborRow, neighborCol) &&
        neighborRow > 0 && neighborRow < size - 1 &&
        neighborCol > 0 && neighborCol < size - 1 &&
        neighborRow % 2 === 1 && neighborCol % 2 === 1 &&
        !visited[neighborRow][neighborCol] &&
        grid.getCell(neighborRow, neighborCol) === CellType.Wall) {
      // Check if this cell is not already in frontier
      const alreadyInFrontier = frontier.some(([r, c]) => r === neighborRow && c === neighborCol)
      if (!alreadyInFrontier) {
        frontier.push([neighborRow, neighborCol])
      }
    }
  }
}

