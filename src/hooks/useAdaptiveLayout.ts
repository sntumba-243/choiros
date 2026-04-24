import { useState, useEffect } from 'react'

export type SizeClass = 'compact' | 'regular' | 'expanded'

function getSizeClass(width: number): SizeClass {
  if (width < 640) return 'compact'
  if (width < 1024) return 'regular'
  return 'expanded'
}

export function useAdaptiveLayout(): SizeClass {
  const [sizeClass, setSizeClass] = useState<SizeClass>(() =>
    getSizeClass(typeof window !== 'undefined' ? window.innerWidth : 1024),
  )

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    function handleResize() {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        setSizeClass(getSizeClass(window.innerWidth))
      }, 250)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeout)
    }
  }, [])

  return sizeClass
}
