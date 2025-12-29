import { Grid, CellType } from '../algorithms/grid'
import { BFSVisualizer } from '../algorithms/bfsVisualizer'
import { DFSVisualizer } from '../algorithms/dfsVisualizer'
import { AStarVisualizer } from '../algorithms/astarVisualizer'
import { DijkstraVisualizer } from '../algorithms/dijkstraVisualizer'
import { FloodFillVisualizer } from '../algorithms/floodFillVisualizer'
import { DeadEndFillingVisualizer } from '../algorithms/deadEndFillingVisualizer'

export type AlgorithmName = 'BFS' | 'DFS' | 'A*' | 'Dijkstra' | 'Flood-Fill' | 'Dead-End Filling'

interface RunSingleAlgorithmParams {
  grid: Grid
  start: [number, number]
  end: [number, number]
  algorithmName: AlgorithmName
  shouldStopRef: React.MutableRefObject<boolean>
  isPausedRef: React.MutableRefObject<boolean>
  animationSpeed: number
  onStep: (stepCount: number) => void
  onUpdate: (grid: Grid) => void
  onComplete: (path: [number, number][] | null, grid: Grid) => void
}

export async function runSingleAlgorithm({
  grid,
  start,
  end,
  algorithmName,
  shouldStopRef,
  isPausedRef,
  animationSpeed,
  onStep,
  onUpdate,
  onComplete,
}: RunSingleAlgorithmParams): Promise<void> {
  // Clone the grid so we don't modify the original
  const workingGrid = grid.clone()
  workingGrid.resetVisitCounts()
  
  // Create the appropriate visualizer
  let visualizer: BFSVisualizer | DFSVisualizer | AStarVisualizer | DijkstraVisualizer | FloodFillVisualizer | DeadEndFillingVisualizer
  
  switch (algorithmName) {
    case 'BFS':
      visualizer = new BFSVisualizer(workingGrid)
      break
    case 'DFS':
      visualizer = new DFSVisualizer(workingGrid)
      break
    case 'A*':
      visualizer = new AStarVisualizer(workingGrid)
      break
    case 'Dijkstra':
      visualizer = new DijkstraVisualizer(workingGrid)
      break
    case 'Flood-Fill':
      visualizer = new FloodFillVisualizer(workingGrid)
      break
    case 'Dead-End Filling':
      visualizer = new DeadEndFillingVisualizer(workingGrid)
      break
  }
  
  const generator = visualizer.search(start, end)
  
  // Animate step by step
  let stepCount = 0
  let result: IteratorResult<void, [number, number][] | null>
  
  while (true) {
    result = generator.next()
    
    if (result.done) {
      const path = result.value
      
      // For Dead-End Filling, check path cells on grid
      if (algorithmName === 'Dead-End Filling' && !path) {
        const gridData = workingGrid.getGrid()
        let pathLength = 0
        for (let row = 0; row < workingGrid.getSize(); row++) {
          for (let col = 0; col < workingGrid.getSize(); col++) {
            if (gridData[row][col] === CellType.Path) {
              pathLength++
            }
          }
        }
        // Still pass null as path, but grid will have path cells
      }
      
      onComplete(path, workingGrid.clone())
      break
    }
    
    stepCount++
    onStep(stepCount)
    
    if (shouldStopRef.current) {
      break
    }
    
    // Wait for resume if paused
    while (isPausedRef.current && !shouldStopRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    if (shouldStopRef.current) {
      break
    }
    
    onUpdate(workingGrid.clone())
    await new Promise(resolve => setTimeout(resolve, animationSpeed))
  }
}

