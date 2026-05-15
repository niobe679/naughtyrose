import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStore } from '../store/orderStore';
import { createOrder } from '../lib/firestore';
import type { OrderType, TimeWindow } from '../lib/firestore';

const CAMPUSES = ['AAU 6 ⚖️', 'AAU 4 ⚖️', 'AAU 5 ⚖️', 'EIABC', 'UNITY Campus'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'];
const ACTIVE_DAY = 'Friday';
const TOTAL_STEPS = 6;

function StepProgress({ step }: { step: number }) {
  return (
    <div className="step-progress" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`step-dot ${i + 1 === step ? 'active' : i + 1 < step ? 'done' : ''}`}
        />
      ))}
    </div>
  );
}

// ── Step 1: Choose type ──────────────────────────
function Step1({ onNext }: { onNext: () => void }) {
  const { type, setType } = useOrderStore();

  return (
    <>
      <h2 className="form-title">What are you sending?</h2>
      <p className="form-subtitle">One choice. No going back from how it lands.</p>
      <div className="choice-grid" style={{ marginTop: 8 }}>
        <motion.div
          className={`choice-card rose-card ${type === 'rose' ? 'selected' : ''}`}
          onClick={() => setType('rose')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="choose-rose"
        >
          <div className="choice-icon">🌹</div>
          <div className="choice-title">Rose</div>
          <div className="choice-desc">For someone you secretly admire.</div>
        </motion.div>
        <motion.div
          className={`choice-card thorn-card ${type === 'thorn' ? 'selected' : ''}`}
          onClick={() => setType('thorn')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="choose-thorn"
        >
          <div className="thorn-icon" style={{ fontSize: 48, lineHeight: 1.1 }}>🥀</div>
          <div className="choice-title">Thorn</div>
          <div className="choice-desc">For someone who caused you pain.</div>
        </motion.div>
        <motion.div
          className={`choice-card prank-card ${type === 'prank' ? 'selected' : ''}`}
          onClick={() => setType('prank')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="choose-prank"
          style={{ gridColumn: '1 / -1' }}
        >
          <div className="prank-icon">🎭</div>
          <div className="choice-title">Prank</div>
          <div className="choice-desc">A written insult delivered in-person or via phone call.</div>
        </motion.div>
      </div>
      <div className="form-actions" style={{ marginTop: 28 }}>
        <button
          className="btn btn-rose"
          onClick={onNext}
          disabled={!type}
          id="step1-next"
          style={{ flex: 1 }}
        >
          Continue
        </button>
      </div>
    </>
  );
}

// ── Step 2: Recipient ────────────────────────────
function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { type, recipientName, setRecipientName, recipientPhone, setRecipientPhone, deliveryMethod, setDeliveryMethod } = useOrderStore();
  
  useEffect(() => {
    if (type === 'prank' && !deliveryMethod) setDeliveryMethod('in_person');
  }, [type, deliveryMethod, setDeliveryMethod]);

  const isPhoneValid = /^09\d{8}$/.test(recipientPhone);
  const isValid = type === 'prank' && deliveryMethod === 'phone_call' 
    ? isPhoneValid 
    : recipientName.trim().length > 0;

  return (
    <>
      <h2 className="form-title">Who receives it?</h2>
      <p className="form-subtitle">Their {type === 'prank' && deliveryMethod === 'phone_call' ? 'phone number' : 'name'} is only used {type === 'prank' && deliveryMethod === 'phone_call' ? 'to call them' : 'to find them'}. Nothing is stored publicly.</p>
      
      {type === 'prank' && (
        <div className="form-row" style={{ marginBottom: 24 }}>
          <label className="label">Delivery Method</label>
          <div className="option-grid">
            <button type="button" className={`option-item ${deliveryMethod === 'in_person' ? 'selected' : ''}`} onClick={() => setDeliveryMethod('in_person')}>🚶 In-Person</button>
            <button type="button" className={`option-item ${deliveryMethod === 'phone_call' ? 'selected' : ''}`} onClick={() => setDeliveryMethod('phone_call')}>📞 Phone Call</button>
          </div>
        </div>
      )}

      <div className="form-row">
        <label className="label" htmlFor="recipient-input">{type === 'prank' && deliveryMethod === 'phone_call' ? 'Recipient Phone Number' : 'Full Name'}</label>
        {type === 'prank' && deliveryMethod === 'phone_call' ? (
          <input id="recipient-input" className="input-field" type="tel" placeholder="09XXXXXXXX" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} maxLength={10} autoFocus />
        ) : (
          <input id="recipient-input" className="input-field" type="text" placeholder="Their full name" value={recipientName} onChange={e => setRecipientName(e.target.value)} autoFocus />
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onBack} id="step2-back">Back</button>
        <button className="btn btn-rose" onClick={onNext} disabled={!isValid} id="step2-next">Continue</button>
      </div>
    </>
  );
}

// ── Step 3: Campus or Phone Message ──────────────
function Step3({ onNext, onBack, onJumpTo5 }: { onNext: () => void; onBack: () => void; onJumpTo5: () => void }) {
  const { type, campus, setCampus, deliveryMethod, prankMessage, setPrankMessage } = useOrderStore();

  if (type === 'prank' && deliveryMethod === 'phone_call') {
    return (
      <>
        <h2 className="form-title">The Insult</h2>
        <p className="form-subtitle">What should the courier read to them out loud over the phone?</p>
        <div className="form-row">
          <textarea className="input-field" rows={4} value={prankMessage} onChange={e => setPrankMessage(e.target.value)} placeholder="Write something mildly devious..." autoFocus />
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onBack}>Back</button>
          <button className="btn btn-rose" onClick={onJumpTo5} disabled={!prankMessage.trim()}>Continue</button>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="form-title">Which campus?</h2>
      <p className="form-subtitle">Select the campus where you want it delivered.</p>
      <div className="option-grid" style={{ marginTop: 4 }}>
        {CAMPUSES.map(c => (
          <button
            key={c}
            type="button"
            className={`option-item ${campus === c ? 'selected' : ''}`}
            onClick={() => setCampus(c)}
            id={`campus-${c.replace(/[^a-z0-9]/gi, '-')}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onBack} id="step3-back">Back</button>
        <button className="btn btn-rose" onClick={onNext} disabled={!campus} id="step3-next">Continue</button>
      </div>
    </>
  );
}

// ── Step 4: Location & Physical Message ──────────
function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { location, setLocation, type, prankMessage, setPrankMessage } = useOrderStore();
  
  return (
    <>
      <h2 className="form-title">Where exactly?</h2>
      <p className="form-subtitle">Be as specific as possible about the location.</p>
      <div className="form-row">
        <label className="label" htmlFor="delivery-location">Exact Location</label>
        <input
          id="delivery-location"
          className="input-field"
          type="text"
          placeholder="e.g. Main library entrance, Building A cafeteria..."
          value={location}
          onChange={e => setLocation(e.target.value)}
          autoFocus
        />
      </div>
      
      {type === 'prank' && (
        <div className="form-row" style={{ marginTop: 20 }}>
          <label className="label">The Insult (Written Note)</label>
          <textarea className="input-field" rows={3} value={prankMessage} onChange={e => setPrankMessage(e.target.value)} placeholder="What should the physical note say?" />
        </div>
      )}

      {type !== 'prank' && (
        <div className="hint-box" style={{ marginTop: 4 }}>
          It makes the process easier when they're actually there when it arrives. Pick a place and a moment you know they'll be at.
        </div>
      )}
      
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onBack} id="step4-back">Back</button>
        <button className="btn btn-rose" onClick={onNext} disabled={!location.trim() || (type === 'prank' && !prankMessage.trim())} id="step4-next">Continue</button>
      </div>
    </>
  );
}

// ── Step 5: Delivery day & time window ──────────
function Step5({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { deliveryDay, timeWindow, setDeliveryDay, setTimeWindow } = useOrderStore();
  return (
    <>
      <h2 className="form-title">When should it drop?</h2>
      <p className="form-subtitle">Pick your delivery day and time window.</p>

      <div className="form-row">
        <label className="label">Delivery Day</label>
        <div className="option-grid">
          {DAYS.map(d => (
            <button
              key={d}
              type="button"
              className={`option-item ${deliveryDay === d ? 'selected' : ''} ${d !== ACTIVE_DAY ? 'disabled' : ''}`}
              onClick={() => d === ACTIVE_DAY && setDeliveryDay(d)}
              disabled={d !== ACTIVE_DAY}
              id={`day-${d.toLowerCase()}`}
            >
              {d}
              {d === ACTIVE_DAY && <span style={{ display: 'block', fontSize: 10, color: 'var(--rose-bright)', marginTop: 2 }}>Active</span>}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10, fontStyle: 'italic' }}>
          Currently we only deliver on Friday. We won't confuse you with a messed up AM/PM system.
        </p>
      </div>

      <div className="form-row">
        <label className="label">Time Window</label>
        <div className="time-grid">
          {([
            { id: 'day', icon: '☀️', label: 'During the day', desc: 'Morning to early evening' },
            { id: 'night', icon: '🌙', label: 'During the night time', desc: 'Evening onwards' },
          ] as { id: TimeWindow; icon: string; label: string; desc: string }[]).map(t => (
            <div
              key={t.id}
              className={`time-card ${timeWindow === t.id ? 'selected' : ''}`}
              onClick={() => setTimeWindow(t.id)}
              id={`time-${t.id}`}
            >
              <div className="time-icon">{t.icon}</div>
              <div className="time-label">{t.label}</div>
              <div className="time-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onBack} id="step5-back">Back</button>
        <button className="btn btn-rose" onClick={onNext} disabled={!deliveryDay} id="step5-next">Continue</button>
      </div>
    </>
  );
}

// ── Step 6: Payment ──────────────────────────────
function Step6({ onSubmit, onBack, loading }: { onSubmit: () => void; onBack: () => void; loading: boolean }) {
  const { senderPhone, setSenderPhone, recipientName, recipientPhone, type, deliveryMethod } = useOrderStore();
  const orderId = `NR${Date.now().toString(36).toUpperCase()}`;
  const paymentRef = `D2${orderId}${senderPhone.replace(/\D/g, '')}`;

  const displayName = type === 'prank' && deliveryMethod === 'phone_call' ? recipientPhone : recipientName;

  return (
    <>
      <h2 className="form-title">Payment</h2>
      <p className="form-subtitle">Complete your payment via <u style={{ color: 'var(--rose-bright)' }}>Telebirr</u> to confirm your order.</p>

      {/* QR placeholder */}
      <div className="payment-qr">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>📱</div>
          <div style={{ fontSize: 11, color: '#555' }}>Telebirr QR<br />coming soon</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Send payment to</p>
        <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--rose-bright)', letterSpacing: '0.05em' }}>
          0992496445
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          500 birr · {type === 'rose' ? '🌹 Rose' : type === 'thorn' ? '🥀 Thorn' : '🎭 Prank'} delivery
        </p>
      </div>

      <div className="form-row">
        <label className="label" htmlFor="sender-phone">Your Phone Number</label>
        <input
          id="sender-phone"
          className="input-field"
          type="tel"
          placeholder="09XXXXXXXX (for refund purposes)"
          value={senderPhone}
          onChange={e => setSenderPhone(e.target.value)}
          maxLength={10}
        />
        <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 6, fontStyle: 'italic' }}>
          Your number is used for refunds only. It is never associated with your order publicly.
        </p>
      </div>

      <div className="form-row">
        <label className="label">Your Payment Reference</label>
        <div className="payment-ref-box">{paymentRef}</div>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 6 }}>
          Include this reference when sending payment on Telebirr.
        </p>
      </div>

      <div className="telebirr-note">
        <p style={{ marginBottom: 6 }}>When sending on <u>Telebirr</u>, add a note that includes:</p>
        <p>• Your phone number</p>
        <p>• Recipient: <strong>{displayName || '[recipient info]'}</strong></p>
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-dim)' }}>
          Note: Telebirr does not show your full phone number — your identity stays protected.
        </p>
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onBack} id="step6-back">Back</button>
        <button
          className="btn btn-rose"
          onClick={onSubmit}
          disabled={!/^09\d{8}$/.test(senderPhone) || loading}
          id="step6-submit"
        >
          {loading ? 'Placing Order...' : 'Confirm Order'}
        </button>
      </div>
    </>
  );
}

// ── Success ──────────────────────────────────────
function SuccessScreen() {
  const { type, campus, deliveryDay, reset, deliveryMethod } = useOrderStore();
  const navigate = useNavigate();
  return (
    <div className="success-screen">
      <div className="success-icon">{type === 'rose' ? '🌹' : type === 'thorn' ? '🥀' : '🎭'}</div>
      <h2 className="success-title">Order Placed</h2>
      <p className="success-desc">
        Your {type} is queued for delivery on {deliveryDay} 
        {type === 'prank' && deliveryMethod === 'phone_call' ? ' via Phone Call' : ` at ${campus}`}.
        We'll process it after payment confirmation. They'll never know it was you.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        <button className="btn btn-ghost" onClick={() => { reset(); navigate('/'); }} id="success-home">
          Back to Home
        </button>
        <button className="btn btn-rose" onClick={() => { reset(); }} id="success-send-another">
          Send Another
        </button>
      </div>
    </div>
  );
}

// ── Main Send page ───────────────────────────────
export function Send() {
  const [searchParams] = useSearchParams();
  const { step, setStep, nextStep, prevStep, setType, type, recipientName, recipientPhone, campus, location, deliveryDay, timeWindow, senderPhone, setSubmittedOrderId, submittedOrderId, deliveryMethod, prankMessage } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-select type from URL params
  useEffect(() => {
    const item = searchParams.get('item');
    if (item === 'rose' || item === 'thorn' || item === 'prank') {
      setType(item as OrderType);
      setStep(item ? 2 : 1);
    } else {
      setStep(1);
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const orderId = await createOrder({
        type: type!,
        recipientName,
        recipientPhone: type === 'prank' && deliveryMethod === 'phone_call' ? recipientPhone : undefined,
        campus: (type === 'prank' && deliveryMethod === 'phone_call') ? 'Phone' : campus,
        location: (type === 'prank' && deliveryMethod === 'phone_call') ? 'Phone' : location,
        deliveryMethod: type === 'prank' ? deliveryMethod : undefined,
        prankMessage: type === 'prank' ? prankMessage : undefined,
        deliveryDay,
        timeWindow,
        senderPhone,
        paymentRef: `D2NR${Date.now().toString(36).toUpperCase()}${senderPhone.replace(/\D/g, '')}`,
      });
      setSubmittedOrderId(orderId);
    } catch (err) {
      console.error('Order error:', err);
      setError('Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <main className="send-page">
      <div style={{ width: '100%', maxWidth: 560 }}>
        {!submittedOrderId && <StepProgress step={step} />}

        <motion.div
          className="form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {submittedOrderId ? (
            <SuccessScreen />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {step === 1 && <Step1 onNext={nextStep} />}
                {step === 2 && <Step2 onNext={nextStep} onBack={prevStep} />}
                {step === 3 && <Step3 onNext={nextStep} onBack={prevStep} onJumpTo5={() => setStep(5)} />}
                {step === 4 && <Step4 onNext={nextStep} onBack={() => {
                  if (type === 'prank' && deliveryMethod === 'phone_call') setStep(3);
                  else prevStep();
                }} />}
                {step === 5 && <Step5 onNext={nextStep} onBack={() => {
                  if (type === 'prank' && deliveryMethod === 'phone_call') setStep(3);
                  else prevStep();
                }} />}
                {step === 6 && <Step6 onSubmit={handleSubmit} onBack={prevStep} loading={loading} />}
              </motion.div>
            </AnimatePresence>
          )}

          {error && (
            <p style={{ color: 'var(--rose-bright)', fontSize: 13, marginTop: 12 }}>{error}</p>
          )}
        </motion.div>

        <p style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center', marginTop: 20 }}>
          Your identity is never revealed. Ever.
        </p>
      </div>
    </main>
  );
}
