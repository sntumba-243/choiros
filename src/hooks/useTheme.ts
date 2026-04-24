import { useState, useEffect } from 'react'

export type Theme = 'classic' | 'gospel' | 'midnight' | 'forest' | 'mono'

const STORAGE_KEY = 'choiros-theme'
const DEFAULT_THEME: Theme = 'classic'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    return stored || DEFAULT_THEME
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function setTheme(t: Theme) {
    setThemeState(t)
  }

  return { theme, setTheme }
}
