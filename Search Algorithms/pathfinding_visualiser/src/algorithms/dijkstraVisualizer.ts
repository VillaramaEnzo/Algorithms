import { Grid, CellType } from './grid'

/**
 * Dijkstra's Visualizer - Works directly with Grid for step-by-step visualization
 * For unweighted graphs, Dijkstra's behaves like BFS but uses a priority queue
 */
export class DijkstraVisualizer {
  private grid: Grid

  constructor(grid: Grid) {
    this.grid = grid
  }

  /**
   * Dijkstra's algorithm with step-by-step visualization
   * Uses priority queue based on distance from start (no heuristic)
   * For unweighted graphs, this finds the shortest path like BFS
   */
  *search(
    start: [number, number],
    end: [number, number]
  ): Generator<void, [number, number][] | null, unknown> {
    // Priority queue: [distance, path]
    // Distance is the actual cost from start (g(n) only, no heuristic)
    const queue: Array<[number, [number, number][]]> = []
    
    // Track best distance to each node
    const distances = new Map<string, number>()
    const startKey = `${start[0]},${start[1]}`
    distances.set(startKey, 0)
    
    queue.push([0, [start]])
    
    // Track visited nodes to avoid revisiting with worse paths
    const visited = new Set<string>()

    while (queue.length > 0) {
      // Sort queue by distance - smallest first
      queue.sort((a, b) => a[0] - b[0])
      
      const [currentDistance, path] = queue.shift()!
      const [row, col] = path[path.length - 1]
      const key = `${row},${col}`

      // Skip if we've already found a better path to this node
      const bestDistance = distances.get(key)
      if (bestDistance !== undefined && currentDistance > bestDistance) {
        continue
      }

      // Mark as visited
      if (!visited.has(key)) {
        visited.add(key)
        
        // Mark as visited (unless it's start or end)
        if (
          this.grid.getCell(row, col) !== CellType.Start &&
          this.grid.getCell(row, col) !== CellType.End
        ) {
          this.grid.setCell(row, col, CellType.Visited)
          yield // Yield for visualization
        }
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
        
        // Calculate new distance = current distance + 1 (each step costs 1)
        const newDistance = currentDistance + 1
        
        // Only explore if we haven't visited this node or found a better path
        const existingDistance = distances.get(neighborKey)
        if (existingDistance === undefined || newDistance < existingDistance) {
          distances.set(neighborKey, newDistance)
          
          // Add to queue with new path
          queue.push([newDistance, [...path, [newRow, newCol]]])
        }
      }
    }

    // No path found
    return null
  }
}

