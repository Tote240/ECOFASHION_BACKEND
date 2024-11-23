import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import { productosService } from './firebaseServices';

function Pd() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos destacados desde Firebase
  useEffect(() => {
    const fetchProductosDestacados = async () => {
      try {
        setLoading(true);
        const productos = await productosService.obtenerProductosRecomendados();
        setProductosDestacados(productos);
      } catch (err) {
        setError('Error al cargar productos destacados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductosDestacados();
  }, []);

  const handleButtonClick = () => {
    navigate('/Productos');
  };

  const handleAddToCart = async (producto) => {
    if (producto.stock > 0) {
      addToCart(producto);
    } else {
      alert('Lo sentimos, este producto está agotado');
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Cargando productos destacados...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-2 fw-semibold mb-0">Productos Recomendados</h2>
          <p className="text-muted mb-0">Descubre nuestra selección especial</p>
        </div>
        <button 
          className="btn btn-dark px-4"
          onClick={handleButtonClick}
        >
          Ver Todos los Productos
        </button>
      </div>

      {productosDestacados.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No hay productos recomendados disponibles en este momento.</p>
        </div>
      ) : (
        <div className="row g-4">
          {productosDestacados.map((producto) => (
            <div key={producto.id} className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-scale">
                <div 
                  className="position-relative"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/descripcion/${producto.id}`)}
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="card-img-top object-fit-cover"
                    style={{ height: '320px' }}
                  />
                  {producto.stock === 0 && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                         style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <span className="badge bg-danger fs-6">Agotado</span>
                    </div>
                  )}
                  <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-warning text-dark">Destacado</span>
                  </div>
                </div>
                
                <div className="card-body">
                  <h3 className="card-title fs-5 mb-2">{producto.nombre}</h3>
                 
                  <div className="d-flex justify-content-between align-items-center mb-2">
                  <p className="card-text fs-4 fw-bold mb-0">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio)}
                  </p>
                    <span className="badge bg-secondary">
                      Stock: {producto.stock}
                    </span>
                  </div>
                  <button
                    className="btn btn-dark w-100"
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock === 0}
                  >
                    {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>
        {`
          .hover-scale {
            transition: transform 0.3s ease;
          }
          .hover-scale:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
    </div>
  );
}

export default Pd;