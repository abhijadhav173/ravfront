'use client'

import { useEffect, useState, useCallback } from 'react'

export interface UseScrollPosition {
  x: number
  y: number
}

export function useScroll() {
  const [position, setPosition] = useState<UseScrollPosition>({ x: 0, y: 0 })
  const [isScrolling, setIsScrolling] = useState(false)

  let scrollTimeout: NodeJS.Timeout

  const handleScroll = useCallback(() => {
    setPosition({
      x: window.scrollX,
      y: window.scrollY,
    })
    setIsScrolling(true)

    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      setIsScrolling(false)
    }, 150)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [handleScroll])

  return {
    position,
    isScrolling,
  }
}

export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return scrollToTop
}
