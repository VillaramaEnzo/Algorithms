import { CellType } from './types'
import { clearProtectedRegion, getCornerCells } from './mazeHelpers'
import { isSolvable, ensureEndConnected, carveGuaranteedPath } from './pathfindingHelpers'
import { recursiveBacktrackPerfectMaze, recursiveBacktrackPerfectMazeVisualized } from './mazeGenerators/recursiveBacktracking'
import { primsPerfectMaze, primsPerfectMazeVisualized } from './mazeGenerators/prims'
import { wilsonsPerfectMaze, wilsonsPerfectMazeVisualized } from './mazeGenerators/wilsons'
import { generateSolvableMaze } from './mazeGenerators/solvableMaze'

export { CellType } from './types'

export class Grid {
  private grid: CellType[][]
  private size: number
  private visitCounts: Map<string, number> // Track how many times each cell is visited

  constructor(size: number) {
    this.size = size
    this.grid = Array(size)
      .fill(null)
      .map(() => Array(size).fill(CellType.Empty))
    this.visitCounts = new Map<string, number>()
  }

  getSize(): number {
    return this.size
  }

  getCell(row: number, col: number): CellType | null {
    if (!this.isValid(row, col)) {
      return null
    }
    return this.grid[row][col]
  }

  setCell(row: number, col: number, cellType: CellType): void {
    if (this.isValid(row, col)) {
      this.grid[row][col] = cellType
    }
  }

  isValid(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.size &&
      col >= 0 &&
      col < this.size
    )
  }

  getNeighbors(row: number, col: number): [number, number][] {
    const neighbors: [number, number][] = []
    const directions: [number, number][] = [
      [-1, 0], // up
      [1, 0],  // down
      [0, -1], // left
      [0, 1],  // right
    ]

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc

      if (
        this.isValid(newRow, newCol) &&
        this.grid[newRow][newCol] !== CellType.Wall
      ) {
        neighbors.push([newRow, newCol])
      }
    }

    return neighbors
  }

  reset(): void {
    this.grid = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(CellType.Empty))
    this.visitCounts.clear()
  }

  getVisitCount(row: number, col: number): number {
    const key = `${row},${col}`
    return this.visitCounts.get(key) || 0
  }

  incrementVisitCount(row: number, col: number): void {
    if (this.isValid(row, col)) {
      const key = `${row},${col}`
      const current = this.visitCounts.get(key) || 0
      this.visitCounts.set(key, current + 1)
    }
  }

  resetVisitCounts(): void {
    this.visitCounts.clear()
  }

  getVisitCounts(): number[][] {
    const counts: number[][] = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(0))
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        counts[row][col] = this.getVisitCount(row, col)
      }
    }
    
    return counts
  }

  clone(): Grid {
    const newGrid = new Grid(this.size)
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        newGrid.setCell(row, col, this.grid[row][col])
      }
    }
    // Copy visit counts
    for (const [key, count] of this.visitCounts.entries()) {
      const [row, col] = key.split(',').map(Number)
      for (let i = 0; i < count; i++) {
        newGrid.incrementVisitCount(row, col)
      }
    }
    return newGrid
  }

  getGrid(): CellType[][] {
    return this.grid.map((row) => [...row])
  }

  generateWalls(wallDensity: number = 0.3): void {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (
          this.grid[row][col] === CellType.Start ||
          this.grid[row][col] === CellType.End
        ) {
          continue
        }
        if (Math.random() < wallDensity) {
          this.grid[row][col] = CellType.Wall
        }
      }
    }
  }

  generateOpenGrid(): void {
    this.reset()
  }

  *generatePerfectMazeVisualized(
    startPos?: [number, number],
    endPos?: [number, number],
    algorithm: 'recursive-backtracking' | 'prims' | 'wilsons' = 'recursive-backtracking'
  ): Generator<void, void, unknown> {
    // Start with all cells as walls
    this.reset()
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.grid[row][col] = CellType.Wall
      }
    }
    yield

    const visited: boolean[][] = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(false))

    // Mark edge cells as walls and visited
    for (let row = 0; row < this.size; row++) {
      this.grid[row][0] = CellType.Wall
      this.grid[row][this.size - 1] = CellType.Wall
      visited[row][0] = true
      visited[row][this.size - 1] = true
    }
    for (let col = 0; col < this.size; col++) {
      this.grid[0][col] = CellType.Wall
      this.grid[this.size - 1][col] = CellType.Wall
      visited[0][col] = true
      visited[this.size - 1][col] = true
    }
    yield

    // Determine start position
    let startRow: number, startCol: number
    if (startPos && startPos[0] > 0 && startPos[0] < this.size - 1 && 
        startPos[1] > 0 && startPos[1] < this.size - 1) {
      [startRow, startCol] = startPos
      if (startRow % 2 === 0) startRow = Math.max(1, startRow - 1)
      if (startCol % 2 === 0) startCol = Math.max(1, startCol - 1)
    } else {
      const oddNumbers: number[] = []
      for (let i = 1; i < this.size - 1; i += 2) {
        oddNumbers.push(i)
      }
      startRow = oddNumbers[Math.floor(Math.random() * oddNumbers.length)]
      startCol = oddNumbers[Math.floor(Math.random() * oddNumbers.length)]
    }

    // Carve the perfect maze using the selected algorithm
    switch (algorithm) {
      case 'recursive-backtracking':
        yield* recursiveBacktrackPerfectMazeVisualized(this, startRow, startCol, visited)
        break
      case 'prims':
        yield* primsPerfectMazeVisualized(this, visited)
        break
      case 'wilsons':
        yield* wilsonsPerfectMazeVisualized(this, visited)
        break
    }

    // Clear 3x3 area around start and end
    if (startPos) {
      clearProtectedRegion(this, startPos)
      yield
    }
    if (endPos) {
      clearProtectedRegion(this, endPos)
      yield
    }

    // Ensure start and end positions are set
    if (startPos) {
      this.grid[startPos[0]][startPos[1]] = CellType.Start
      yield
    }
    if (endPos) {
      this.grid[endPos[0]][endPos[1]] = CellType.End
      ensureEndConnected(this, endPos)
      yield
    }

    // Verify connectivity
    if (startPos && endPos) {
      if (!isSolvable(this, startPos, endPos)) {
        carveGuaranteedPath(this, startPos, endPos)
        yield
      }
    }
  }

  generatePerfectMaze(
    startPos?: [number, number],
    endPos?: [number, number],
    algorithm: 'recursive-backtracking' | 'prims' | 'wilsons' = 'recursive-backtracking'
  ): void {
    // Start with all cells as walls
    this.reset()
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.grid[row][col] = CellType.Wall
      }
    }

    const visited: boolean[][] = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(false))

    // Mark edge cells as walls and visited
    for (let row = 0; row < this.size; row++) {
      this.grid[row][0] = CellType.Wall
      this.grid[row][this.size - 1] = CellType.Wall
      visited[row][0] = true
      visited[row][this.size - 1] = true
    }
    for (let col = 0; col < this.size; col++) {
      this.grid[0][col] = CellType.Wall
      this.grid[this.size - 1][col] = CellType.Wall
      visited[0][col] = true
      visited[this.size - 1][col] = true
    }

    // Determine start position
    let startRow: number, startCol: number
    if (startPos && startPos[0] > 0 && startPos[0] < this.size - 1 && 
        startPos[1] > 0 && startPos[1] < this.size - 1) {
      [startRow, startCol] = startPos
      if (startRow % 2 === 0) startRow = Math.max(1, startRow - 1)
      if (startCol % 2 === 0) startCol = Math.max(1, startCol - 1)
    } else {
      const oddNumbers: number[] = []
      for (let i = 1; i < this.size - 1; i += 2) {
        oddNumbers.push(i)
      }
      startRow = oddNumbers[Math.floor(Math.random() * oddNumbers.length)]
      startCol = oddNumbers[Math.floor(Math.random() * oddNumbers.length)]
    }

    // Carve the perfect maze using the selected algorithm
    switch (algorithm) {
      case 'recursive-backtracking':
        recursiveBacktrackPerfectMaze(this, startRow, startCol, visited)
        break
      case 'prims':
        primsPerfectMaze(this, visited)
        break
      case 'wilsons':
        wilsonsPerfectMaze(this, visited)
        break
    }

    // Clear 3x3 area around start and end
    if (startPos) {
      clearProtectedRegion(this, startPos)
    }
    if (endPos) {
      clearProtectedRegion(this, endPos)
    }

    // Ensure start and end positions are empty and connected
    if (startPos) {
      this.grid[startPos[0]][startPos[1]] = CellType.Empty
    }
    if (endPos) {
      this.grid[endPos[0]][endPos[1]] = CellType.Empty
      ensureEndConnected(this, endPos)
    }

    // Verify connectivity
    if (startPos && endPos) {
      if (!isSolvable(this, startPos, endPos)) {
        carveGuaranteedPath(this, startPos, endPos)
      }
    }
  }

  generateSolvableMaze(
    wallDensity: number = 0.5,
    allowMultiplePaths: boolean = true,
    startPos?: [number, number],
    endPos?: [number, number]
  ): void {
    generateSolvableMaze(this, wallDensity, allowMultiplePaths, startPos, endPos)
  }

  generateRandomStartEnd(): [[number, number], [number, number]] {
    const corners: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
    ]

    const startCornerIndex = Math.floor(Math.random() * corners.length)
    const startCorner = corners[startCornerIndex]
    const availableCorners = corners.filter((_, idx) => idx !== startCornerIndex)
    const endCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)]

    const getInteriorCornerCells = (corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): [number, number][] => {
      const allCornerCells = getCornerCells(this.size, corner)
      return allCornerCells.filter(
        ([row, col]) => row > 0 && row < this.size - 1 && col > 0 && col < this.size - 1
      )
    }

    const startCornerCells = getInteriorCornerCells(startCorner).filter(
      ([row, col]) => this.grid[row][col] === CellType.Empty
    )
    const endCornerCells = getInteriorCornerCells(endCorner).filter(
      ([row, col]) => this.grid[row][col] === CellType.Empty
    )

    let startCells = startCornerCells
    let endCells = endCornerCells

    if (startCells.length === 0) {
      startCells = getInteriorCornerCells(startCorner)
    }
    if (endCells.length === 0) {
      endCells = getInteriorCornerCells(endCorner)
    }

    const start = startCells[Math.floor(Math.random() * startCells.length)]
    const end = endCells[Math.floor(Math.random() * endCells.length)]

    return [start, end]
  }

  isSolvable(start: [number, number], end: [number, number]): boolean {
    return isSolvable(this, start, end)
  }
}
