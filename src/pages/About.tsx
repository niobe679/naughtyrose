import { motion } from 'framer-motion';

const RULES = [
  {
    title: 'Complete Anonymity',
    body: 'Your identity is never revealed — not to the recipient, not to our couriers, not anywhere. Ever.',
  },
  {
    title: 'Two Actions Only',
    body: 'A Rose is sent to someone you secretly admire. A Thorn is sent to someone who has caused you emotional pain.',
  },
  {
    title: 'Friday Drops',
    body: 'All deliveries happen on Fridays. If delivery fails, retry continues until Monday 6:00 PM. After that, a full refund is issued within 24 hours.',
  },
  {
    title: 'No Messages, No Letters',
    body: 'It\'s a rose or a thorn. The object speaks for itself. No note, no text. The recipients feel it — they don\'t read it.',
  },
  {
    title: 'Campus Only',
    body: 'naughtyrose operates exclusively within Ethiopian university campuses. AAU 6, AAU 4, AAU 5, EIABC, and UNITY Campus.',
  },
  {
    title: 'Safety Is Sacred',
    body: 'No harassment. No hate content. All orders are reviewed. Misconduct leads to permanent ban.',
  },
  {
    title: 'Courier Discretion',
    body: 'Couriers are bound to full discretion. Violation ends employment immediately.',
  },
  {
    title: 'Payment',
    body: 'Telebirr only. 500 birr per delivery. Orders are processed only after payment confirmation.',
  },
];

export function About() {
  return (
    <main className="about-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-title" style={{ marginBottom: 12 }}>The Platform</p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(36px, 6vw, 56px)',
          fontWeight: 900,
          marginBottom: 12,
        }}>
          Anonymous by design.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: 48, lineHeight: 1.7 }}>
          naughtyrose exists to let you express what words can't carry — safely, anonymously, physically.
        </p>

        <div>
          {RULES.map((r, i) => (
            <motion.div
              key={i}
              className="about-rule"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <strong>{r.title}</strong>
              {r.body}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
