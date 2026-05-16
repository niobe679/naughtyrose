import { useState } from 'react';
import { motion } from 'framer-motion';
import { registerCourier } from '../lib/firestore';

const CAMPUSES = ['AAU 6 ⚖️', 'AAU 4 ⚖️', 'AAU 5 ⚖️', 'EIABC', 'UNITY Campus'];

export function Courier() {
  const [form, setForm] = useState({ name: '', phone: '', campus: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.campus) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^09\d{8}$/.test(form.phone)) {
      setError('Phone number must be exactly 10 digits and start with 09 (e.g. 0911223344).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerCourier({ name: form.name, phone: form.phone, campus: form.campus });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="courier-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-title" style={{ marginBottom: 12 }}>Join the Network</p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 900,
          marginBottom: 12,
        }}>
          Become a Courier
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: 8, lineHeight: 1.7 }}>
          Carry roses. Carry thorns. Stay invisible.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '13px', marginBottom: 40 }}>
          Fridays only. Photo proof of every handover. Sender identities are sacred — never spoken, never hinted. Misconduct ends the partnership.
        </p>

        {/* Courier benefits */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 40 }}>
          {[
            { icon: '💰', label: '100 birr per delivery', desc: 'Verified payouts weekly' },
            { icon: '📅', label: 'Fridays only', desc: 'Flexible, predictable schedule' },
            { icon: '🔒', label: 'Full discretion', desc: 'Identities always protected' },
            { icon: '📸', label: 'Photo confirmation', desc: 'Simple proof upload to whatsapp' },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="glass-card"
              style={{ padding: '20px 16px' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{b.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{b.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.desc}</div>
            </motion.div>
          ))}
        </div>

        {submitted ? (
          <motion.div
            className="form-card"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-screen">
              <div className="success-icon">🌹</div>
              <h2 className="success-title">Application Received</h2>
              <p className="success-desc">
                We'll review your application and contact you via phone before your first Friday drop.
                Keep your phone on.
              </p>
            </div>
          </motion.div>
        ) : (
          <form className="form-card" onSubmit={handleSubmit} id="courier-registration-form">
            <h2 className="form-title">Register</h2>
            <p className="form-subtitle">We'll contact you before your first drop.</p>

            <div className="form-row">
              <label className="label" htmlFor="courier-name">Full Name</label>
              <input
                id="courier-name"
                className="input-field"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="form-row">
              <label className="label" htmlFor="courier-phone">Phone Number</label>
              <input
                id="courier-phone"
                className="input-field"
                type="tel"
                placeholder="09XXXXXXXX"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                maxLength={10}
              />
            </div>

            <div className="form-row">
              <label className="label">Campus</label>
              <div className="option-grid">
                {CAMPUSES.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`option-item ${form.campus === c ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, campus: c }))}
                    id={`courier-campus-${c.replace(/[^a-z0-9]/gi, '-')}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--rose-bright)', fontSize: '13px', marginBottom: 12 }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn btn-rose"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
              id="courier-submit-btn"
            >
              {loading ? 'Submitting...' : 'Apply to Become a Courier'}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}
