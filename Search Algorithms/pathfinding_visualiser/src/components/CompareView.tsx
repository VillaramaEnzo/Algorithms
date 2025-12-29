import { Grid, CellType } from '../algorithms/grid'
import GridVisualizer from './GridVisualizer'

interface CompareViewProps {
  compareGrids: { [key: string]: Grid }
  algorithmSteps: { [key: string]: number }
  algorithmPaths: { [key: string]: [number, number][] | null }
  algorithmSolved: { [key: string]: boolean }
  firstFinishedAlgorithm: string | null
  compareCellSize: number
  compareRunning: boolean
  isPaused: boolean
  onReset: () => void
  onTogglePause: () => void
}

export default function CompareView({
  compareGrids,
  algorithmSteps,
  algorithmPaths,
  algorithmSolved,
  firstFinishedAlgorithm,
  compareCellSize,
  compareRunning,
  isPaused,
  onReset,
  onTogglePause,
}: CompareViewProps) {
  return (
    <div className="compare-content">
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
        {compareRunning && (
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
      <div className="compare-grid-container">
        {Object.entries(compareGrids).map(([name, grid]) => {
          const path = algorithmPaths[name]
          let pathLength = 0
          
          // Calculate path length
          if (path) {
            pathLength = path.length
          } else if (algorithmSolved[name] && name === 'Dead-End Filling') {
            // For Dead-End Filling, count path cells on the grid
            const gridData = grid.getGrid()
            for (let row = 0; row < grid.getSize(); row++) {
              for (let col = 0; col < grid.getSize(); col++) {
                if (gridData[row][col] === CellType.Path) {
                  pathLength++
                }
              }
            }
          }
          
          const isSolved = algorithmSolved[name] || false
          const isWinner = firstFinishedAlgorithm === name
          
          return (
            <div key={name} className={`compare-grid-item ${isWinner ? 'compare-winner' : ''}`}>
              <div className="compare-algorithm-header">
                <div className={`compare-algorithm-title ${isWinner ? 'compare-winner-title' : ''}`}>
                  {name}
                  {isWinner && <span className="winner-badge">Winner!</span>}
                </div>
                <div className="compare-algorithm-steps">
                  Steps: {algorithmSteps[name] || 0}
                </div>
              </div>
              <div className="compare-algorithm-status">
                {isSolved && (
                  <div className="compare-solved-text">Solved</div>
                )}
                {isSolved && pathLength > 0 && (
                  <div className="compare-path-length">
                    Path: {pathLength} cells
                  </div>
                )}
              </div>
              <GridVisualizer grid={grid} cellSize={compareCellSize} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

