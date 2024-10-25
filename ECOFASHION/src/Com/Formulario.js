import React from 'react';
import './eFormulario.css'; 

const ContactForm = () => {
  return (
    <div className="contact-container">
      <h2>Información de contacto</h2>
      
      <div className="form-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Tu nombre" required />
          <input type="email" placeholder="Correo electrónico" required />
          <textarea placeholder="Tu mensaje..." required />
          <button type="submit">Enviar</button>
        </form>
      </div>
      
      <div className="social-container">
        <p>O háblanos a nuestras redes sociales</p>
        <div className="social-links">
          <div>
            <i className="bi bi-whatsapp"></i> {/* Icono de WhatsApp */}
            <span> +56 9 2334 5676</span>
          </div>
          <div>
            <i className="bi bi-instagram"></i> {/* Icono de Instagram */}
            <span> @ecofashion</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
