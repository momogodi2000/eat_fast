import { useEffect, useState, useCallback } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('eat-fast-theme')
    if (savedTheme) {
      return savedTheme
    }
    
    // Fall back to system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    return 'light'
  })

  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Add current theme class
    root.classList.add(theme)
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#FF6B35')
    }
    
    // Save to localStorage
    localStorage.setItem('eat-fast-theme', theme)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)
      
      // Auto-switch if user hasn't manually set a theme
      const savedTheme = localStorage.getItem('eat-fast-theme')
      if (!savedTheme) {
        setTheme(newSystemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark'
      return newTheme
    })
  }, [])

  const setThemeManually = useCallback((newTheme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      if (newTheme === 'system') {
        setTheme(systemTheme)
        localStorage.removeItem('eat-fast-theme')
      } else {
        setTheme(newTheme)
      }
    }
  }, [systemTheme])

  return { 
    theme, 
    systemTheme,
    toggleTheme, 
    setTheme: setThemeManually,
    isSystemTheme: !localStorage.getItem('eat-fast-theme')
  }
}
