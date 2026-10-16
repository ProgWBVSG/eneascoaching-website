import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackPageView } from '../lib/metaPixel';

// El sitio es una sola página (BrowserRouter): hay que avisarle al Pixel en cada cambio de ruta.
const MetaPixelTracker: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView();
    if (pathname === '/diplomatura') {
      trackEvent('ViewContent', { content_name: 'Diplomatura', content_category: 'Diplomatura', value: 1500, currency: 'USD' });
    }
  }, [pathname]);

  // Cualquier clic a WhatsApp cuenta como Lead.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
      if (link) trackEvent('Lead', { content_name: window.location.pathname });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
};

export default MetaPixelTracker;
