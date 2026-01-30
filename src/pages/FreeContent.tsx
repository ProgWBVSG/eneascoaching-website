import React from 'react';
import Button from '../components/Button';
import { Youtube, FileText } from 'lucide-react';

const FreeContent: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-brand-beige py-20 px-6 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-brand-dark">Contenido Gratuito</h1>
          <p className="text-xl text-gray-600">Recursos, videos y herramientas para tu despertar consciente</p>
        </div>
      </div>

      {/* YouTube Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4 mb-12">
            <Youtube className="text-[#FF0000] w-10 h-10" />
            <h2 className="text-3xl font-heading font-bold text-brand-dark">Últimos Videos</h2>
          </div>

          <div className="grid grid-cols-1 gap-12 mb-12 max-w-4xl mx-auto">
            {/* 
              TODO: Replace these video IDs with actual videos from the channel.
              You can find the ID in the YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
            */}
            {[
              { id: 'mOC-B7wG_ic' },
              { id: 'r0DJm_0vs-A' },
              { id: 'EVYwruouTAE' }
            ].map((video, index) => (
              <div key={index} className="bg-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-black relative group">
                  {/* YouTube Embed */}
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={`Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button href="https://www.youtube.com/@CeciliaEneasCoaching" variant="outline">Ver canal completo</Button>
          </div>
        </div>
      </section>

      {/* Downloads / Resources */}
      <section className="py-20 px-6 bg-brand-dark text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex items-center justify-center gap-4 mb-8">
            <FileText className="text-brand-gold w-8 h-8" />
            <h2 className="text-3xl font-heading font-bold">Recursos Descargables</h2>
          </div>
          <p className="mb-12 text-gray-300">Próximamente encontrarás guías y meditaciones exclusivas aquí.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-brand-gold/10 text-center">
        <h3 className="text-2xl font-bold mb-6 text-brand-dark">¿Te gustó el contenido?</h3>
        <p className="mb-8 text-gray-600">Descubre cómo profundizar en tu proceso de transformación.</p>
        <Button to="/" variant="primary">Explorar Mentorías</Button>
      </section>
    </div>
  );
};

export default FreeContent;