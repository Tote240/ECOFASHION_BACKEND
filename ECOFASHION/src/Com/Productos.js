import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import { productosService } from './firebaseServices';
import '../Com/style.css';

function Productos() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const productosData = await productosService.obtenerProductos();
        setProductos(productosData);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleImageClick = (id) => {
    navigate(`/descripcion/${id}`);
  };

  const handleAddToCart = (producto) => {
    if (producto.stock > 0) {
      addToCart(producto);
    } else {
      alert('Lo sentimos, este producto está agotado');
    }
  };

  const filteredProducts = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         producto.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || producto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categorias = [...new Set(productos.map(p => p.categoria))].filter(Boolean);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Cargando...</span>
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
    <div className="container py-4">
      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-1000 mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-1000 mb-3">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="row g-4">
        {filteredProducts.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          filteredProducts.map((producto) => (
            <div key={producto.id} className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm product-card">
                <div 
                  className="product-image-container"
                  onClick={() => handleImageClick(producto.id)}
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="card-img-top product-image"
                  />
                  {producto.stock === 0 && (
                    <div className="out-of-stock-overlay">
                      <span className="badge bg-danger fs-6">Agotado</span>
                    </div>
                  )}
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h3 className="card-title product-title">{producto.nombre}</h3>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <p className="product-price mb-0">
                        {new Intl.NumberFormat('es-CL', { 
                          style: 'currency', 
                          currency: 'CLP' 
                        }).format(producto.precio)}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Productos;