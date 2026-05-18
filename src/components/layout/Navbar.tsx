import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import mascotLogo from '../../assets/naughtyrose-mascot3.png';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/feed', label: 'Feed' },
    { to: '/courier', label: 'Courier' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={mascotLogo} alt="NaughtyRose" style={{ height: '36px', width: 'auto' }} />
      </Link>

      <div className={`nav-links ${open ? 'open' : ''}`}>
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`nav-link ${pathname === l.to ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <Link to="/send" className="nav-link highlight" onClick={() => setOpen(false)}>
          Send
        </Link>
      </div>

      <button className="nav-toggle" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </nav>
  );
}
