import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import { auth } from './Firebase';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CartModal = ({ isOpen, onClose }) => {
  const {
    carrito,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    loading
  } = useContext(CartContext);
  
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();
  const total = getTotal();

  // Eliminar producto
  const handleEliminarProducto = async (productoId) => {
    try {
      await removeFromCart(productoId);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el producto',
        icon: 'error',
        confirmButtonColor: '#212529'
      });
    }
  };

  // Vaciar carrito
  const handleVaciarCarrito = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminarán todos los productos del carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#212529',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await clearCart();
        Swal.fire({
          title: 'Carrito vaciado',
          text: 'Se han eliminado todos los productos',
          icon: 'success',
          confirmButtonColor: '#212529',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo vaciar el carrito',
        icon: 'error',
        confirmButtonColor: '#212529'
      });
    }
  };

  // Proceder al formulario de envío
  const handleContinuar = () => {
    if (!auth.currentUser) {
      Swal.fire({
        title: 'Iniciar sesión',
        text: 'Debes iniciar sesión para continuar con la compra',
        icon: 'info',
        confirmButtonColor: '#212529'
      }).then(() => {
        localStorage.setItem('redirectAfterLogin', '/shipping');
        navigate('/login');
        onClose();
      });
      return;
    }

    navigate('/shipping');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50"
         style={{ zIndex: 1050 }}>
      <div className="position-fixed top-0 end-0 h-100 bg-white p-4 shadow"
           style={{ width: '400px', overflowY: 'auto' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fs-4 mb-0">Mi Carrito</h2>
          <button
            className="btn-close"
            onClick={onClose}
            disabled={procesando}
            aria-label="Cerrar"
          ></button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {!loading && (!carrito || carrito.length === 0) && (
          <div className="text-center py-4">
            <i className="bi bi-cart-x fs-1 text-muted"></i>
            <p className="text-muted mt-2">Tu carrito está vacío</p>
            <button
              className="btn btn-dark"
              onClick={() => {
                onClose();
                navigate('/productos');
              }}
            >
              Ir a Productos
            </button>
          </div>
        )}

        {!loading && carrito && carrito.length > 0 && (
          <>
            <div className="cart-items mb-4">
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
                        <p className="card-text fw-bold">
                          ${item.precio?.toLocaleString()}
                        </p>
                        
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            disabled={procesando || item.cantidad <= 1}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          
                          <span className="mx-2 fw-bold">{item.cantidad}</span>
                          
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            disabled={procesando}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                          
                          <button
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => handleEliminarProducto(item.id)}
                            disabled={procesando}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>

                        <p className="card-text small text-muted mt-2">
                          Subtotal: ${(item.precio * item.cantidad).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold">Total:</span>
                <span className="fs-5 fw-bold">
                  ${total.toLocaleString()}
                </span>
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-danger"
                  onClick={handleVaciarCarrito}
                  disabled={procesando}
                >
                  {procesando ? (
                    <span className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"></span>
                  ) : (
                    <i className="bi bi-trash me-2"></i>
                  )}
                  Vaciar Carrito
                </button>
                
                <button
                  className="btn btn-dark"
                  onClick={handleContinuar}
                  disabled={procesando || carrito.length === 0}
                >
                  {procesando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-right me-2"></i>
                      Continuar con el envío
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3">
                <p className="text-muted small mb-0">
                  <i className="bi bi-shield-check me-1"></i>
                  Pago seguro garantizado
                </p>
                <p className="text-muted small mb-0">
                  <i className="bi bi-truck me-1"></i>
                  Envío gratis en compras sobre $30.000
                </p>
                <p className="text-muted small mb-0">
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  30 días para cambios y devoluciones
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;