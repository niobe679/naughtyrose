import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Send } from './pages/Send';
import { Feed } from './pages/Feed';
import { Courier } from './pages/Courier';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/send" element={<Send />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/courier" element={<Courier />} />
        <Route path="/about" element={<About />} />
        <Route path="/HandNadmins" element={<Admin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
