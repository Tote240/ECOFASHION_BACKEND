import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';

const CartModal = ({ isOpen, onClose }) => {
  const { carrito, setCarrito } = useContext(CartContext);
  
  // Calcular precio total
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  // Eliminar un producto
  const eliminarProducto = (productId) => {
    setCarrito(carrito.filter(item => item.id !== productId));
  };
  
  // Vaciar carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };
  
  // Actualizar cantidad
  const actualizarCantidad = (productId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setCarrito(carrito.map(item => 
      item.id === productId ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="position-fixed top-0 end-0 h-100 bg-white p-4 shadow" style={{ width: '400px', overflowY: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fs-4 mb-0">Mi Carrito</h2>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
        </div>
        
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <>
            {carrito.map((item) => (
              <div key={item.id} className="card mb-3 border-0 shadow-sm">
                <div className="row g-0">
                  <div className="col-4">
                    <img 
                      src={item.imagen} 
                      alt={item.nombre} 
                      className="img-fluid rounded-start object-fit-cover h-100"
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body">
                      <h5 className="card-title fs-6">{item.nombre}</h5>
                      <p className="card-text fw-bold">${item.precio.toLocaleString()}</p>
                      <div className="d-flex align-items-center gap-2">
                        <button 
                          className="btn btn-sm btn-outline-dark" 
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button 
                          className="btn btn-sm btn-outline-dark" 
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => eliminarProducto(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-top pt-3 mt-3">
              <p className="fs-5 fw-bold">Total a pagar: ${total.toLocaleString()}</p>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-danger"
                  onClick={vaciarCarrito}
                >
                  Vaciar Carrito
                </button>
                <button className="btn btn-dark">
                  Finalizar Compra
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;