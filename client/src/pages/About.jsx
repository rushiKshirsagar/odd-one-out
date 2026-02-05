import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1>About us</h1>
        <p className={styles.tagline}>We’re the people who believe every lone half deserves a second chance.</p>
      </header>

      <section className={styles.section}>
        <h2>Why Odd One Out?</h2>
        <p>
          Dryers eat socks. Gloves get lost. Earbuds vanish. Shoes break in pairs. Chopsticks go solo. Instead of binning the survivor, list it here.
          Socks, shoes, gloves, earbuds, earrings, contact lenses, chopsticks, cufflinks, pedals, wheels, controllers, slippers, arm warmers, headphones, batteries—someone out there lost the other one, or just likes the mismatch. No judgement.
        </p>
      </section>

      <section className={styles.section}>
        <h2>The rules</h2>
        <ul>
          <li>One item per listing. Pick a category—one half only.</li>
          <li>Clean before listing. Wash socks, wipe earbuds, we’re not monsters.</li>
          <li>Be honest about condition. Nobody likes a surprise hole (or dead bud).</li>
          <li>Pay with card (Stripe) or cash on pickup. Your call.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Contact</h2>
        <p>
          Questions? Complaints? Found your long-lost pair? Drop us a line at{' '}
          <a href="mailto:hello@oddoneout.example">hello@oddoneout.example</a>.
          We’ll get back to you. (Eventually.)
        </p>
      </section>

      <p className={styles.footer}>
        Odd One Out — Socks, shoes, gloves, earbuds, earrings, chopsticks & more. Pairs are overrated.
      </p>
    </div>
  )
}
