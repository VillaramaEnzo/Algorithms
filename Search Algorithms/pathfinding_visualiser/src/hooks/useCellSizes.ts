import { useMemo } from 'react'

interface WindowSize {
  width: number
  height: number
}

interface UseCellSizesProps {
  viewMode: 'single' | 'compare' | 'maze-compare'
  gridSize: number
  windowSize: WindowSize
}

export function useCellSizes({ viewMode, gridSize, windowSize }: UseCellSizesProps) {
  // Calculate cell size for comparison mode based on available viewport space
  const compareCellSize = useMemo(() => {
    if (viewMode !== 'compare') return 15 // Default, won't be used
    
    // Available space: viewport width minus sidebar (20vw) minus padding
    // For 3 columns, each grid gets roughly 1/3 of the width
    // Account for: container padding (10px * 2 = 20px), grid gap (10px * 2 = 20px between 3 items), 
    // item padding (10px * 2 = 20px), grid-container padding (5px * 2 = 10px), grid padding (2px * 2 = 4px)
    const containerPadding = 20 // 10px * 2
    const gridGap = 20 // 10px between 3 items (2 gaps)
    const itemPadding = 20 // 10px * 2
    const gridContainerPadding = 10 // 5px * 2
    const gridPadding = 4 // 2px * 2
    
    const availableWidth = (windowSize.width * 0.8) - containerPadding
    const gridWidth = (availableWidth / 3) - gridGap - itemPadding - gridContainerPadding - gridPadding
    
    // Available height: viewport height minus controls and padding
    // For 2 rows, each grid gets roughly 1/2 of the height
    // Account for: top controls (~60px), container padding (10px * 2 = 20px), grid gap (10px between rows),
    // item padding (10px * 2 = 20px), title space (~30px), grid-container padding (5px * 2 = 10px), grid padding (2px * 2 = 4px)
    const topControls = 60
    const titleSpace = 30
    const rowGap = 10 // Gap between 2 rows
    
    const availableHeight = windowSize.height - topControls
    const gridHeight = (availableHeight / 2) - containerPadding - rowGap - itemPadding - titleSpace - gridContainerPadding - gridPadding
    
    // Calculate cell size based on grid size and available space
    // Use the smaller dimension to ensure it fits, and subtract a small buffer for safety
    const maxCellSizeByWidth = Math.floor(gridWidth / gridSize) - 1
    const maxCellSizeByHeight = Math.floor(gridHeight / gridSize) - 1
    
    return Math.max(5, Math.min(maxCellSizeByWidth, maxCellSizeByHeight))
  }, [viewMode, gridSize, windowSize])

  // Calculate cell size for single view mode
  const singleCellSize = useMemo(() => {
    if (viewMode !== 'single') return 25 // Default, won't be used
    
    // Available space: viewport width minus sidebar (20vw) minus padding
    const availableWidth = (windowSize.width * 0.8) - 80
    const availableHeight = windowSize.height - 120
    
    // Calculate cell size based on grid size and available space
    const maxCellSizeByWidth = Math.floor(availableWidth / gridSize)
    const maxCellSizeByHeight = Math.floor(availableHeight / gridSize)
    
    return Math.max(10, Math.min(maxCellSizeByWidth, maxCellSizeByHeight, 30)) // Cap at 30px for readability
  }, [viewMode, gridSize, windowSize])

  // Calculate cell size for maze-compare mode (3x1 grid - 3 columns, 1 row)
  const mazeCompareCellSize = useMemo(() => {
    if (viewMode !== 'maze-compare') return 0

    // Account for sidebar (250px), container padding (40px total), gaps between grids (30px for 2 gaps)
    const availableWidth = windowSize.width - 250 - 40 - 30
    // Account for top controls (60px), container padding (40px), title space (30px)
    const availableHeight = windowSize.height - 60 - 40 - 30
    
    // Each grid gets 1/3 of the available width
    const gridWidth = availableWidth / 3
    const gridHeight = availableHeight
    
    // Calculate cell size based on grid size and available space per grid
    // Subtract a small buffer for grid padding
    const maxCellSizeByWidth = Math.floor((gridWidth - 20) / gridSize) // 20px for item padding
    const maxCellSizeByHeight = Math.floor((gridHeight - 20) / gridSize) // 20px for item padding

    // Use the smaller of the two to ensure grid fits completely, with a minimum size
    return Math.max(3, Math.min(maxCellSizeByWidth, maxCellSizeByHeight))
  }, [viewMode, gridSize, windowSize])

  return {
    compareCellSize,
    singleCellSize,
    mazeCompareCellSize,
  }
}

