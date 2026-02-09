import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon'
import styles from './Home.module.css'

const HERO_CATEGORIES = ['sock', 'shoe', 'glove', 'earbud', 'earring', 'chopstick', 'slipper', 'controller']

const ONE_LINERS = [
  "Yes, we're a whole website for your lonely sock. No, we're not judging.",
  "We're the Tinder for things that lost their other half.",
  "We built a marketplace for single socks. Our parents are very proud.",
  "Your drawer called. It said to list the odd one out.",
  "Pairs are overrated. So are matching socks. We're here for both.",
  "This site exists because someone had to. That someone was us.",
  "Your lone chopstick has been waiting. Give it a second life.",
  "We don't ask why you have one slipper. We just help you move on.",
  "Somewhere out there, your sock's soulmate is listed. Probably.",
]

export default function Home() {
  const [oneLiner, setOneLiner] = useState(ONE_LINERS[0])

  useEffect(() => {
    const i = Math.floor(Math.random() * ONE_LINERS.length)
    setOneLiner(ONE_LINERS[i])
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.tagline}>The marketplace for the other one.</p>
        <h1 className={styles.title}>
          Lost one?<br />
          We’ve got the one that stayed.
        </h1>
        <p className={styles.subtitle}>
          Socks, shoes, gloves, earrings, chopsticks, cufflinks, slippers & more. List your lone half. Buy someone else’s. No judgement.
        </p>
        <p className={styles.oneLiner} role="complementary">
          {oneLiner}
        </p>
        <div className={styles.examples} aria-hidden>
          {HERO_CATEGORIES.map((cat) => (
            <CategoryIcon key={cat} category={cat} size={28} className={styles.exampleIcon} />
          ))}
        </div>
        <div className={styles.cta}>
          <Link to="/browse" className={styles.primary}>
            Browse items
          </Link>
          <Link to="/list" className={styles.secondary}>
            List your orphan
          </Link>
        </div>
      </section>

      <section className={styles.how}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNum}>1</span>
            <h3>Clean it.</h3>
            <p>Wash socks, wipe earbuds, dust off that single glove or chopstick. Items must be clean before listing.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>2</span>
            <h3>List the survivor.</h3>
            <p>One item, one listing. Pick a category—sock, shoe, earbud, glove, earring, pedal, controller & more. If it’s the lone one, list it.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>3</span>
            <h3>Match or sell.</h3>
            <p>Someone out there is missing this exact half. Or they just like the vibe.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Odd One Out: Pairs are overrated.</p>
        <Link to="/about">About us</Link>
      </footer>
    </div>
  )
}
