import { Grid, CellType } from './grid'

/**
 * A* Visualizer - Works directly with Grid for step-by-step visualization
 * Uses Manhattan distance as heuristic for grid-based pathfinding
 */
export class AStarVisualizer {
  private grid: Grid

  constructor(grid: Grid) {
    this.grid = grid
  }

  /**
   * Manhattan distance heuristic (for grid-based pathfinding)
   */
  private heuristic(row1: number, col1: number, row2: number, col2: number): number {
    return Math.abs(row1 - row2) + Math.abs(col1 - col2)
  }

  /**
   * A* Search with step-by-step visualization
   * Finds shortest path using f(n) = g(n) + h(n)
   * where g(n) is actual cost from start, h(n) is heuristic to goal
   */
  *search(
    start: [number, number],
    end: [number, number]
  ): Generator<void, [number, number][] | null, unknown> {
    // Priority queue: [f(n), g(n), path]
    // f(n) = g(n) + h(n) is used for priority
    const queue: Array<[number, number, [number, number][]]> = []
    
    // Track best g(n) (actual cost) to each node
    const gScore = new Map<string, number>()
    const startKey = `${start[0]},${start[1]}`
    gScore.set(startKey, 0)
    
    // Calculate f(n) for start: g(n) + h(n)
    const hStart = this.heuristic(start[0], start[1], end[0], end[1])
    const fStart = 0 + hStart
    
    queue.push([fStart, 0, [start]])
    
    // Track visited nodes to avoid revisiting with worse paths
    const visited = new Set<string>()
    visited.add(startKey)

    while (queue.length > 0) {
      // Sort queue by f(n) (priority) - smallest first
      queue.sort((a, b) => a[0] - b[0])
      
      const [, gCurrent, path] = queue.shift()!
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
        const neighborKey = `${newRow},${newCol}`
        
        // Calculate new g(n) = g(current) + 1 (each step costs 1)
        const newG = gCurrent + 1
        
        // Only explore if we haven't visited this node or found a better path
        const existingG = gScore.get(neighborKey)
        if (existingG === undefined || newG < existingG) {
          gScore.set(neighborKey, newG)
          
          // Calculate h(n) = heuristic to goal
          const h = this.heuristic(newRow, newCol, end[0], end[1])
          
          // Calculate f(n) = g(n) + h(n)
          const f = newG + h
          
          // Add to queue with new path
          queue.push([f, newG, [...path, [newRow, newCol]]])
          
          // Mark as visited to avoid adding multiple times
          if (!visited.has(neighborKey)) {
            visited.add(neighborKey)
          }
        }
      }
    }

    // No path found
    return null
  }
}

