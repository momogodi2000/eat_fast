import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return { theme, toggleTheme: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) }
}
