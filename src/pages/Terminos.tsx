import React, { useEffect } from 'react';

// Términos y condiciones de inscripción + política de privacidad.
// Borrador para que lo revise Cecilia (abogada) antes de darlo por definitivo.
const ACTUALIZACION = '19 de octubre de 2026';

const Seccion: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <section className="mt-10">
    <h2 className="text-xl font-heading font-bold text-brand-dark mb-3 text-center">{titulo}</h2>
    <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
  </section>
);

const Terminos: React.FC = () => {
  useEffect(() => { document.title = 'Términos y privacidad | Eneascoaching'; }, []);
  return (
    <div className="pt-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark text-center">Términos y condiciones y política de privacidad</h1>
        <p className="text-sm text-gray-500 text-center mt-3">Última actualización: {ACTUALIZACION}</p>

        <Seccion titulo="1. Quiénes somos">
          <p>Eneascoaching es la marca de Cecilia Beatriz Sánchez, con domicilio en la ciudad de Córdoba, Argentina. Contacto: WhatsApp +54 9 351 563 2496.</p>
          <p>Estos términos se aplican a la inscripción en la Diplomatura en Eneagrama, Liderazgo y Vínculos Conscientes y a los demás programas que se contratan a través de cecimentorcoach.com.</p>
        </Seccion>

        <Seccion titulo="2. Inscripción y reserva del lugar">
          <p>La inscripción se inicia completando el formulario de la web y eligiendo la fecha de inicio (cohorte). Completar el formulario no genera ningún cobro.</p>
          <p>El lugar en la cohorte elegida queda <strong>reservado únicamente cuando se acredita la seña</strong>. Los cupos de cada cohorte son limitados y se asignan por orden de acreditación de la seña.</p>
          <p>El monto de la seña, el valor total y las opciones de pago (pago único o en cuotas) se informan por WhatsApp antes de abonar.</p>
        </Seccion>

        <Seccion titulo="3. Seña no reembolsable">
          <p>La seña reserva un lugar que deja de ofrecerse a otras personas y permite organizar el grupo y los materiales. Por eso, <strong>la seña no es reembolsable</strong> si la persona inscripta desiste o no comienza la cursada, cualquiera sea el motivo.</p>
          <p>La seña se descuenta del valor total de la Diplomatura.</p>
          <p>Si la persona no puede comenzar en la fecha elegida y lo avisa antes del inicio, podrá solicitar que la seña se aplique a la cohorte siguiente, sujeto a disponibilidad de cupo. Esta posibilidad se puede usar una sola vez.</p>
          <p>Si Eneascoaching cancela o reprograma una cohorte, la persona podrá elegir entre pasar a la nueva fecha o recibir la devolución total de lo abonado.</p>
          <p>Lo anterior no limita el derecho de revocación que la ley de defensa del consumidor reconoce para las contrataciones a distancia, en los casos y plazos en que corresponda.</p>
        </Seccion>

        <Seccion titulo="4. Pagos y saldo">
          <p>El saldo se abona según la modalidad acordada: en un único pago antes del inicio o en las cuotas informadas. Las cuotas vencen en las fechas acordadas al momento de la inscripción.</p>
          <p>La falta de pago de las cuotas puede suspender el acceso a las clases en vivo, al campus y a la comunidad hasta regularizar la situación. El diploma se entrega con el programa completo y el pago total abonado.</p>
          <p>Lo abonado en concepto de cuotas no es reembolsable una vez iniciada la cursada.</p>
        </Seccion>

        <Seccion titulo="5. Cursada, certificación y beneficios">
          <p>La Diplomatura dura 6 meses, es grupal y se dicta online y en vivo. Puede incluir recesos (por ejemplo, en enero y en las vacaciones de invierno), que se informan al comenzar.</p>
          <p>Para obtener la certificación privada ENEASCOACHING® se requiere completar el programa, el trabajo final y la práctica supervisada.</p>
          <p>Al graduarse, la persona recibe el diploma, la medalla del Eneagrama y 6 meses de acceso sin cargo a la comunidad de eneagramistas. Finalizado ese período, continuar en la comunidad es opcional y tiene el costo vigente en ese momento.</p>
          <p>Los materiales, grabaciones y contenidos del programa son de uso personal y no pueden compartirse, reproducirse ni comercializarse sin autorización.</p>
        </Seccion>

        <Seccion titulo="6. Privacidad y datos personales">
          <p>Los datos que se ingresan en los formularios de la web (nombre, email, WhatsApp, país, profesión, forma de pago preferida y comentarios, y en el caso de la agenda, el horario elegido) se usan solamente para gestionar la inscripción, coordinar pagos, organizar las reuniones y enviar información sobre los programas.</p>
          <p>Los datos no se venden ni se ceden a terceros. Se guardan en servicios de alojamiento seguros (Supabase y Vercel) y solo accede a ellos Eneascoaching.</p>
          <p>En cualquier momento podés pedir ver, corregir o eliminar tus datos, o dejar de recibir mensajes, escribiendo por WhatsApp al +54 9 351 563 2496.</p>
          <p>Conforme a la Ley 25.326 de Protección de Datos Personales, la Agencia de Acceso a la Información Pública es el órgano de control y atiende las denuncias y reclamos relacionados con el incumplimiento de las normas sobre datos personales.</p>
        </Seccion>

        <Seccion titulo="7. Cambios en estos términos">
          <p>Estos términos pueden actualizarse. La versión vigente es la publicada en esta página, y a cada inscripción se le aplica la versión vigente al momento de inscribirse.</p>
        </Seccion>
      </div>
    </div>
  );
};

export default Terminos;
