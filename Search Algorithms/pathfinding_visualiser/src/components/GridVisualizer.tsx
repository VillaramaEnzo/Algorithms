import { Grid } from '../algorithms/grid'
import GridCell from './GridCell'
import './GridVisualizer.css'

interface GridVisualizerProps {
  grid: Grid
  cellSize?: number
}

export default function GridVisualizer({ grid, cellSize = 20 }: GridVisualizerProps) {
  const gridSize = grid.getSize()
  const gridData = grid.getGrid()
  const visitCounts = grid.getVisitCounts()

  return (
    <div className="grid-container">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        }}
      >
        {gridData.map((row, rowIndex) =>
          row.map((cellType, colIndex) => (
            <GridCell
              key={`${rowIndex}-${colIndex}`}
              cellType={cellType}
              size={cellSize}
              visitCount={visitCounts[rowIndex][colIndex]}
            />
          ))
        )}
      </div>
    </div>
  )
}

