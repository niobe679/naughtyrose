import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

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
            anonymous deliveries
          </motion.p>

          <motion.h1 className="hero-title" {...fadeUp(0.1)}>
            A rose.<br />A thorn.<br />A prank.<br />
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
            {/* PRANK FEATURE ACTIVATION PENDING */}
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
            <h2 className="section-heading" style={{ marginBottom: 0 }}>Roses. Thorns.</h2>
            <Link to="/feed" className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '12px' }}>
              See all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', textAlign: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
            <div style={{ padding: '30px', background: 'rgba(255, 42, 95, 0.1)', borderRadius: '16px', flex: '1 1 200px' }}>
              <h3 style={{ fontSize: '48px', color: 'var(--rose-bright)' }}>12</h3>
              <p style={{ color: 'var(--text-muted)' }}>Roses Delivered</p>
            </div>
            <div style={{ padding: '30px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', flex: '1 1 200px' }}>
              <h3 style={{ fontSize: '48px', color: '#888' }}>7</h3>
              <p style={{ color: 'var(--text-muted)' }}>Thorns Delivered</p>
            </div>
            <div style={{ padding: '30px', background: 'rgba(52, 97, 132, 0.05)', borderRadius: '16px', flex: '1 1 200px' }}>
              <h3 style={{ fontSize: '48px', color: '#41ea9eff' }}>3</h3>
              <p style={{ color: 'var(--text-muted)' }}>Pranks Delivered</p>
            </div>
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
          <p className="hero-eyebrow" style={{ marginBottom: 16 }}>A rose. A thorn.</p>
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
