import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDrops, type Drop } from '../lib/firestore';

const DEMO_DROPS: Drop[] = [
  { type: 'rose', campus: 'AAU 6 ⚖️', location: 'Library', deliveredAt: null },
  { type: 'thorn', campus: 'EIABC', location: 'Cafeteria', deliveredAt: null },
  { type: 'rose', campus: 'UNITY Campus', location: 'Gate', deliveredAt: null },
  { type: 'thorn', campus: 'AAU 4 ⚖️', location: 'Classroom Building', deliveredAt: null },
  { type: 'rose', campus: 'AAU 6 ⚖️', location: 'Cafeteria', deliveredAt: null },
  { type: 'thorn', campus: 'UNITY Campus', location: 'Gate', deliveredAt: null },
  { type: 'rose', campus: 'EIABC', location: 'Custom Meet Point', deliveredAt: null },
];

function timeAgo(index: number) {
  const times = [
    'Friday 2:14 PM', 'Friday 11:42 AM', 'Friday 3:05 PM',
    'Friday 1:30 PM', 'Friday 4:00 PM', 'Last Friday 10:00 AM',
    'Last Friday 2:55 PM', 'Last Friday 9:00 AM',
  ];
  return times[index % times.length];
}

export function Feed() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'rose' | 'thorn' | 'prank'>('all');

  useEffect(() => {
    (async () => {
      try {
        const data = await getDrops(50);
        setDrops(data.length > 0 ? data : DEMO_DROPS);
      } catch {
        setDrops(DEMO_DROPS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === 'all' ? drops : drops.filter(d => d.type === filter);

  return (
    <main className="feed-page">
      <div className="container-sm">
        <motion.div
          className="feed-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-title">Public Feed</p>
          <h1 className="section-heading">Drops</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '28px' }}>
            Roses. Thorns. Pranks. No identities.
          </p>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {(['all', 'rose', 'thorn'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`admin-tab ${filter === f ? 'active' : ''}`}
                id={`feed-filter-${f}`}
              >
                {f === 'all' ? 'All Drops' : f === 'rose' ? '🌹 Roses' : f === 'thorn' ? '🥀 Thorns' : ''}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="feed-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ padding: '18px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(15,2,6,0.4)' }}>
                <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: '35%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="feed-grid">
            {filtered.map((d, i) => (
              <motion.div
                key={d.id || i}
                className="drop-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <span className="drop-badge">{d.type === 'rose' ? '🌹' : d.type === 'thorn' ? '🥀' : ''}</span>
                <div className="drop-info">
                  <p className="drop-label">
                    <strong>{d.type.charAt(0).toUpperCase() + d.type.slice(1)} delivered</strong>
                    {' '}— {d.campus} {d.location && `— ${d.location}`}
                  </p>
                  <p className="drop-time">{timeAgo(i)}</p>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <p style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                No drops yet.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
