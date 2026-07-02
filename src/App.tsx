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
import EneaTestCompleto from './pages/EneaTestCompleto';
import Admin from './pages/Admin';
import Curso from './pages/Curso';
import AulaAdmin from './pages/AulaAdmin';

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
        <Route path="/enea-test-juridico" element={<EneaTest />} />
        <Route path="/test/:code" element={<EneaTestCompleto />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/curso/:code" element={<Curso />} />
        <Route path="/aula-admin" element={<AulaAdmin />} />

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
