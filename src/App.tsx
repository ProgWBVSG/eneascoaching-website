import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
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
import EneaTest from './pages/EneaTest';
import Admin from './pages/Admin';

const MainLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen font-sans text-brand-text bg-white">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <FloatingAIAssistant />
    <FloatingWhatsApp />
  </div>
);

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
      <Routes>
        {/* Standalone pages — sin navbar ni footer */}
        <Route path="/enea-test" element={<EneaTest />} />
        <Route path="/admin" element={<Admin />} />

        {/* Main site with navbar/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-mi" element={<About />} />
          <Route path="/mentorias/grupal" element={<GroupMentorship />} />
          <Route path="/mentorias/premium" element={<PremiumMentorship />} />
          <Route path="/diplomatura" element={<Diploma />} />
          <Route path="/contenido-gratuito" element={<FreeContent />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
