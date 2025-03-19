import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from './CartContext';
import { paymentService } from './paymentService';
import { shippingService } from './shippingService';

const ConfirmarPago = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, carrito } = useContext(CartContext);
  const [procesado, setProcesado] = useState(false);
  const [estado, setEstado] = useState('procesando'); // 'procesando', 'exitoso', 'error'

  useEffect(() => {
    const procesarPago = async () => {
      if (procesado) return;
      setProcesado(true);

      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token_ws');
        const ordenId = params.get('ordenId');
        const tbkToken = params.get('TBK_TOKEN');

        if (tbkToken) {
          if (ordenId) {
            await shippingService.actualizarEstadoEnvio(ordenId, 'cancelado');
          }
          setEstado('cancelado');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        if (!token || !ordenId) {
          throw new Error('Parámetros inválidos');
        }

        const response = await fetch('http://localhost:3001/confirmar-transaccion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const resultado = await response.json();

        if (resultado.status === 'success' || resultado.response_code === 0) {
          await shippingService.actualizarEstadoEnvio(ordenId, 'pendiente');
          await paymentService.actualizarStock(carrito);
          await clearCart();
          
          setEstado('exitoso');
          setTimeout(() => navigate('/'), 2000);
        } else {
          throw new Error('Pago no completado');
        }
      } catch (error) {
        console.error('Error en el proceso:', error);
        setEstado('error');
        setTimeout(() => navigate('/'), 2000);
      }
    };

    procesarPago();
  }, []);

  const renderMensaje = () => {
    switch (estado) {
      case 'procesando':
        return (
          <div className="card border-0 shadow-sm p-4 text-center" style={{ maxWidth: '400px' }}>
            <div className="spinner-border text-dark mx-auto mb-4" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Procesando...</span>
            </div>
            <h4 className="mb-3">Procesando tu compra</h4>
            <p className="text-muted mb-0">Por favor, espera un momento mientras confirmamos tu pago...</p>
          </div>
        );
      case 'exitoso':
        return (
          <div className="card border-0 shadow-sm" style={{ maxWidth: '400px' }}>
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <div className="success-animation">
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                </div>
              </div>
              <h4 className="text-success mb-3">¡Pago exitoso!</h4>
              <p className="text-muted mb-0">Tu compra ha sido procesada correctamente</p>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="card border-0 shadow-sm" style={{ maxWidth: '400px' }}>
            <div className="card-body text-center p-5">
              <div className="mb-4 text-danger">
                <i className="bi bi-x-circle" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4 className="text-danger mb-3">Error en el proceso</h4>
              <p className="text-muted mb-0">Hubo un problema al procesar tu compra</p>
            </div>
          </div>
        );
      case 'cancelado':
        return (
          <div className="card border-0 shadow-sm" style={{ maxWidth: '400px' }}>
            <div className="card-body text-center p-5">
              <div className="mb-4 text-warning">
                <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4 className="text-warning mb-3">Pago cancelado</h4>
              <p className="text-muted mb-0">El proceso de pago fue cancelado</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>
        {`
          .success-animation {
            margin: 0 auto;
          }
          .checkmark {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: block;
            stroke-width: 2;
            stroke: #4bb71b;
            stroke-miterlimit: 10;
            box-shadow: inset 0px 0px 0px #4bb71b;
            animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
          }
          .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            stroke: #4bb71b;
            fill: none;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }
          .checkmark__check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
          }
          @keyframes stroke {
            100% { stroke-dashoffset: 0; }
          }
          @keyframes scale {
            0%, 100% { transform: none; }
            50% { transform: scale3d(1.1, 1.1, 1); }
          }
          @keyframes fill {
            100% { box-shadow: inset 0px 0px 0px 30px #4bb71b; }
          }
        `}
      </style>
      <div className="container py-5">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
          {renderMensaje()}
        </div>
      </div>
    </>
  );
};

export default ConfirmarPago;
