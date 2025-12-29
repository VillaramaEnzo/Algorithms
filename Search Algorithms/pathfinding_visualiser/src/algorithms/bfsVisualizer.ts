import { Grid, CellType } from './grid'

/**
 * BFS Visualizer - Works directly with Grid for step-by-step visualization
 */
export class BFSVisualizer {
  private grid: Grid

  constructor(grid: Grid) {
    this.grid = grid
  }

  /**
   * Breadth-First Search with step-by-step visualization
   * Yields each step so we can animate it
   */
  *search(
    start: [number, number],
    end: [number, number]
  ): Generator<void, [number, number][] | null, unknown> {
    const queue: [number, number][][] = [[start]] // Queue of paths
    const visited = new Set<string>()
    visited.add(`${start[0]},${start[1]}`)

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
        // Mark the path (excluding start and end)
        for (let i = 1; i < path.length - 1; i++) {
          const [pathRow, pathCol] = path[i]
          if (
            this.grid.getCell(pathRow, pathCol) !== CellType.Start &&
            this.grid.getCell(pathRow, pathCol) !== CellType.End
          ) {
            this.grid.setCell(pathRow, pathCol, CellType.Path)
            yield // Yield for visualization
          }
        }
        return path
      }

      // Explore neighbors
      const neighbors = this.grid.getNeighbors(row, col)
      for (const [newRow, newCol] of neighbors) {
        const key = `${newRow},${newCol}`
        if (!visited.has(key)) {
          visited.add(key)
          queue.push([...path, [newRow, newCol]])
        }
      }
    }

    // No path found
    return null
  }
}

