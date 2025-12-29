import { Grid, CellType } from './grid'

/**
 * DFS Visualizer - Works directly with Grid for step-by-step visualization
 */
export class DFSVisualizer {
  private grid: Grid

  constructor(grid: Grid) {
    this.grid = grid
  }

  /**
   * Depth-First Search with step-by-step visualization
   * Optimized for non-weighted mazes: uses visited set to prevent infinite loops
   * Still shows backtracking along the current path (darker = more visits)
   * Stops immediately when end is found
   */
  *search(
    start: [number, number],
    end: [number, number]
  ): Generator<void, [number, number][] | null, unknown> {
    const stack: [number, number][][] = [[start]] // Stack of paths (LIFO for DFS)
    const visited = new Set<string>() // Track visited nodes to prevent revisiting from different branches
    visited.add(`${start[0]},${start[1]}`)

    while (stack.length > 0) {
      const path = stack.pop()!
      const [row, col] = path[path.length - 1]

      // Increment visit count for visualization (shows backtracking along current path)
      this.grid.incrementVisitCount(row, col)

      // Mark as visited (unless it's start or end)
      if (
        this.grid.getCell(row, col) !== CellType.Start &&
        this.grid.getCell(row, col) !== CellType.End
      ) {
        this.grid.setCell(row, col, CellType.Visited)
        yield // Yield for visualization
      }

      // Check if we reached the end - stop immediately
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

      // Explore neighbors - add in reverse order so first neighbor is explored first
      // This creates the "deep" exploration pattern of DFS
      const neighbors = this.grid.getNeighbors(row, col)
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const [newRow, newCol] = neighbors[i]
        const neighborKey = `${newRow},${newCol}`
        
        // Only explore unvisited neighbors (prevents infinite loops and excessive backtracking)
        // In a non-weighted maze, once we've explored a node, we don't need to revisit it
        if (!visited.has(neighborKey)) {
          visited.add(neighborKey)
          stack.push([...path, [newRow, newCol]])
        }
      }
    }

    // No path found
    return null
  }
}


