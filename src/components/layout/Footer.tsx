import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/" className="footer-link">Home</Link>
        <Link to="/feed" className="footer-link">Feed</Link>
        <Link to="/courier" className="footer-link">Become a Courier</Link>
        <Link to="/about" className="footer-link">About</Link>
        <Link to="/admin" className="footer-link">Admin</Link>
      </div>
      <p className="footer-copy">
        © 2025 naughtyrose69 — Anonymous deliveries. Identities never revealed.
      </p>
    </footer>
  );
}
