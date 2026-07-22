import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ChatUIProvider } from './components/FloatingChat';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Contraception from './pages/Contraception';
import Pregnancy from './pages/Pregnancy';
import Menstrual from './pages/Menstrual';
import STI from './pages/STI';
import Blog from './pages/Blog';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ChatUIProvider>
            <div className="min-h-screen">
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/contraception" element={<Contraception />} />
                <Route path="/pregnancy" element={<Pregnancy />} />
                <Route path="/menstrual" element={<Menstrual />} />
                <Route path="/sti" element={<STI />} />
                <Route path="/blog" element={<Blog />} />
              </Routes>
            </div>
          </ChatUIProvider>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
