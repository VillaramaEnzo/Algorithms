import { CellType } from './types'
import { GridInterface } from './gridInterface'

/**
 * Verify that a path exists from start to end using BFS
 * Returns true if the maze is solvable
 */
export function isSolvable(
  grid: GridInterface,
  start: [number, number],
  end: [number, number]
): boolean {
  const queue: [number, number][] = [start]
  const visited = new Set<string>()
  visited.add(`${start[0]},${start[1]}`)

  while (queue.length > 0) {
    const [row, col] = queue.shift()!

    if (row === end[0] && col === end[1]) {
      return true
    }

    const neighbors = grid.getNeighbors(row, col)
    for (const [newRow, newCol] of neighbors) {
      const key = `${newRow},${newCol}`
      if (!visited.has(key)) {
        visited.add(key)
        queue.push([newRow, newCol])
      }
    }
  }

  return false
}

/**
 * Find the nearest empty cell to a given position using BFS
 */
export function findNearestEmptyCell(
  grid: GridInterface,
  row: number,
  col: number
): [number, number] | null {
  const queue: [number, number][] = [[row, col]]
  const visited = new Set<string>()
  visited.add(`${row},${col}`)

  const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]

  while (queue.length > 0) {
    const [currentRow, currentCol] = queue.shift()!

    for (const [dr, dc] of directions) {
      const newRow = currentRow + dr
      const newCol = currentCol + dc

      if (!grid.isValid(newRow, newCol)) continue

      const key = `${newRow},${newCol}`
      if (visited.has(key)) continue
      visited.add(key)

      if (grid.getCell(newRow, newCol) === CellType.Empty) {
        return [newRow, newCol]
      }

      if (grid.getCell(newRow, newCol) === CellType.Wall) {
        queue.push([newRow, newCol])
      }
    }
  }

  return null
}

/**
 * Carve a path between two points (helper for ensureEndConnected)
 */
export function carvePathBetween(
  grid: GridInterface,
  start: [number, number],
  end: [number, number]
): void {
  let [row, col] = start
  const [endRow, endCol] = end

  while (row !== endRow || col !== endCol) {
    grid.setCell(row, col, CellType.Empty)

    if (row < endRow) row++
    else if (row > endRow) row--
    else if (col < endCol) col++
    else if (col > endCol) col--
  }
  grid.setCell(endRow, endCol, CellType.Empty)
}

/**
 * Carve a guaranteed path between two points
 */
export function carveGuaranteedPath(
  grid: GridInterface,
  start: [number, number],
  end: [number, number]
): void {
  const [startRow, startCol] = start
  const [endRow, endCol] = end

  // Use A* or simple pathfinding to carve a path
  // For simplicity, use a direct path with some randomness
  let currentRow = startRow
  let currentCol = startCol

  // Carve path moving towards end
  while (currentRow !== endRow || currentCol !== endCol) {
    // Carve current cell
    grid.setCell(currentRow, currentCol, CellType.Empty)

    // Move towards end (with some randomness to avoid straight lines)
    if (Math.random() > 0.3) {
      // Move directly towards end
      if (currentRow < endRow) currentRow++
      else if (currentRow > endRow) currentRow--
      else if (currentCol < endCol) currentCol++
      else if (currentCol > endCol) currentCol--
    } else {
      // Add some randomness
      const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      const [dr, dc] = directions[Math.floor(Math.random() * directions.length)]
      const newRow = currentRow + dr
      const newCol = currentCol + dc
      if (grid.isValid(newRow, newCol)) {
        currentRow = newRow
        currentCol = newCol
      }
    }
  }

  // Carve the end position
  grid.setCell(endRow, endCol, CellType.Empty)
}

/**
 * Ensure the end position is connected to the maze
 */
export function ensureEndConnected(
  grid: GridInterface,
  endPos: [number, number]
): void {
  const [endRow, endCol] = endPos
  
  // If end is already empty and connected, we're good
  if (grid.getCell(endRow, endCol) === CellType.Empty) {
    // Check if it has at least one empty neighbor
    const neighbors = grid.getNeighbors(endRow, endCol)
    if (neighbors.length > 0) {
      return // Already connected
    }
  }

  // Carve out the end position
  grid.setCell(endRow, endCol, CellType.Empty)

  // Find the nearest empty cell and carve a path to it
  const nearestEmpty = findNearestEmptyCell(grid, endRow, endCol)
  if (nearestEmpty) {
    carvePathBetween(grid, endPos, nearestEmpty)
  }
}

