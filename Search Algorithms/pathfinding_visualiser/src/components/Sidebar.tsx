import { Grid } from '../algorithms/grid'

interface SidebarProps {
  viewMode: 'single' | 'compare' | 'maze-compare'
  gridSize: number
  gridSizeInput: string
  mazeMode: 'multiple-paths' | 'perfect-maze' | 'open-grid'
  mazeAlgorithm: 'recursive-backtracking' | 'prims' | 'wilsons'
  isRunning: boolean
  compareRunning: boolean
  isGeneratingMaze: boolean
  isGeneratingMazeCompare: boolean
  isPaused: boolean
  currentAlgorithm: string | null
  originalGrid: Grid | null
  onViewModeChange: (mode: 'single' | 'compare' | 'maze-compare') => void
  onGridSizeChange: (size: number) => void
  onGridSizeInputChange: (input: string) => void
  onGridSizeBlur: () => void
  onMazeModeChange: (mode: 'multiple-paths' | 'perfect-maze' | 'open-grid') => void
  onMazeAlgorithmChange: (algorithm: 'recursive-backtracking' | 'prims' | 'wilsons') => void
  onRunBFS: () => void
  onRunDFS: () => void
  onRunDijkstra: () => void
  onRunAStar: () => void
  onRunFloodFill: () => void
  onRunDeadEndFilling: () => void
  onRunComparison: () => void
  onRunMazeComparison: () => void
  onGenerateMaze: () => void
  setCompareGrids: (grids: { [key: string]: Grid }) => void
  setMazeCompareGrids: (grids: { [key: string]: Grid }) => void
  gridSizeState: number
}

export default function Sidebar({
  viewMode,
  gridSizeInput,
  mazeMode,
  mazeAlgorithm,
  isRunning,
  compareRunning,
  isGeneratingMaze,
  isGeneratingMazeCompare,
  isPaused,
  currentAlgorithm,
  originalGrid,
  onViewModeChange,
  onGridSizeChange,
  onGridSizeInputChange,
  onGridSizeBlur,
  onMazeModeChange,
  onMazeAlgorithmChange,
  onRunBFS,
  onRunDFS,
  onRunDijkstra,
  onRunAStar,
  onRunFloodFill,
  onRunDeadEndFilling,
  onRunComparison,
  onRunMazeComparison,
  onGenerateMaze,
  setCompareGrids,
  setMazeCompareGrids,
  gridSizeState,
}: SidebarProps) {
  const handleViewModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as 'single' | 'compare' | 'maze-compare'
    onViewModeChange(newMode)
    
    if (newMode === 'compare') {
      // Initialize comparison grids
      if (originalGrid) {
        const baseGrid = originalGrid.clone()
        setCompareGrids({
          'BFS': baseGrid.clone(),
          'DFS': baseGrid.clone(),
          'Dijkstra': baseGrid.clone(),
          'A*': baseGrid.clone(),
          'Flood-Fill': baseGrid.clone(),
          'Dead-End Filling': baseGrid.clone(),
        })
      }
    } else if (newMode === 'maze-compare') {
      // Initialize maze comparison grids
      const emptyGrid = new Grid(gridSizeState)
      setMazeCompareGrids({
        'Recursive Backtracking': emptyGrid.clone(),
        "Prim's Algorithm": emptyGrid.clone(),
        "Wilson's Algorithm": emptyGrid.clone(),
      })
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Pathfinding Visualizer</h1>
      </div>
      <div className="controls">
        <div className="view-mode-selector">
          <label>View Mode:</label>
          <select 
            value={viewMode} 
            onChange={handleViewModeChange}
            disabled={isRunning || compareRunning || isGeneratingMaze || isGeneratingMazeCompare}
            className="view-mode-select"
          >
            <option value="single">Single View</option>
            <option value="compare">Compare All</option>
            <option value="maze-compare">Compare Maze Generation</option>
          </select>
        </div>
        <div className="grid-size-selector">
          <label>Grid Size (N×N):</label>
          <input
            type="number"
            min="5"
            max="50"
            value={gridSizeInput}
            onChange={(e) => {
              const value = e.target.value
              onGridSizeInputChange(value)
              const newSize = parseInt(value, 10)
              if (!isNaN(newSize) && newSize >= 5 && newSize <= 50) {
                onGridSizeChange(newSize)
              }
            }}
            onBlur={onGridSizeBlur}
            disabled={isRunning || compareRunning || isGeneratingMaze || isGeneratingMazeCompare}
            className="grid-size-input"
          />
        </div>
        <div className="maze-mode-selector">
          <label>Maze Mode:</label>
          <select 
            value={mazeMode} 
            onChange={(e) => onMazeModeChange(e.target.value as 'multiple-paths' | 'perfect-maze' | 'open-grid')}
            disabled={isRunning || compareRunning || isGeneratingMaze || isGeneratingMazeCompare || viewMode === 'maze-compare'}
            className="maze-mode-select"
          >
            <option value="multiple-paths">Multiple Paths</option>
            <option value="perfect-maze">Perfect Maze</option>
            <option value="open-grid">Open Grid</option>
          </select>
        </div>
        {mazeMode === 'perfect-maze' && viewMode !== 'maze-compare' && (
          <>
            <div className="maze-algorithm-selector">
              <label>Maze Algorithm:</label>
              <select 
                value={mazeAlgorithm} 
                onChange={(e) => onMazeAlgorithmChange(e.target.value as 'recursive-backtracking' | 'prims' | 'wilsons')}
                disabled={isRunning || compareRunning || isGeneratingMaze || isGeneratingMazeCompare}
                className="maze-mode-select"
              >
                <option value="recursive-backtracking">Recursive Backtracking</option>
                <option value="prims">Prim's Algorithm</option>
                <option value="wilsons">Wilson's Algorithm</option>
              </select>
            </div>
            <button 
              onClick={onGenerateMaze}
              disabled={isRunning || compareRunning || (isGeneratingMaze && !isPaused) || isGeneratingMazeCompare}
              className="btn-generate-maze"
            >
              {isGeneratingMaze && !isPaused ? 'Generating...' : isGeneratingMaze && isPaused ? 'Paused' : 'Visualise Maze Generation'}
            </button>
          </>
        )}
        {viewMode === 'compare' ? (
          <button 
            onClick={onRunComparison} 
            disabled={(compareRunning && !isPaused) || isGeneratingMaze} 
            className="btn-compare"
          >
            {compareRunning && !isPaused ? 'Running...' : compareRunning && isPaused ? 'Paused' : 'Run All Algorithms'}
          </button>
        ) : viewMode === 'maze-compare' ? (
          <button 
            onClick={onRunMazeComparison} 
            disabled={(isGeneratingMazeCompare && !isPaused) || isRunning || compareRunning} 
            className="btn-compare"
          >
            {isGeneratingMazeCompare && !isPaused ? 'Generating...' : isGeneratingMazeCompare && isPaused ? 'Paused' : 'Generate All Mazes'}
          </button>
        ) : (
          <>
            <button onClick={onRunBFS} disabled={isRunning} className="btn-bfs">
              {isRunning && currentAlgorithm === 'BFS' ? 'Running...' : 'Run BFS'}
            </button>
            <button onClick={onRunDFS} disabled={isRunning} className="btn-dfs">
              {isRunning && currentAlgorithm === 'DFS' ? 'Running...' : 'Run DFS'}
            </button>
            <button onClick={onRunDijkstra} disabled={isRunning} className="btn-dijkstra">
              {isRunning && currentAlgorithm === 'Dijkstra' ? 'Running...' : 'Run Dijkstra'}
            </button>
            <button onClick={onRunAStar} disabled={isRunning} className="btn-astar">
              {isRunning && currentAlgorithm === 'A*' ? 'Running...' : 'Run A*'}
            </button>
            <button onClick={onRunFloodFill} disabled={isRunning} className="btn-floodfill">
              {isRunning && currentAlgorithm === 'Flood-Fill' ? 'Running...' : 'Run Flood-Fill'}
            </button>
            <button onClick={onRunDeadEndFilling} disabled={isRunning} className="btn-deadend">
              {isRunning && currentAlgorithm === 'Dead-End Filling' ? 'Running...' : 'Run Dead-End Filling'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

