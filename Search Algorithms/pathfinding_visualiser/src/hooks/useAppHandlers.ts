import { useCallback } from 'react'
import { Grid, CellType } from '../algorithms/grid'
import { runSingleAlgorithm } from '../utils/algorithmRunners'
import { runComparison, runMazeComparison } from '../utils/comparisonHelpers'

interface UseAppHandlersProps {
  grid: Grid | null
  originalGrid: Grid | null
  start: [number, number] | null
  end: [number, number] | null
  hasRunAlgorithm: boolean
  isRunning: boolean
  isPaused: boolean
  gridSize: number
  gridSizeInput: string
  viewMode: 'single' | 'compare' | 'maze-compare'
  mazeAlgorithm: 'recursive-backtracking' | 'prims' | 'wilsons'
  animationSpeed: number
  shouldStopRef: React.MutableRefObject<boolean>
  isPausedRef: React.MutableRefObject<boolean>
  createNewGridCallback: () => { newGrid: Grid; newStart: [number, number]; newEnd: [number, number] }
  compareRunning?: boolean
  isGeneratingMaze?: boolean
  isGeneratingMazeCompare?: boolean
  // Setters
  setGrid: (grid: Grid) => void
  setOriginalGrid: (grid: Grid) => void
  setStart: (start: [number, number]) => void
  setEnd: (end: [number, number]) => void
  setIsRunning: (running: boolean) => void
  setIsPaused: (paused: boolean) => void
  setHasRunAlgorithm: (hasRun: boolean) => void
  setCurrentAlgorithm: (algorithm: string | null) => void
  setCompareGrids: React.Dispatch<React.SetStateAction<{ [key: string]: Grid }>>
  setCompareRunning: (running: boolean) => void
  setIsGeneratingMaze: (generating: boolean) => void
  setMazeCompareGrids: React.Dispatch<React.SetStateAction<{ [key: string]: Grid }>>
  setIsGeneratingMazeCompare: (generating: boolean) => void
  setAlgorithmSteps: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  setAlgorithmPaths: React.Dispatch<React.SetStateAction<{ [key: string]: [number, number][] | null }>>
  setAlgorithmSolved: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
  setFirstFinishedAlgorithm: (algorithm: string | null) => void
  setSingleViewSteps: (steps: number) => void
  setSingleViewPath: (path: [number, number][] | null) => void
  setSingleViewSolved: (solved: boolean) => void
  setViewMode: (mode: 'single' | 'compare' | 'maze-compare') => void
  setGridSize: (size: number) => void
  setGridSizeInput: (input: string) => void
}

export function useAppHandlers(props: UseAppHandlersProps) {
  const {
    grid,
    originalGrid,
    start,
    end,
    hasRunAlgorithm,
    isRunning,
    isPaused,
    gridSize,
    viewMode,
    mazeAlgorithm,
    animationSpeed,
    shouldStopRef,
    isPausedRef,
    createNewGridCallback,
    setGrid,
    setOriginalGrid,
    setStart,
    setEnd,
    setIsRunning,
    setIsPaused,
    setHasRunAlgorithm,
    setCurrentAlgorithm,
    setCompareGrids,
    setCompareRunning,
    setIsGeneratingMaze,
    setMazeCompareGrids,
    setIsGeneratingMazeCompare,
    setAlgorithmSteps,
    setAlgorithmPaths,
    setAlgorithmSolved,
    setFirstFinishedAlgorithm,
    setSingleViewSteps,
    setSingleViewPath,
    setSingleViewSolved,
    setViewMode,
    setGridSize,
    setGridSizeInput,
  } = props

  const runSingleAlgorithmWrapper = useCallback(async (algorithmName: 'BFS' | 'DFS' | 'A*' | 'Dijkstra' | 'Flood-Fill' | 'Dead-End Filling') => {
    if (isRunning && !isPaused) return
    if (isPaused) {
      setIsPaused(false)
      return
    }

    let currentGrid = grid
    let currentStart = start
    let currentEnd = end

    if (hasRunAlgorithm && originalGrid) {
      currentGrid = originalGrid.clone()
      currentStart = start
      currentEnd = end
      setGrid(currentGrid)
      setHasRunAlgorithm(false)
    }

    if (!currentGrid || !currentStart || !currentEnd) return

    setIsRunning(true)
    setIsPaused(false)
    setCurrentAlgorithm(algorithmName)
    shouldStopRef.current = false
    isPausedRef.current = false
    setSingleViewSteps(0)
    setSingleViewPath(null)
    setSingleViewSolved(false)

    await runSingleAlgorithm({
      grid: currentGrid,
      start: currentStart,
      end: currentEnd,
      algorithmName,
      shouldStopRef,
      isPausedRef,
      animationSpeed,
      onStep: (stepCount) => setSingleViewSteps(stepCount),
      onUpdate: (updatedGrid) => setGrid(updatedGrid),
      onComplete: (path, finalGrid) => {
        if (path) {
          setSingleViewPath(path)
          setSingleViewSolved(true)
        } else if (algorithmName === 'Dead-End Filling') {
          const gridData = finalGrid.getGrid()
          let pathLength = 0
          for (let row = 0; row < finalGrid.getSize(); row++) {
            for (let col = 0; col < finalGrid.getSize(); col++) {
              if (gridData[row][col] === CellType.Path) {
                pathLength++
              }
            }
          }
          setSingleViewSolved(pathLength > 0)
        } else {
          setSingleViewSolved(false)
        }
        setIsRunning(false)
        setIsPaused(false)
        isPausedRef.current = false
        setHasRunAlgorithm(true)
      },
    })
  }, [grid, originalGrid, start, end, hasRunAlgorithm, animationSpeed, isRunning, isPaused, setIsRunning, setIsPaused, setCurrentAlgorithm, setGrid, setHasRunAlgorithm, setSingleViewSteps, setSingleViewPath, setSingleViewSolved, shouldStopRef, isPausedRef])

  const resetGrid = useCallback(() => {
    shouldStopRef.current = true
    isPausedRef.current = false
    setIsRunning(false)
    setIsPaused(false)
    setIsGeneratingMaze(false)
    setIsGeneratingMazeCompare(false)
    setCurrentAlgorithm(null)
    setCompareRunning(false)
    setFirstFinishedAlgorithm(null)
    setSingleViewSteps(0)
    setSingleViewPath(null)
    setSingleViewSolved(false)
    
    const { newGrid, newStart, newEnd } = createNewGridCallback()
    setOriginalGrid(newGrid.clone())
    setGrid(newGrid)
    setStart(newStart)
    setEnd(newEnd)
    setHasRunAlgorithm(false)
    
    if (viewMode === 'compare') {
      const baseGrid = newGrid.clone()
      setCompareGrids({
        'BFS': baseGrid.clone(),
        'DFS': baseGrid.clone(),
        'Dijkstra': baseGrid.clone(),
        'A*': baseGrid.clone(),
        'Flood-Fill': baseGrid.clone(),
        'Dead-End Filling': baseGrid.clone(),
      })
      setAlgorithmSteps({
        'BFS': 0,
        'DFS': 0,
        'Dijkstra': 0,
        'A*': 0,
        'Flood-Fill': 0,
        'Dead-End Filling': 0,
      })
      setAlgorithmPaths({
        'BFS': null,
        'DFS': null,
        'Dijkstra': null,
        'A*': null,
        'Flood-Fill': null,
        'Dead-End Filling': null,
      })
      setAlgorithmSolved({
        'BFS': false,
        'DFS': false,
        'Dijkstra': false,
        'A*': false,
        'Flood-Fill': false,
        'Dead-End Filling': false,
      })
      setFirstFinishedAlgorithm(null)
    } else if (viewMode === 'maze-compare') {
      const emptyGrid = new Grid(gridSize)
      setMazeCompareGrids({
        'Recursive Backtracking': emptyGrid.clone(),
        "Prim's Algorithm": emptyGrid.clone(),
        "Wilson's Algorithm": emptyGrid.clone(),
      })
    }
  }, [createNewGridCallback, viewMode, gridSize, shouldStopRef, isPausedRef, setIsRunning, setIsPaused, setIsGeneratingMaze, setIsGeneratingMazeCompare, setCurrentAlgorithm, setCompareRunning, setSingleViewSteps, setSingleViewPath, setSingleViewSolved, setOriginalGrid, setGrid, setStart, setEnd, setHasRunAlgorithm, setCompareGrids, setMazeCompareGrids, setAlgorithmSteps, setAlgorithmPaths, setAlgorithmSolved, setFirstFinishedAlgorithm])

  const togglePause = useCallback(() => {
    const compareRunning = props.compareRunning ?? false
    const isGeneratingMaze = props.isGeneratingMaze ?? false
    const isGeneratingMazeCompare = props.isGeneratingMazeCompare ?? false
    if (isRunning || compareRunning || isGeneratingMaze || isGeneratingMazeCompare) {
      const newPausedState = !isPaused
      setIsPaused(newPausedState)
      isPausedRef.current = newPausedState
    }
  }, [isRunning, isPaused, setIsPaused, isPausedRef, props])

  const runComparisonWrapper = useCallback(async () => {
    const compareRunning = props.compareRunning ?? false
    const isGeneratingMaze = props.isGeneratingMaze ?? false
    if (compareRunning && !isPaused) return
    if (isGeneratingMaze) return
    if (isPaused) {
      setIsPaused(false)
      isPausedRef.current = false
      return
    }
    if (!start || !end || !originalGrid) return

    setCompareRunning(true)
    setIsPaused(false)
    shouldStopRef.current = false
    isPausedRef.current = false

    setAlgorithmSteps({
      'BFS': 0,
      'DFS': 0,
      'Dijkstra': 0,
      'A*': 0,
      'Flood-Fill': 0,
      'Dead-End Filling': 0,
    })
    setFirstFinishedAlgorithm(null)

    await runComparison(
      start,
      end,
      originalGrid,
      shouldStopRef,
      isPausedRef,
      (grids, steps) => {
        setCompareGrids((prev: { [key: string]: Grid }) => ({ ...prev, ...grids }))
        setAlgorithmSteps((prev: { [key: string]: number }) => ({ ...prev, ...steps }))
      },
      (paths, solved, winner) => {
        setAlgorithmPaths((prev: { [key: string]: [number, number][] | null }) => ({ ...prev, ...paths }))
        setAlgorithmSolved((prev: { [key: string]: boolean }) => ({ ...prev, ...solved }))
        if (winner) {
          setFirstFinishedAlgorithm(winner)
        }
      }
    )

    setCompareRunning(false)
    setIsPaused(false)
    isPausedRef.current = false
  }, [start, end, originalGrid, isPaused, props, shouldStopRef, isPausedRef, setCompareRunning, setIsPaused, setCompareGrids, setAlgorithmSteps, setAlgorithmPaths, setAlgorithmSolved, setFirstFinishedAlgorithm])

  const runMazeComparisonWrapper = useCallback(async () => {
    const isGeneratingMazeCompare = props.isGeneratingMazeCompare ?? false
    const compareRunning = props.compareRunning ?? false
    if (isGeneratingMazeCompare && !isPaused) return
    if (isRunning || compareRunning) return
    if (isPaused) {
      setIsPaused(false)
      isPausedRef.current = false
      return
    }

    setIsGeneratingMazeCompare(true)
    setIsPaused(false)
    shouldStopRef.current = false
    isPausedRef.current = false

    await runMazeComparison(
      gridSize,
      shouldStopRef,
      isPausedRef,
      (grids) => {
        setMazeCompareGrids((prev: { [key: string]: Grid }) => ({ ...prev, ...grids }))
      },
      (newStart, newEnd) => {
        setStart(newStart)
        setEnd(newEnd)
      }
    )

    setIsGeneratingMazeCompare(false)
    setIsPaused(false)
    isPausedRef.current = false
  }, [gridSize, isPaused, isRunning, props, shouldStopRef, isPausedRef, setIsGeneratingMazeCompare, setIsPaused, setMazeCompareGrids, setStart, setEnd])

  const handleViewModeChange = useCallback((mode: 'single' | 'compare' | 'maze-compare') => {
    setViewMode(mode)
    if (mode === 'compare' && originalGrid) {
      const baseGrid = originalGrid.clone()
      setCompareGrids({
        'BFS': baseGrid.clone(),
        'DFS': baseGrid.clone(),
        'Dijkstra': baseGrid.clone(),
        'A*': baseGrid.clone(),
        'Flood-Fill': baseGrid.clone(),
        'Dead-End Filling': baseGrid.clone(),
      })
    } else if (mode === 'maze-compare') {
      const emptyGrid = new Grid(gridSize)
      setMazeCompareGrids({
        'Recursive Backtracking': emptyGrid.clone(),
        "Prim's Algorithm": emptyGrid.clone(),
        "Wilson's Algorithm": emptyGrid.clone(),
      })
    }
  }, [originalGrid, gridSize, setViewMode, setCompareGrids, setMazeCompareGrids])

  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size)
  }, [setGridSize])

  const handleGridSizeInputChange = useCallback((input: string) => {
    setGridSizeInput(input)
    const newSize = parseInt(input, 10)
    if (!isNaN(newSize) && newSize >= 5 && newSize <= 50) {
      setGridSize(newSize)
    }
  }, [setGridSizeInput, setGridSize])

  const handleGridSizeBlur = useCallback(() => {
    const newSize = parseInt(props.gridSizeInput, 10)
    if (isNaN(newSize) || newSize < 5 || newSize > 50) {
      setGridSizeInput(props.gridSize.toString())
    } else {
      setGridSize(newSize)
      setGridSizeInput(newSize.toString())
    }
  }, [props.gridSizeInput, props.gridSize, setGridSize, setGridSizeInput])

  const handleGenerateMaze = useCallback(async () => {
    const isGeneratingMaze = props.isGeneratingMaze ?? false
    if (isGeneratingMaze && !isPaused) return
    if (isPaused) {
      setIsPaused(false)
      isPausedRef.current = false
      return
    }

    setIsGeneratingMaze(true)
    setIsPaused(false)
    shouldStopRef.current = false
    isPausedRef.current = false

    if (viewMode === 'compare') {
      const baseGrid = new Grid(gridSize)
      const [newStart, newEnd] = baseGrid.generateRandomStartEnd()
      setStart(newStart)
      setEnd(newEnd)
      
      const generator = baseGrid.generatePerfectMazeVisualized(newStart, newEnd, mazeAlgorithm)
      const gridKeys = ['BFS', 'DFS', 'Dijkstra', 'A*', 'Flood-Fill', 'Dead-End Filling']
      const initialGrids: { [key: string]: Grid } = {}
      gridKeys.forEach(key => {
        initialGrids[key] = baseGrid.clone()
      })
      setCompareGrids(initialGrids)
      
      let stepCount = 0
      const updateFrequency = 3
      
      for (const _ of generator) {
        if (shouldStopRef.current) break
        while (isPausedRef.current && !shouldStopRef.current) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        if (shouldStopRef.current) break
        
        stepCount++
        if (stepCount % updateFrequency === 0) {
          const updatedGrids: { [key: string]: Grid } = {}
          gridKeys.forEach(key => {
            updatedGrids[key] = baseGrid.clone()
          })
          setCompareGrids(updatedGrids)
          await new Promise(resolve => requestAnimationFrame(resolve))
          await new Promise(resolve => setTimeout(resolve, animationSpeed))
        } else {
          await new Promise(resolve => setTimeout(resolve, animationSpeed / updateFrequency))
        }
      }

      baseGrid.setCell(newStart[0], newStart[1], CellType.Start)
      baseGrid.setCell(newEnd[0], newEnd[1], CellType.End)
      
      const finalGrids: { [key: string]: Grid } = {}
      gridKeys.forEach(key => {
        finalGrids[key] = baseGrid.clone()
      })
      setCompareGrids(finalGrids)
      setOriginalGrid(baseGrid.clone())
    } else {
      if (!start || !end || !grid) return

      const newGrid = new Grid(gridSize)
      const [newStart, newEnd] = newGrid.generateRandomStartEnd()
      setStart(newStart)
      setEnd(newEnd)
      
      const generator = newGrid.generatePerfectMazeVisualized(newStart, newEnd, mazeAlgorithm)
      
      for (const _ of generator) {
        if (shouldStopRef.current) break
        while (isPausedRef.current && !shouldStopRef.current) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        if (shouldStopRef.current) break
        
        setGrid(newGrid.clone())
        await new Promise(resolve => setTimeout(resolve, animationSpeed))
      }

      newGrid.setCell(newStart[0], newStart[1], CellType.Start)
      newGrid.setCell(newEnd[0], newEnd[1], CellType.End)
      setGrid(newGrid.clone())
      setOriginalGrid(newGrid.clone())
    }

    setIsGeneratingMaze(false)
    setIsPaused(false)
    isPausedRef.current = false
    setHasRunAlgorithm(false)
  }, [viewMode, gridSize, mazeAlgorithm, isPaused, start, end, grid, shouldStopRef, isPausedRef, animationSpeed, props, setIsGeneratingMaze, setIsPaused, setStart, setEnd, setGrid, setOriginalGrid, setCompareGrids, setHasRunAlgorithm])

  return {
    runSingleAlgorithmWrapper,
    resetGrid,
    togglePause,
    runComparisonWrapper,
    runMazeComparisonWrapper,
    handleViewModeChange,
    handleGridSizeChange,
    handleGridSizeInputChange,
    handleGridSizeBlur,
    handleGenerateMaze,
  }
}

