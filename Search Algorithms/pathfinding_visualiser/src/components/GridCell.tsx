import { CellType } from '../algorithms/grid'
import './GridCell.css'

interface GridCellProps {
  cellType: CellType
  size: number
  visitCount?: number
}

export default function GridCell({ cellType, size, visitCount = 0 }: GridCellProps) {
  const getCellClass = () => {
    switch (cellType) {
      case CellType.Wall:
        return 'cell wall'
      case CellType.Start:
        return 'cell start'
      case CellType.End:
        return 'cell end'
      case CellType.Visited:
        // Add visit count class for darker colors
        if (visitCount > 0) {
          const visitLevel = Math.min(visitCount, 5) // Cap at 5 levels
          return `cell visited visited-${visitLevel}`
        }
        return 'cell visited'
      case CellType.Path:
        return 'cell path'
      case CellType.FilledDeadEnd:
        return 'cell filled-dead-end'
      default:
        return 'cell empty'
    }
  }

  return (
    <div
      className={getCellClass()}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  )
}

