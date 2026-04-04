'use client'

import { useState, useCallback } from 'react'
import { AppError } from '../error/AppError'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: AppError | null
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: AppError) => void
  showError?: boolean
}

export function useApi<T>(options: UseApiOptions = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (fn: () => Promise<T>) => {
      setState({ data: null, loading: true, error: null })
      try {
        const result = await fn()
        setState({ data: result, loading: false, error: null })
        options.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof AppError ? err : new AppError('Unknown error', 500)
        setState({ data: null, loading: false, error })
        options.onError?.(error)
        throw error
      }
    },
    [options]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
