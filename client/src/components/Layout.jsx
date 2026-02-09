import { Outlet } from 'react-router-dom'
import Header from './Header'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <>
      <div className={styles.floatingBlobs} aria-hidden>
        <div className={styles.blob} />
        <div className={styles.blob} />
        <div className={styles.blob} />
        <div className={styles.blob} />
      </div>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  )
}
