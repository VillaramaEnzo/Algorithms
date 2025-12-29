import { Grid, CellType } from '../algorithms/grid'
import GridVisualizer from './GridVisualizer'

interface SingleViewProps {
  grid: Grid | null
  currentAlgorithm: string | null
  singleViewSteps: number
  singleViewPath: [number, number][] | null
  singleViewSolved: boolean
  singleCellSize: number
  isRunning: boolean
  isPaused: boolean
  onReset: () => void
  onTogglePause: () => void
}

export default function SingleView({
  grid,
  currentAlgorithm,
  singleViewSteps,
  singleViewPath,
  singleViewSolved,
  singleCellSize,
  isRunning,
  isPaused,
  onReset,
  onTogglePause,
}: SingleViewProps) {
  return (
    <div className="content">
      {currentAlgorithm && (
        <div className="algorithm-title">
          <h2>{currentAlgorithm}</h2>
          <div className="single-view-stats">
            <div className="single-view-steps">
              Steps: {singleViewSteps}
            </div>
            {singleViewSolved && (
              <>
                <div className="single-view-solved">Solved</div>
                {singleViewPath && singleViewPath.length > 0 && (
                  <div className="single-view-path-length">
                    Path: {singleViewPath.length} cells
                  </div>
                )}
                {!singleViewPath && currentAlgorithm === 'Dead-End Filling' && grid && (
                  <div className="single-view-path-length">
                    Path: {(() => {
                      const gridData = grid.getGrid()
                      let pathLength = 0
                      for (let row = 0; row < grid.getSize(); row++) {
                        for (let col = 0; col < grid.getSize(); col++) {
                          if (gridData[row][col] === CellType.Path) {
                            pathLength++
                          }
                        }
                      }
                      return pathLength
                    })()} cells
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <div className="top-controls">
        <button 
          onClick={onReset} 
          className="reset-icon-btn"
          title="Reset Grid"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
        {isRunning && (
          <button 
            onClick={onTogglePause} 
            className="pause-icon-btn"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            ) : (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            )}
          </button>
        )}
      </div>
      {grid && <GridVisualizer grid={grid} cellSize={singleCellSize} />}
    </div>
  )
}

