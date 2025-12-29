import { Grid, CellType } from './grid'

/**
 * Flood-Fill Visualizer - Works directly with Grid for step-by-step visualization
 * Explores all reachable cells from the start point
 */
export class FloodFillVisualizer {
  private grid: Grid

  constructor(grid: Grid) {
    this.grid = grid
  }

  /**
   * Flood-Fill algorithm with step-by-step visualization
   * Explores all reachable cells from the start point and finds a path to the end
   */
  *search(
    start: [number, number],
    end: [number, number]
  ): Generator<void, [number, number][] | null, unknown> {
    // Use BFS-style path tracking to find path to end
    const queue: [number, number][][] = [[start]] // Queue of paths
    const visited = new Set<string>()
    visited.add(`${start[0]},${start[1]}`)
    let foundPath: [number, number][] | null = null

    while (queue.length > 0) {
      const path = queue.shift()!
      const [row, col] = path[path.length - 1]

      // Mark as visited (unless it's start or end)
      if (
        this.grid.getCell(row, col) !== CellType.Start &&
        this.grid.getCell(row, col) !== CellType.End
      ) {
        this.grid.setCell(row, col, CellType.Visited)
        yield // Yield for visualization
      }

      // Check if we reached the end
      if (row === end[0] && col === end[1]) {
        foundPath = path
        // Don't break - continue exploring to show full flood-fill
      }

      // Explore neighbors
      const neighbors = this.grid.getNeighbors(row, col)
      for (const [newRow, newCol] of neighbors) {
        const neighborKey = `${newRow},${newCol}`
        if (!visited.has(neighborKey)) {
          visited.add(neighborKey)
          queue.push([...path, [newRow, newCol]])
        }
      }
    }

    // Mark the path to the end if found
    if (foundPath) {
      for (let i = 1; i < foundPath.length - 1; i++) {
        const [pathRow, pathCol] = foundPath[i]
        if (
          this.grid.getCell(pathRow, pathCol) !== CellType.Start &&
          this.grid.getCell(pathRow, pathCol) !== CellType.End
        ) {
          this.grid.setCell(pathRow, pathCol, CellType.Path)
          yield // Yield for visualization
        }
      }
      return foundPath
    }

    // No path found
    return null
  }
}

