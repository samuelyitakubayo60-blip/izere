import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
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
import Footer from './components/Footer';
import EditModeBanner from './components/EditModeBanner';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ChatUIProvider>
            <div className="izere-app">
              <Navigation />
              <EditModeBanner />
              <main className="izere-main-with-nav">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/donate" element={<Donate />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/contraception" element={<Contraception />} />
                  <Route path="/pregnancy" element={<Pregnancy />} />
                  <Route path="/menstrual" element={<Menstrual />} />
                  <Route path="/sti" element={<STI />} />
                  <Route path="/blog" element={<Blog />} />
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
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
