import { CellType } from '../types'
import { GridInterface } from '../gridInterface'
import { isInProtectedRegion, countCells } from '../mazeHelpers'
import { recursiveBacktrack } from './recursiveBacktracking'
import { isSolvable, ensureEndConnected, carveGuaranteedPath } from '../pathfindingHelpers'

/**
 * Generate a solvable maze using recursive backtracking
 * Creates a proper maze structure with walls and guaranteed connectivity
 * @param grid - The grid to generate the maze on
 * @param wallDensity - Target wall density (0.0 to 1.0). Higher = more walls, harder maze. Default 0.5
 * @param allowMultiplePaths - If true, adds extra paths to allow multiple solutions
 * @param startPos - Start position [row, col] to protect from walls (3x3 region)
 * @param endPos - End position [row, col] to protect from walls (3x3 region)
 */
export function generateSolvableMaze(
  grid: GridInterface,
  wallDensity: number = 0.5,
  allowMultiplePaths: boolean = true,
  startPos?: [number, number],
  endPos?: [number, number]
): void {
  // Clamp wall density to valid range
  const density = Math.max(0.1, Math.min(0.9, wallDensity))

  // Start with all cells as walls
  grid.reset()
  const size = grid.getSize()
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      grid.setCell(row, col, CellType.Wall)
    }
  }

  // Ensure start and end positions are empty (carved out)
  if (startPos) {
    grid.setCell(startPos[0], startPos[1], CellType.Empty)
  }
  if (endPos) {
    grid.setCell(endPos[0], endPos[1], CellType.Empty)
  }

  // Use recursive backtracking to carve paths
  const visited: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false))

  // Start from start position if provided, otherwise random cell
  let startRow: number, startCol: number
  if (startPos) {
    [startRow, startCol] = startPos
  } else {
    // Prefer starting near edges for better maze structure
    startRow = Math.random() > 0.5 
      ? Math.floor(Math.random() * 3) 
      : Math.max(0, size - 3) + Math.floor(Math.random() * 3)
    startCol = Math.random() > 0.5 
      ? Math.floor(Math.random() * 3) 
      : Math.max(0, size - 3) + Math.floor(Math.random() * 3)
  }

  // Carve the maze using recursive backtracking
  recursiveBacktrack(grid, startRow, startCol, visited)

  // Ensure end position is connected to the maze
  if (endPos) {
    ensureEndConnected(grid, endPos)
  }

  // Calculate how many walls we need to add to reach target density
  const totalCells = size * size
  const targetWallCount = Math.floor(totalCells * density)
  const currentWallCount = countCells(grid, CellType.Wall)
  const wallsToAdd = Math.max(0, targetWallCount - currentWallCount)

  // Add walls strategically to reach target density while maintaining connectivity
  // Exclude 3x3 regions around start and end positions
  addWallsToReachDensity(grid, wallsToAdd, density, startPos, endPos)

  // Verify and ensure connectivity between start and end
  if (startPos && endPos) {
    if (!isSolvable(grid, startPos, endPos)) {
      // If not solvable, carve a guaranteed path
      carveGuaranteedPath(grid, startPos, endPos)
    }
  }

  // Add some extra paths to allow multiple solutions (optional)
  if (allowMultiplePaths) {
    addExtraPaths(grid)
  }

  // Final verification - ensure still solvable after adding extra paths
  if (startPos && endPos) {
    if (!isSolvable(grid, startPos, endPos)) {
      // If somehow disconnected, carve a guaranteed path again
      carveGuaranteedPath(grid, startPos, endPos)
    }
  }
}

/**
 * Add walls strategically to reach target density while maintaining connectivity
 * @param grid - The grid to add walls to
 * @param wallsToAdd - Number of walls to add
 * @param density - Target wall density
 * @param startPos - Start position to protect (3x3 region)
 * @param endPos - End position to protect (3x3 region)
 */
function addWallsToReachDensity(
  grid: GridInterface,
  wallsToAdd: number,
  density: number,
  startPos?: [number, number],
  endPos?: [number, number]
): void {
  let added = 0
  const maxAttempts = wallsToAdd * 10 // Prevent infinite loops
  let attempts = 0
  const size = grid.getSize()

  // Create a list of candidate cells (empty cells that could become walls)
  // Include ALL cells including edges (0 to size-1)
  // BUT exclude 3x3 regions around start and end positions
  const candidates: [number, number][] = []
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid.getCell(row, col) === CellType.Empty) {
        // Skip if in protected region around start or end
        const inStartRegion = isInProtectedRegion(row, col, startPos)
        const inEndRegion = isInProtectedRegion(row, col, endPos)
        
        if (!inStartRegion && !inEndRegion) {
          candidates.push([row, col])
        }
      }
    }
  }

  // Shuffle candidates for randomness
  candidates.sort(() => Math.random() - 0.5)

  // Try to add walls, prioritizing cells with many empty neighbors
  for (const [row, col] of candidates) {
    if (added >= wallsToAdd || attempts >= maxAttempts) break

    // Count empty neighbors
    let emptyNeighbors = 0
    const directions: [number, number][] = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ]
    
    for (const [dr, dc] of directions) {
      if (
        grid.isValid(row + dr, col + dc) &&
        grid.getCell(row + dr, col + dc) === CellType.Empty
      ) {
        emptyNeighbors++
      }
    }

    // For edge cells, be more lenient (they have fewer neighbors)
    const isEdgeCell = row === 0 || row === size - 1 || col === 0 || col === size - 1
    
    // Prefer cells with 2-3 empty neighbors (creates interesting paths without blocking)
    // Higher density = more aggressive wall placement
    // Edge cells need lower threshold since they have fewer neighbors
    const threshold = isEdgeCell 
      ? (density > 0.6 ? 1 : 2)
      : (density > 0.6 ? 2 : 3)
    const probability = isEdgeCell
      ? (density > 0.6 ? 0.9 : 0.7)
      : (density > 0.6 ? 0.8 : 0.5)

    if (emptyNeighbors >= threshold && Math.random() < probability) {
      // Temporarily add wall to test connectivity
      grid.setCell(row, col, CellType.Wall)
      
      // Check if this disconnects start from end (if positions provided)
      let shouldKeepWall = true
      if (startPos && endPos) {
        if (!isSolvable(grid, startPos, endPos)) {
          // Revert if it disconnects start from end
          grid.setCell(row, col, CellType.Empty)
          shouldKeepWall = false
        }
      } else {
        // Fallback: check if we still have enough connectivity
        const emptyCount = countCells(grid, CellType.Empty)
        const minRequiredEmpty = Math.floor(size * size * (1 - density) * 0.8)
        if (emptyCount < minRequiredEmpty) {
          grid.setCell(row, col, CellType.Empty)
          shouldKeepWall = false
        }
      }
      
      if (shouldKeepWall) {
        added++
      }
    }
    attempts++
  }
}

/**
 * Add extra paths to create multiple solutions
 * Randomly removes some walls to create alternative routes
 */
function addExtraPaths(grid: GridInterface): void {
  const size = grid.getSize()
  const extraPathDensity = 0.05 // 5% chance to remove a wall

  for (let row = 1; row < size - 1; row++) {
    for (let col = 1; col < size - 1; col++) {
      // Only consider walls that are between two empty cells
      if (grid.getCell(row, col) === CellType.Wall) {
        const hasEmptyNeighbors =
          (grid.isValid(row - 1, col) && grid.getCell(row - 1, col) === CellType.Empty) ||
          (grid.isValid(row + 1, col) && grid.getCell(row + 1, col) === CellType.Empty) ||
          (grid.isValid(row, col - 1) && grid.getCell(row, col - 1) === CellType.Empty) ||
          (grid.isValid(row, col + 1) && grid.getCell(row, col + 1) === CellType.Empty)

        if (hasEmptyNeighbors && Math.random() < extraPathDensity) {
          grid.setCell(row, col, CellType.Empty)
        }
      }
    }
  }
}

