import { Grid, CellType } from '../algorithms/grid'
import { BFSVisualizer } from '../algorithms/bfsVisualizer'
import { DFSVisualizer } from '../algorithms/dfsVisualizer'
import { AStarVisualizer } from '../algorithms/astarVisualizer'
import { DijkstraVisualizer } from '../algorithms/dijkstraVisualizer'
import { FloodFillVisualizer } from '../algorithms/floodFillVisualizer'
import { DeadEndFillingVisualizer } from '../algorithms/deadEndFillingVisualizer'

const animationSpeed = 30

export async function runComparison(
  start: [number, number],
  end: [number, number],
  originalGrid: Grid,
  shouldStopRef: React.MutableRefObject<boolean>,
  isPausedRef: React.MutableRefObject<boolean>,
  onUpdate: (grids: { [key: string]: Grid }, steps: { [key: string]: number }) => void,
  onComplete: (paths: { [key: string]: [number, number][] | null }, solved: { [key: string]: boolean }, winner: string | null) => void
): Promise<void> {
  const baseGrid = originalGrid.clone()
  const grids: { [key: string]: Grid } = {
    'BFS': baseGrid.clone(),
    'DFS': baseGrid.clone(),
    'Dijkstra': baseGrid.clone(),
    'A*': baseGrid.clone(),
    'Flood-Fill': baseGrid.clone(),
    'Dead-End Filling': baseGrid.clone(),
  }

  Object.values(grids).forEach(g => g.resetVisitCounts())

  const visualizers = {
    'BFS': new BFSVisualizer(grids['BFS']),
    'DFS': new DFSVisualizer(grids['DFS']),
    'Dijkstra': new DijkstraVisualizer(grids['Dijkstra']),
    'A*': new AStarVisualizer(grids['A*']),
    'Flood-Fill': new FloodFillVisualizer(grids['Flood-Fill']),
    'Dead-End Filling': new DeadEndFillingVisualizer(grids['Dead-End Filling']),
  }

  const generators = {
    'BFS': visualizers['BFS'].search(start, end),
    'DFS': visualizers['DFS'].search(start, end),
    'Dijkstra': visualizers['Dijkstra'].search(start, end),
    'A*': visualizers['A*'].search(start, end),
    'Flood-Fill': visualizers['Flood-Fill'].search(start, end),
    'Dead-End Filling': visualizers['Dead-End Filling'].search(start, end),
  }

  const algorithmStatus: { [key: string]: boolean } = {
    'BFS': true,
    'DFS': true,
    'Dijkstra': true,
    'A*': true,
    'Flood-Fill': true,
    'Dead-End Filling': true,
  }

  const completionTimes: { [key: string]: number } = {}
  let currentWinner: string | null = null

  const updateWinner = () => {
    // Find the algorithm with the earliest completion time that found a path
    const validWinners = Object.entries(completionTimes)
      .filter(([_, time]) => time > 0)
      .sort(([_, timeA], [__, timeB]) => timeA - timeB)
    
    if (validWinners.length > 0) {
      currentWinner = validWinners[0][0]
    }
  }

  const runAlgorithm = async (name: string, grid: Grid, generator: Generator<void, [number, number][] | null, unknown>) => {
    let stepCount = 0
    try {
      let result: IteratorResult<void, [number, number][] | null>
      
      while (true) {
        result = generator.next()
        
        if (result.done) {
          const path = result.value
          const paths: { [key: string]: [number, number][] | null } = {}
          const solved: { [key: string]: boolean } = {}
          paths[name] = path
          solved[name] = !!path
          
          // Record completion time if algorithm found a path
          if (path) {
            completionTimes[name] = Date.now()
            updateWinner()
          } else {
            // Mark as completed but didn't find path (use a very large number)
            completionTimes[name] = Number.MAX_SAFE_INTEGER
          }
          
          onComplete(paths, solved, currentWinner)
          break
        }
        
        stepCount++
        
        if (shouldStopRef.current) {
          algorithmStatus[name] = false
          return
        }

        while (isPausedRef.current && !shouldStopRef.current) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        if (shouldStopRef.current) {
          algorithmStatus[name] = false
          return
        }

        const steps = { [name]: stepCount }
        onUpdate({ [name]: grid.clone() }, steps)
        await new Promise(resolve => setTimeout(resolve, animationSpeed))
      }
      algorithmStatus[name] = false
    } catch (error) {
      algorithmStatus[name] = false
    }
  }

  await Promise.all([
    runAlgorithm('BFS', grids['BFS'], generators['BFS']),
    runAlgorithm('DFS', grids['DFS'], generators['DFS']),
    runAlgorithm('Dijkstra', grids['Dijkstra'], generators['Dijkstra']),
    runAlgorithm('A*', grids['A*'], generators['A*']),
    runAlgorithm('Flood-Fill', grids['Flood-Fill'], generators['Flood-Fill']),
    runAlgorithm('Dead-End Filling', grids['Dead-End Filling'], generators['Dead-End Filling']),
  ])
}

export async function runMazeComparison(
  gridSize: number,
  shouldStopRef: React.MutableRefObject<boolean>,
  isPausedRef: React.MutableRefObject<boolean>,
  onUpdate: (grids: { [key: string]: Grid }) => void,
  onComplete: (start: [number, number], end: [number, number]) => void
): Promise<void> {
  const tempGrid = new Grid(gridSize)
  const [newStart, newEnd] = tempGrid.generateRandomStartEnd()

  const grids: { [key: string]: Grid } = {
    'Recursive Backtracking': new Grid(gridSize),
    "Prim's Algorithm": new Grid(gridSize),
    "Wilson's Algorithm": new Grid(gridSize),
  }

  Object.values(grids).forEach(g => g.reset())

  const generators = {
    'Recursive Backtracking': grids['Recursive Backtracking'].generatePerfectMazeVisualized(newStart, newEnd, 'recursive-backtracking'),
    "Prim's Algorithm": grids["Prim's Algorithm"].generatePerfectMazeVisualized(newStart, newEnd, 'prims'),
    "Wilson's Algorithm": grids["Wilson's Algorithm"].generatePerfectMazeVisualized(newStart, newEnd, 'wilsons'),
  }

  const algorithmStatus: { [key: string]: boolean } = {
    'Recursive Backtracking': true,
    "Prim's Algorithm": true,
    "Wilson's Algorithm": true,
  }

  const runMazeGeneration = async (name: string, grid: Grid, generator: Generator<void, void, unknown>) => {
    try {
      let stepCount = 0
      const updateFrequency = 3

      for (const _ of generator) {
        if (shouldStopRef.current) {
          algorithmStatus[name] = false
          return
        }

        while (isPausedRef.current && !shouldStopRef.current) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        if (shouldStopRef.current) {
          algorithmStatus[name] = false
          return
        }

        stepCount++

        if (stepCount % updateFrequency === 0) {
          onUpdate({ [name]: grid.clone() })
          await new Promise(resolve => requestAnimationFrame(resolve))
          await new Promise(resolve => setTimeout(resolve, animationSpeed))
        } else {
          await new Promise(resolve => setTimeout(resolve, animationSpeed / updateFrequency))
        }
      }

      onUpdate({ [name]: grid.clone() })
      grid.setCell(newStart[0], newStart[1], CellType.Start)
      grid.setCell(newEnd[0], newEnd[1], CellType.End)
      onUpdate({ [name]: grid.clone() })

      algorithmStatus[name] = false
    } catch (error) {
      algorithmStatus[name] = false
    }
  }

  await Promise.all([
    runMazeGeneration('Recursive Backtracking', grids['Recursive Backtracking'], generators['Recursive Backtracking']),
    runMazeGeneration("Prim's Algorithm", grids["Prim's Algorithm"], generators["Prim's Algorithm"]),
    runMazeGeneration("Wilson's Algorithm", grids["Wilson's Algorithm"], generators["Wilson's Algorithm"]),
  ])

  onComplete(newStart, newEnd)
}

