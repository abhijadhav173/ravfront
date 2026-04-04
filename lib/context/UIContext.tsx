'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface UIContextType {
  toasts: Toast[]
  addToast: (message: string, type: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  isMenuOpen: boolean
  setMenuOpen: (open: boolean) => void
  isDarkMode: boolean
  setDarkMode: (dark: boolean) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isDarkMode, setDarkMode] = useState(false)

  const addToast = useCallback((message: string, type: Toast['type'], duration?: number) => {
    const id = Math.random().toString(36).slice(2, 11)
    const newToast: Toast = { id, message, type, duration }
    setToasts((prev) => [...prev, newToast])

    if (duration) {
      setTimeout(() => removeToast(id), duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <UIContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        clearToasts,
        isMenuOpen,
        setMenuOpen,
        isDarkMode,
        setDarkMode,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUIContext() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider')
  }
  return context
}

export function useToast() {
  const { addToast } = useUIContext()

  return {
    success: (message: string, duration = 3000) => addToast(message, 'success', duration),
    error: (message: string, duration = 5000) => addToast(message, 'error', duration),
    warning: (message: string, duration = 4000) => addToast(message, 'warning', duration),
    info: (message: string, duration = 3000) => addToast(message, 'info', duration),
  }
}
