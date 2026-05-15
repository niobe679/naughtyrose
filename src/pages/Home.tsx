import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

const DEMO_DROPS = [
  { type: 'rose', campus: 'AAU 6', location: 'Library', time: 'Friday 2:14 PM' },
  { type: 'thorn', campus: 'EIABC', location: 'Cafeteria', time: 'Friday 11:42 AM' },
  { type: 'rose', campus: 'UNITY Campus', location: 'Gate', time: 'Friday 3:05 PM' },
  { type: 'thorn', campus: 'AAU 4', location: 'Classroom Building', time: 'Friday 1:30 PM' },
  { type: 'prank', campus: 'AAU 5', location: 'Phone Call', time: 'Friday 2:00 PM' },
  { type: 'rose', campus: 'AAU 5', location: 'Library', time: 'Friday 4:00 PM' },
];

export function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />

        {/* Floating petals */}
        {['🌹', '🌹', '🌹', '🥀', '🌹'].map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{
              top: `${10 + i * 16}%`,
              left: `${5 + i * 20}%`,
              '--dur': `${5 + i}s`,
              '--delay': `${i * 0.8}s`,
              fontSize: `${16 + i * 4}px`,
            } as React.CSSProperties}
          >
            {p}
          </span>
        ))}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="hero-eyebrow" {...fadeUp(0)}>
            anonymous campus deliveries
          </motion.p>

          <motion.h1 className="hero-title" {...fadeUp(0.1)}>
            A rose.<br />A thorn.<br />Or a <em>prank.</em>
          </motion.h1>

          <motion.p className="hero-sub" {...fadeUp(0.2)}>
            Pick one. We deliver it. They will never know it was you.
          </motion.p>

          <motion.div className="hero-cta" {...fadeUp(0.3)}>
            <Link to="/send?item=rose" className="btn btn-rose" id="hero-send-rose">
              🌹 Send a Rose
            </Link>
            <Link to="/send?item=thorn" className="btn btn-thorn" id="hero-send-thorn">
              🥀 Send a Thorn
            </Link>
            <Link to="/send?item=prank" className="btn btn-ghost" id="hero-send-prank" style={{ borderColor: 'rgba(138,43,226,0.5)', color: '#b683e6' }}>
              🎭 Send a Prank
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quote section */}
      <section className="quote-section">
        <div className="container-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="quote-mark">"</span>
            <p className="quote-text">
              What if your own friend sends you a thorn…
              you already know what it means.
              It means they are full of pain,
              and you are the <em>source</em> of it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Recent drops */}
      <section className="feed-section">
        <div className="container">
          <p className="section-title">Recent Drops</p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 className="section-heading" style={{ marginBottom: 0 }}>Roses. Thorns. Pranks.</h2>
            <Link to="/feed" className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '12px' }}>
              See all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="feed-grid">
            {DEMO_DROPS.map((d, i) => (
              <motion.div
                key={i}
                className="drop-card"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <span className="drop-badge">{d.type === 'rose' ? '🌹' : d.type === 'thorn' ? '🥀' : '🎭'}</span>
                <div className="drop-info">
                  <p className="drop-label">
                    <strong>{d.type.charAt(0).toUpperCase() + d.type.slice(1)} delivered</strong> — {d.campus} {d.location && `— ${d.location}`}
                  </p>
                  <p className="drop-time">{d.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="container">
        <motion.div
          className="cta-banner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="hero-eyebrow" style={{ marginBottom: 16 }}>A rose. A thorn. A prank.</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 46px)', marginBottom: 24, fontWeight: 700 }}>
            Which one are you holding?
          </h2>
          <Link to="/send" className="btn btn-rose" id="cta-send-now">
            Send now <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
