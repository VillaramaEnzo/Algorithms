import { Grid, CellType } from './grid'

/**
 * Dead-End Filling Visualizer - Works directly with Grid for step-by-step visualization
 * Identifies and fills dead ends (cells with only one neighbor) until only the solution path remains
 */
export class DeadEndFillingVisualizer {
  private grid: Grid

  constructor(grid: Grid) {
    this.grid = grid
  }

  /**
   * Count the number of path neighbors (empty/visitable cells, excluding walls and filled dead ends)
   */
  private countPathNeighbors(row: number, col: number): number {
    // getNeighbors filters out walls, but we also need to exclude filled dead ends
    const neighbors = this.grid.getNeighbors(row, col)
    return neighbors.filter(([r, c]) => {
      const cellType = this.grid.getCell(r, c)
      // Count only empty, visited, or path cells (not walls or filled dead ends)
      return cellType !== CellType.Wall && cellType !== CellType.FilledDeadEnd
    }).length
  }

  /**
   * Dead-End Filling algorithm with step-by-step visualization
   * Fills dead ends (cells with only one empty neighbor) until only solution path remains
   */
  *search(
    _start: [number, number],
    _end: [number, number]
  ): Generator<void, [number, number][] | null, unknown> {
    let changed = true

    // Keep iterating until no more dead ends are found
    while (changed) {
      changed = false
      const deadEnds: [number, number][] = []

      // Find all dead ends (cells with exactly one path neighbor, excluding start/end)
      for (let row = 0; row < this.grid.getSize(); row++) {
        for (let col = 0; col < this.grid.getSize(); col++) {
          const cellType = this.grid.getCell(row, col)
          
          // Skip walls, filled dead ends, start, and end
          if (cellType === CellType.Wall || 
              cellType === CellType.FilledDeadEnd ||
              cellType === CellType.Start || 
              cellType === CellType.End) {
            continue
          }

          // Count path neighbors (empty, visited, or path cells)
          const pathNeighbors = this.countPathNeighbors(row, col)

          // If it has exactly 1 path neighbor, it's a dead end
          if (pathNeighbors === 1) {
            deadEnds.push([row, col])
          }
        }
      }

      // Fill all dead ends found in this iteration (use different color from walls)
      for (const [row, col] of deadEnds) {
        this.grid.setCell(row, col, CellType.FilledDeadEnd)
        changed = true
        yield // Yield for visualization
      }
    }

    // After filling dead ends, mark the remaining path
    // The remaining empty cells form the solution path
    for (let row = 0; row < this.grid.getSize(); row++) {
      for (let col = 0; col < this.grid.getSize(); col++) {
        const cellType = this.grid.getCell(row, col)
        if (cellType === CellType.Empty) {
          this.grid.setCell(row, col, CellType.Path)
          yield // Yield for visualization
        }
      }
    }

    // Dead-end filling doesn't return a specific path array
    // The path is marked on the grid
    return null
  }
}

