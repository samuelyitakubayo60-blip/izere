import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Icon from './components/Icon';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatUIProvider } from './components/FloatingChat';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Home from './pages/Home';
import About from './pages/About';
import Chat from './pages/Chat';
import Contraception from './pages/Contraception';
import Pregnancy from './pages/Pregnancy';
import Menstrual from './pages/Menstrual';
import STI from './pages/STI';
import Blog from './pages/Blog';
import AdminDashboard from './pages/admin/AdminDashboard';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import FindCare from './pages/FindCare';
import PaymentStatus from './pages/PaymentStatus';
import { CartProvider } from './contexts/CartContext';
import Shop from './pages/Shop';
import Footer from './components/Footer';
import EditModeBanner from './components/EditModeBanner';
import './index.css';

function RouteScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash]);
  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 420);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return visible ? <button type="button" className="izere-back-to-top" aria-label="Back to top" title="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="chevron-up" /></button> : null;
}

function App() {
  return (
    <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
        <Router>
          <ChatUIProvider>
            <RouteScrollManager />
            <div className="izere-app">
              <Navigation />
              <EditModeBanner />
              <BackToTop />
              <main className="izere-main-with-nav">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/care" element={<FindCare />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/donate" element={<Donate />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/contraception" element={<Contraception />} />
                  <Route path="/pregnancy" element={<Pregnancy />} />
                  <Route path="/menstrual" element={<Menstrual />} />
                  <Route path="/sti" element={<STI />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/payment/status" element={<PaymentStatus />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute staffOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <Footer />
              </main>
            </div>
          </ChatUIProvider>
        </Router>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
