import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrders, getCouriers, updateOrderStatus, updateCourierStatus, type Order, type Courier, type OrderStatus } from '../lib/firestore';

const ADMIN_PASSWORD = 'naughtyrose2025';

const DEMO_ORDERS: Order[] = [
  { id: 'NR001', type: 'rose', recipientName: 'Hana M.', campus: 'AAU 6 ⚖️', location: 'Library entrance', deliveryDay: 'Friday', timeWindow: 'day', status: 'pending', paymentRef: 'D2NR001', senderPhone: '09**', createdAt: null },
  { id: 'NR002', type: 'thorn', recipientName: 'Yonas T.', campus: 'EIABC', location: 'Cafeteria west side', deliveryDay: 'Friday', timeWindow: 'night', status: 'confirmed', paymentRef: 'D2NR002', senderPhone: '09**', createdAt: null },
  { id: 'NR003', type: 'rose', recipientName: 'Sara A.', campus: 'UNITY Campus', location: 'Gate 2', deliveryDay: 'Friday', timeWindow: 'day', status: 'delivered', paymentRef: 'D2NR003', senderPhone: '09**', createdAt: null },
];

export function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('adminAuthed') === 'true');
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [tab, setTab] = useState<'orders' | 'couriers' | 'analytics'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [o, c] = await Promise.all([getOrders(), getCouriers()]);
      setOrders(o.length > 0 ? o : DEMO_ORDERS);
      setCouriers(c);
    } catch {
      setOrders(DEMO_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) {
      loadData();
    }
  }, [authed]);

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem('adminAuthed', 'true');
    } else {
      setPwError('Incorrect password.');
    }
  };

  const changeStatus = async (id: string, status: OrderStatus) => {
    await updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const changeCourierStatus = async (id: string, status: Courier['status']) => {
    await updateCourierStatus(id, status);
    setCouriers(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
        <motion.div
          className="form-card"
          style={{ maxWidth: 400, width: '100%' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="form-title">Admin Access</h2>
          <p className="form-subtitle">Restricted area.</p>
          <div className="form-row">
            <label className="label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              className="input-field"
              type="password"
              placeholder="Enter admin password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
            />
          </div>
          {pwError && <p style={{ color: 'var(--rose-bright)', fontSize: 13, marginBottom: 12 }}>{pwError}</p>}
          <button className="btn btn-rose" style={{ width: '100%' }} onClick={login} id="admin-login-btn">
            Enter
          </button>
        </motion.div>
      </main>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    roses: orders.filter(o => o.type === 'rose').length,
    thorns: orders.filter(o => o.type === 'thorn').length,
    pranks: orders.filter(o => o.type === 'prank').length,
  };

  return (
    <main className="admin-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="section-title" style={{ marginBottom: 8 }}>Dashboard</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, marginBottom: 28 }}>
          Admin Panel
        </h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total Orders', value: stats.total, color: 'var(--text)' },
            { label: 'Pending', value: stats.pending, color: 'var(--gold)' },
            { label: 'Delivered', value: stats.delivered, color: '#0b8' },
            { label: '🌹 Roses', value: stats.roses, color: 'var(--rose-bright)' },
            { label: '🥀 Thorns', value: stats.thorns, color: '#800' },
            { label: '🎭 Pranks', value: stats.pranks, color: '#8a2be2' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {(['orders', 'couriers', 'analytics'] as const).map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} id={`admin-tab-${t}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Loading...</p>}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Recipient / Phone</th>
                  <th>Delivery Method</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      <div title={o.prankMessage ? `Prank Message: ${o.prankMessage}` : ''}>{o.id}</div>
                    </td>
                    <td>{o.type === 'rose' ? '🌹' : o.type === 'thorn' ? '🥀' : '🎭'} {o.type}</td>
                    <td style={{ color: 'var(--text)' }}>
                      <div>{o.recipientName}</div>
                      {o.recipientPhone && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.recipientPhone}</div>}
                    </td>
                    <td>
                      <div>{o.deliveryMethod === 'phone_call' ? '📞 Phone Call' : o.campus}</div>
                      {o.location && <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.location}</div>}
                    </td>
                    <td>{o.deliveryDay}</td>
                    <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                    <td>
                      <select
                        className="input-field"
                        style={{ padding: '6px 10px', fontSize: 12, width: 'auto' }}
                        value={o.status}
                        onChange={e => changeStatus(o.id!, e.target.value as OrderStatus)}
                        id={`order-status-${o.id}`}
                      >
                        {(['pending', 'confirmed', 'assigned', 'delivered', 'retry', 'refunded'] as OrderStatus[]).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No orders yet.</p>}
          </div>
        )}

        {/* Couriers tab */}
        {tab === 'couriers' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Campus</th>
                  <th>Status</th>
                  <th>Earnings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {couriers.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--text)' }}>{c.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.phone}</td>
                    <td>{c.campus}</td>
                    <td><span className={`status-badge status-${c.status === 'active' ? 'delivered' : c.status === 'pending' ? 'pending' : 'refunded'}`}>{c.status}</span></td>
                    <td style={{ color: 'var(--gold)' }}>{c.earnings.toLocaleString()} birr</td>
                    <td>
                      <select
                        className="input-field"
                        style={{ padding: '6px 10px', fontSize: 12, width: 'auto' }}
                        value={c.status}
                        onChange={e => changeCourierStatus(c.id!, e.target.value as Courier['status'])}
                        id={`courier-status-${c.id}`}
                      >
                        {(['pending', 'active', 'suspended'] as Courier['status'][]).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {couriers.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No couriers registered yet.</p>}
          </div>
        )}

        {/* Analytics tab */}
        {tab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 16 }}>Order Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span>🌹 Roses</span>
                    <span style={{ color: 'var(--rose-bright)' }}>{stats.roses}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(30,5,10,0.8)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${stats.total > 0 ? (stats.roses / stats.total) * 100 : 0}%`, background: 'var(--rose-bright)', borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span>🥀 Thorns</span>
                    <span style={{ color: '#800' }}>{stats.thorns}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(30,5,10,0.8)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${stats.total > 0 ? (stats.thorns / stats.total) * 100 : 0}%`, background: '#800', borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 16 }}>Delivery Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                <p>Pending: <strong style={{ color: 'var(--gold)' }}>{stats.pending}</strong></p>
                <p>Delivered: <strong style={{ color: '#0b8' }}>{stats.delivered}</strong></p>
                <p>Revenue: <strong style={{ color: 'var(--rose-bright)' }}>{(stats.delivered * 500).toLocaleString()} birr</strong></p>
                <p>Courier cost: <strong style={{ color: 'var(--text)' }}>{(stats.delivered * 100).toLocaleString()} birr</strong></p>
                <p>Net: <strong style={{ color: 'var(--rose-bright)' }}>{(stats.delivered * 400).toLocaleString()} birr</strong></p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </main>
  );
}