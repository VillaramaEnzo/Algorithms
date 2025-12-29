import { useRef } from 'react'

export function useAlgorithmExecution() {
  const shouldStopRef = useRef(false)
  const isPausedRef = useRef(false)

  return {
    shouldStopRef,
    isPausedRef,
  }
}

