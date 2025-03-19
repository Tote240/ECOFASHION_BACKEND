import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import { paymentService } from './paymentService';
import { shippingService } from './shippingService';
import { auth } from './Firebase';
import Swal from 'sweetalert2';

const ShippingForm = () => {
  const navigate = useNavigate();
  const { carrito, getTotal } = useContext(CartContext);
  const [procesando, setProcesando] = useState(false);
  const [costoEnvio, setCostoEnvio] = useState(3000);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    tipoEntrega: 'normal'
  });

  const subtotal = getTotal();

  useEffect(() => {
    const calcularEnvio = async () => {
      const costo = await shippingService.calcularCostoEnvio({
        region: formData.region,
        peso: carrito.reduce((total, item) => total + (item.peso || 1) * item.cantidad, 1)
      });
      setCostoEnvio(subtotal >= 30000 ? 0 : costo);
    };
    calcularEnvio();
  }, [formData.region, carrito, subtotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setProcesando(true);
      const user = auth.currentUser;

      // Crear orden de envío
      const datosEnvio = {
        ...formData,
        userId: user.uid,
        costoEnvio,
        items: carrito,
        subtotal,
        total: subtotal + costoEnvio
      };

      const ordenEnvio = await shippingService.crearOrdenEnvio(datosEnvio);
      
      // Crear datos para Transbank
      const datosOrden = {
        items: carrito.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad
        })),
        shipping: {
          ...formData,
          trackingNumber: ordenEnvio.trackingNumber
        },
        costoEnvio,
        subtotal,
        total: subtotal + costoEnvio,
        buyOrder: ordenEnvio.trackingNumber,
        sessionId: `S-${Date.now()}`
      };

      // Iniciar transacción con Transbank
      const datosTransaccion = await paymentService.iniciarTransaccion({
        ...datosOrden,
        returnUrl: `${window.location.origin}/confirmar-pago?ordenId=${ordenEnvio.id}`
      });

      if (!datosTransaccion?.url || !datosTransaccion?.token) {
        throw new Error('Error al iniciar la transacción');
      }

      // Redireccionar a Transbank
      window.location.href = datosTransaccion.url + '?token_ws=' + datosTransaccion.token;

    } catch (error) {
      console.error('Error en el proceso:', error);
      setProcesando(false);
      
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al procesar tu pedido. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#212529'
      });
    }
  };

  if (carrito.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-dark text-white py-3">
              <h2 className="text-center mb-0 h4">Información de envío</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Nombre"
                      />
                      <label htmlFor="nombre">Nombre</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                        placeholder="Apellido"
                      />
                      <label htmlFor="apellido">Apellido</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Email"
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="tel"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        placeholder="Teléfono"
                      />
                      <label htmlFor="telefono">Teléfono</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                        placeholder="Dirección"
                      />
                      <label htmlFor="direccion">Dirección</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        required
                        placeholder="Ciudad"
                      />
                      <label htmlFor="ciudad">Ciudad</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar región</option>
                        <option value="Metropolitana">Metropolitana</option>
                        <option value="Valparaíso">Valparaíso</option>
                        <option value="Biobío">Biobío</option>
                        <option value="La Araucanía">La Araucanía</option>
                        <option value="Arica y Parinacota">Arica y Parinacota</option>
                        <option value="Tarapacá">Tarapacá</option>
                        <option value="Antofagasta">Antofagasta</option>
                        <option value="Atacama">Atacama</option>
                        <option value="Coquimbo">Coquimbo</option>
                        <option value="O'Higgins">O'Higgins</option>
                        <option value="Maule">Maule</option>
                        <option value="Ñuble">Ñuble</option>
                        <option value="Los Ríos">Los Ríos</option>
                        <option value="Los Lagos">Los Lagos</option>
                        <option value="Aysén">Aysén</option>
                        <option value="Magallanes">Magallanes</option>
                      </select>
                      <label htmlFor="region">Región</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="codigoPostal"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        required
                        placeholder="Código Postal"
                      />
                      <label htmlFor="codigoPostal">Código Postal</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="tipoEntrega"
                        name="tipoEntrega"
                        value={formData.tipoEntrega}
                        onChange={handleChange}
                        required
                      >
                        <option value="normal">Entrega Normal</option>
                        <option value="express">Entrega Express</option>
                      </select>
                      <label htmlFor="tipoEntrega">Tipo de Entrega</label>
                    </div>
                  </div>
                </div>

                <div className="card mt-4 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="card-title h5 mb-3">Resumen del pedido</h3>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Envío:</span>
                      <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString()}`}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>${(subtotal + costoEnvio).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-3"
                    disabled={procesando}
                  >
                    {procesando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock me-2"></i>
                        Continuar al pago
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;