import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import GroupMentorship from './pages/GroupMentorship';
import PremiumMentorship from './pages/PremiumMentorship';
import Diploma from './pages/Diploma';
import FreeContent from './pages/FreeContent';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans text-brand-text bg-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre-mi" element={<About />} />
            <Route path="/mentorias/grupal" element={<GroupMentorship />} />
            <Route path="/mentorias/premium" element={<PremiumMentorship />} />
            <Route path="/diplomatura" element={<Diploma />} />
            <Route path="/contenido-gratuito" element={<FreeContent />} />
          </Routes>
        </main>
        <Footer />
        <FloatingAIAssistant />
        <FloatingWhatsApp />
      </div>
    </HashRouter>
  );
};

export default App;