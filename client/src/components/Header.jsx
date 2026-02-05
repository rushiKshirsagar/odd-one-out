import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CategoryIcon from './CategoryIcon'
import styles from './Header.module.css'

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/browse', label: 'Browse' },
  { path: '/list', label: 'List item' },
  { path: '/about', label: 'About us' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/'

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isHome ? styles.home : ''}`}
    >
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}><CategoryIcon category="shoe" size={22} /></span>
        <span className={styles.logoText}>Odd One Out</span>
      </Link>
      <nav className={styles.nav}>
        {NAV.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={location.pathname === path ? styles.active : ''}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
