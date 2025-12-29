import { Grid, CellType } from '../algorithms/grid'

const animationSpeed = 30 // milliseconds between steps

export async function generateMazeForSingleView(
  gridSize: number,
  mazeAlgorithm: 'recursive-backtracking' | 'prims' | 'wilsons',
  shouldStopRef: React.MutableRefObject<boolean>,
  isPausedRef: React.MutableRefObject<boolean>,
  onUpdate: (grid: Grid, start: [number, number], end: [number, number]) => void,
  onComplete: (grid: Grid, start: [number, number], end: [number, number]) => void
): Promise<void> {
  const newGrid = new Grid(gridSize)
  const [newStart, newEnd] = newGrid.generateRandomStartEnd()
  
  // Generate maze with visualization
  const generator = newGrid.generatePerfectMazeVisualized(newStart, newEnd, mazeAlgorithm)
  
  for (const _ of generator) {
    if (shouldStopRef.current) {
      break
    }
    
    while (isPausedRef.current && !shouldStopRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    if (shouldStopRef.current) {
      break
    }
    
    onUpdate(newGrid.clone(), newStart, newEnd)
    await new Promise(resolve => setTimeout(resolve, animationSpeed))
  }

  // Ensure start and end are set after generation completes
  newGrid.setCell(newStart[0], newStart[1], CellType.Start)
  newGrid.setCell(newEnd[0], newEnd[1], CellType.End)
  onComplete(newGrid.clone(), newStart, newEnd)
}

export async function generateMazeForCompareView(
  gridSize: number,
  mazeAlgorithm: 'recursive-backtracking' | 'prims' | 'wilsons',
  shouldStopRef: React.MutableRefObject<boolean>,
  isPausedRef: React.MutableRefObject<boolean>,
  onUpdate: (grid: Grid, start: [number, number], end: [number, number]) => void,
  onComplete: (grid: Grid, start: [number, number], end: [number, number]) => void
): Promise<void> {
  const baseGrid = new Grid(gridSize)
  const [newStart, newEnd] = baseGrid.generateRandomStartEnd()
  
  // Generate the base maze with visualization
  const generator = baseGrid.generatePerfectMazeVisualized(newStart, newEnd, mazeAlgorithm)
  
  // Batch updates - only update every N steps to reduce overhead
  let stepCount = 0
  const updateFrequency = 3 // Update every 3 steps instead of every step
  
  // Update all grids during generation
  for (const _ of generator) {
    if (shouldStopRef.current) {
      break
    }
    
    while (isPausedRef.current && !shouldStopRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    if (shouldStopRef.current) {
      break
    }
    
    stepCount++
    
    // Only update state every N steps to reduce React re-render overhead
    if (stepCount % updateFrequency === 0) {
      onUpdate(baseGrid.clone(), newStart, newEnd)
      
      // Use requestAnimationFrame for smoother updates
      await new Promise(resolve => requestAnimationFrame(resolve))
      await new Promise(resolve => setTimeout(resolve, animationSpeed))
    } else {
      // Still wait a bit even if we're not updating state
      await new Promise(resolve => setTimeout(resolve, animationSpeed / updateFrequency))
    }
  }

  // Ensure start and end are set after generation completes
  baseGrid.setCell(newStart[0], newStart[1], CellType.Start)
  baseGrid.setCell(newEnd[0], newEnd[1], CellType.End)
  onComplete(baseGrid.clone(), newStart, newEnd)
}

