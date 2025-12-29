import { Grid } from '../algorithms/grid'
import GridVisualizer from './GridVisualizer'

interface MazeCompareViewProps {
  mazeCompareGrids: { [key: string]: Grid }
  mazeCompareCellSize: number
  isGeneratingMazeCompare: boolean
  isPaused: boolean
  onReset: () => void
  onTogglePause: () => void
}

export default function MazeCompareView({
  mazeCompareGrids,
  mazeCompareCellSize,
  isGeneratingMazeCompare,
  isPaused,
  onReset,
  onTogglePause,
}: MazeCompareViewProps) {
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
        {isGeneratingMazeCompare && (
          <button 
            onClick={onTogglePause} 
            className="pause-icon-btn"
            title="Pause/Resume (Space)"
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
      <div className="maze-compare-grid-container">
        {Object.entries(mazeCompareGrids).map(([name, grid]) => (
          <div key={name} className="maze-compare-grid-item">
            <div className="compare-algorithm-header">
              <div className="compare-algorithm-title">{name}</div>
            </div>
            <GridVisualizer grid={grid} cellSize={mazeCompareCellSize} />
          </div>
        ))}
      </div>
    </div>
  )
}

