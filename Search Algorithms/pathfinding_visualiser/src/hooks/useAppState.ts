import { useState, useEffect, useCallback } from 'react'
import { Grid } from '../algorithms/grid'
import { createNewGrid } from '../utils/mazeGeneration'

export function useAppState() {
  const [grid, setGrid] = useState<Grid | null>(null)
  const [originalGrid, setOriginalGrid] = useState<Grid | null>(null)
  const [start, setStart] = useState<[number, number] | null>(null)
  const [end, setEnd] = useState<[number, number] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [hasRunAlgorithm, setHasRunAlgorithm] = useState(false)
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string | null>(null)
  const [mazeMode, setMazeMode] = useState<'multiple-paths' | 'perfect-maze' | 'open-grid'>('multiple-paths')
  const [mazeAlgorithm, setMazeAlgorithm] = useState<'recursive-backtracking' | 'prims' | 'wilsons'>('recursive-backtracking')
  const [viewMode, setViewMode] = useState<'single' | 'compare' | 'maze-compare'>('single')
  const [compareGrids, setCompareGrids] = useState<{ [key: string]: Grid }>({})
  const [compareRunning, setCompareRunning] = useState(false)
  const [isGeneratingMaze, setIsGeneratingMaze] = useState(false)
  const [algorithmSteps, setAlgorithmSteps] = useState<{ [key: string]: number }>({})
  const [algorithmPaths, setAlgorithmPaths] = useState<{ [key: string]: [number, number][] | null }>({})
  const [algorithmSolved, setAlgorithmSolved] = useState<{ [key: string]: boolean }>({})
  const [firstFinishedAlgorithm, setFirstFinishedAlgorithm] = useState<string | null>(null)
  const [gridSize, setGridSize] = useState(25)
  const [gridSizeInput, setGridSizeInput] = useState('25')
  const [mazeCompareGrids, setMazeCompareGrids] = useState<{ [key: string]: Grid }>({})
  const [isGeneratingMazeCompare, setIsGeneratingMazeCompare] = useState(false)
  const [singleViewSteps, setSingleViewSteps] = useState(0)
  const [singleViewPath, setSingleViewPath] = useState<[number, number][] | null>(null)
  const [singleViewSolved, setSingleViewSolved] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const wallDensity = 0.3
  const animationSpeed = 30

  const createNewGridCallback = useCallback(() => {
    return createNewGrid({
      gridSize,
      mazeMode,
      mazeAlgorithm,
      wallDensity,
    })
  }, [mazeMode, gridSize, wallDensity, mazeAlgorithm])

  useEffect(() => {
    setGridSizeInput(gridSize.toString())
  }, [gridSize])

  useEffect(() => {
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
    }
  }, [createNewGridCallback, viewMode, gridSize])

  return {
    // State
    grid,
    originalGrid,
    start,
    end,
    isRunning,
    isPaused,
    hasRunAlgorithm,
    currentAlgorithm,
    mazeMode,
    mazeAlgorithm,
    viewMode,
    compareGrids,
    compareRunning,
    isGeneratingMaze,
    algorithmSteps,
    algorithmPaths,
    algorithmSolved,
    firstFinishedAlgorithm,
    gridSize,
    gridSizeInput,
    mazeCompareGrids,
    isGeneratingMazeCompare,
    singleViewSteps,
    singleViewPath,
    singleViewSolved,
    windowSize,
    // Setters
    setGrid,
    setOriginalGrid,
    setStart,
    setEnd,
    setIsRunning,
    setIsPaused,
    setHasRunAlgorithm,
    setCurrentAlgorithm,
    setMazeMode,
    setMazeAlgorithm,
    setViewMode,
    setCompareGrids,
    setCompareRunning,
    setIsGeneratingMaze,
    setAlgorithmSteps,
    setAlgorithmPaths,
    setAlgorithmSolved,
    setFirstFinishedAlgorithm,
    setGridSize,
    setGridSizeInput,
    setMazeCompareGrids,
    setIsGeneratingMazeCompare,
    setSingleViewSteps,
    setSingleViewPath,
    setSingleViewSolved,
    // Constants
    wallDensity,
    animationSpeed,
    createNewGridCallback,
  }
}

