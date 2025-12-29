import { CellType } from './types'

/**
 * Shared interface for Grid operations
 * Used by maze generators and helpers
 */
export interface GridInterface {
  getSize(): number
  isValid(row: number, col: number): boolean
  getCell(row: number, col: number): CellType | null
  setCell(row: number, col: number, cellType: CellType): void
  getNeighbors(row: number, col: number): [number, number][]
  getGrid(): CellType[][]
  reset(): void
}

