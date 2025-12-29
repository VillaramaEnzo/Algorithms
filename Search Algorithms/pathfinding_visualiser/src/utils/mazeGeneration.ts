import { Grid, CellType } from '../algorithms/grid'

interface CreateGridParams {
  gridSize: number
  mazeMode: 'multiple-paths' | 'perfect-maze' | 'open-grid'
  mazeAlgorithm: 'recursive-backtracking' | 'prims' | 'wilsons'
  wallDensity: number
}

export function createNewGrid({
  gridSize,
  mazeMode,
  mazeAlgorithm,
  wallDensity,
}: CreateGridParams): { newGrid: Grid; newStart: [number, number]; newEnd: [number, number] } {
  const newGrid = new Grid(gridSize)
  const [newStart, newEnd] = newGrid.generateRandomStartEnd()
  
  // Generate maze based on selected mode
  if (mazeMode === 'perfect-maze') {
    newGrid.generatePerfectMaze(newStart, newEnd, mazeAlgorithm)
  } else if (mazeMode === 'open-grid') {
    newGrid.generateOpenGrid()
  } else {
    newGrid.generateSolvableMaze(wallDensity, true, newStart, newEnd)
  }
  
  newGrid.setCell(newStart[0], newStart[1], CellType.Start)
  newGrid.setCell(newEnd[0], newEnd[1], CellType.End)
  return { newGrid, newStart, newEnd }
}

