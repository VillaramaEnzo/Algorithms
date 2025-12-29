import SingleView from './components/SingleView'
import CompareView from './components/CompareView'
import MazeCompareView from './components/MazeCompareView'
import Sidebar from './components/Sidebar'
import { useCellSizes } from './hooks/useCellSizes'
import { useAlgorithmExecution } from './hooks/useAlgorithmExecution'
import { useAppState } from './hooks/useAppState'
import { useAppHandlers } from './hooks/useAppHandlers'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './App.css'

function App() {
  const state = useAppState()
  const { shouldStopRef, isPausedRef } = useAlgorithmExecution()
  
  const { compareCellSize, singleCellSize, mazeCompareCellSize } = useCellSizes({
    viewMode: state.viewMode,
    gridSize: state.gridSize,
    windowSize: state.windowSize,
  })

  const handlers = useAppHandlers({
    ...state,
    shouldStopRef,
    isPausedRef,
  })

  useKeyboardShortcuts({
    isRunning: state.isRunning,
    compareRunning: state.compareRunning,
    isGeneratingMaze: state.isGeneratingMaze,
    isGeneratingMazeCompare: state.isGeneratingMazeCompare,
    onTogglePause: handlers.togglePause,
  })

  return (
    <div className="app">
      <Sidebar
        viewMode={state.viewMode}
        gridSize={state.gridSize}
        gridSizeInput={state.gridSizeInput}
        mazeMode={state.mazeMode}
        mazeAlgorithm={state.mazeAlgorithm}
        isRunning={state.isRunning}
        compareRunning={state.compareRunning}
        isGeneratingMaze={state.isGeneratingMaze}
        isGeneratingMazeCompare={state.isGeneratingMazeCompare}
        isPaused={state.isPaused}
        currentAlgorithm={state.currentAlgorithm}
        originalGrid={state.originalGrid}
        onViewModeChange={handlers.handleViewModeChange}
        onGridSizeChange={handlers.handleGridSizeChange}
        onGridSizeInputChange={handlers.handleGridSizeInputChange}
        onGridSizeBlur={handlers.handleGridSizeBlur}
        onMazeModeChange={state.setMazeMode}
        onMazeAlgorithmChange={state.setMazeAlgorithm}
        onRunBFS={() => handlers.runSingleAlgorithmWrapper('BFS')}
        onRunDFS={() => handlers.runSingleAlgorithmWrapper('DFS')}
        onRunDijkstra={() => handlers.runSingleAlgorithmWrapper('Dijkstra')}
        onRunAStar={() => handlers.runSingleAlgorithmWrapper('A*')}
        onRunFloodFill={() => handlers.runSingleAlgorithmWrapper('Flood-Fill')}
        onRunDeadEndFilling={() => handlers.runSingleAlgorithmWrapper('Dead-End Filling')}
        onRunComparison={handlers.runComparisonWrapper}
        onRunMazeComparison={handlers.runMazeComparisonWrapper}
        onGenerateMaze={handlers.handleGenerateMaze}
        setCompareGrids={state.setCompareGrids}
        setMazeCompareGrids={state.setMazeCompareGrids}
        gridSizeState={state.gridSize}
      />
      {state.viewMode === 'compare' ? (
        <CompareView
          compareGrids={state.compareGrids}
          algorithmSteps={state.algorithmSteps}
          algorithmPaths={state.algorithmPaths}
          algorithmSolved={state.algorithmSolved}
          firstFinishedAlgorithm={state.firstFinishedAlgorithm}
          compareCellSize={compareCellSize}
          compareRunning={state.compareRunning}
          isPaused={state.isPaused}
          onReset={handlers.resetGrid}
          onTogglePause={handlers.togglePause}
        />
      ) : state.viewMode === 'maze-compare' ? (
        <MazeCompareView
          mazeCompareGrids={state.mazeCompareGrids}
          mazeCompareCellSize={mazeCompareCellSize}
          isGeneratingMazeCompare={state.isGeneratingMazeCompare}
          isPaused={state.isPaused}
          onReset={handlers.resetGrid}
          onTogglePause={handlers.togglePause}
        />
      ) : (
        <SingleView
          grid={state.grid}
          currentAlgorithm={state.currentAlgorithm}
          singleViewSteps={state.singleViewSteps}
          singleViewPath={state.singleViewPath}
          singleViewSolved={state.singleViewSolved}
          singleCellSize={singleCellSize}
          isRunning={state.isRunning}
          isPaused={state.isPaused}
          onReset={handlers.resetGrid}
          onTogglePause={handlers.togglePause}
        />
      )}
    </div>
  )
}

export default App
