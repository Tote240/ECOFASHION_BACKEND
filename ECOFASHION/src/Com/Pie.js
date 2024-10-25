import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ContactForm from '../Com/Formulario'; 
function Pie() {
  const [isFormVisible, setFormVisible] = useState(false); 
  const location = useLocation(); 


  const toggleFormVisibility = (e) => {
    e.preventDefault(); 
    setFormVisible(!isFormVisible); 
  };


  useEffect(() => {
    setFormVisible(false); 
  }, [location]); 

  return (
    <footer className="mt-auto bg-dark text-white py-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-6">
            <h3 className="fs-5 fw-semibold mb-3">Navegación</h3>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a href="/" className="nav-link text-white p-0">Home</a>
              </li>
              <li className="nav-item">
                <a href="/productos" className="nav-link text-white p-0">Productos</a>
              </li>
              <li className="nav-item">
                <a 
                  href="#" 
                  onClick={toggleFormVisibility} 
                  className="nav-link text-white p-0" 
                  style={{ cursor: 'pointer' }}
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-6">
            <h3 className="fs-5 fw-semibold mb-3">Políticas</h3>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a href="#" className="nav-link text-white p-0">Términos y Condiciones</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white p-0">Política de Privacidad</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white p-0">Política de Reembolsos</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white p-0">Política de Envíos</a>
              </li>
            </ul>
          </div>
        </div>

        {isFormVisible && (
          <div className="mt-4">
            <h3 className="fs-5 fw-semibold mb-3">Formulario de Contacto</h3>
            <ContactForm />
          </div>
        )}

        <div className="d-flex justify-content-end gap-3 mt-4">
          <i className="bi bi-whatsapp fs-4"></i>
          <i className="bi bi-instagram fs-4"></i>
        </div>
      </div>
    </footer>
  );
}

export default Pie;
