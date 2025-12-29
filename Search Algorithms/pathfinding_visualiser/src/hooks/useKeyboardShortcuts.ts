import { useEffect } from 'react'

interface UseKeyboardShortcutsProps {
  isRunning: boolean
  compareRunning: boolean
  isGeneratingMaze: boolean
  isGeneratingMazeCompare: boolean
  onTogglePause: () => void
}

export function useKeyboardShortcuts({
  isRunning,
  compareRunning,
  isGeneratingMaze,
  isGeneratingMazeCompare,
  onTogglePause,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && (isRunning || compareRunning || isGeneratingMaze || isGeneratingMazeCompare)) {
        event.preventDefault()
        onTogglePause()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, compareRunning, isGeneratingMaze, isGeneratingMazeCompare, onTogglePause])
}

