import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from './CartContext';
import { productosService } from './firebaseServices';
import Swal from 'sweetalert2';

function ProductDescription() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const productoData = await productosService.obtenerProductoPorId(id);
        setProducto(productoData);
      } catch (err) {
        setError('Error al cargar el producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, producto?.stock || 1));
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      if (!producto) return;

      if (quantity > producto.stock) {
        Swal.fire({
          title: 'Stock insuficiente',
          text: `Solo hay ${producto.stock} unidades disponibles`,
          icon: 'warning',
          confirmButtonColor: '#212529'
        });
        return;
      }

      const productoConCantidad = {
        ...producto,
        cantidadDeseada: quantity
      };

      await addToCart(productoConCantidad);
      setQuantity(1);

    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

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

  if (error || !producto) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Producto no encontrado'}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '600px', width: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="col-12 col-md-6">
          <h1 className="fs-2 fw-bold mb-3">{producto.nombre}</h1>
          <p className="fs-3 fw-bold mb-4">${producto.precio.toLocaleString()}</p>

          <div className="mb-4">
            <h2 className="fs-5 fw-semibold mb-2">Descripción</h2>
            <p className="text-muted">{producto.descripcion}</p>
          </div>

          <div className="mb-4">
            <h2 className="fs-5 fw-semibold mb-2">Características</h2>
            {producto.caracteristicas && (
              <ul className="list-unstyled">
                {producto.caracteristicas.map((caracteristica, index) => (
                  <li key={index} className="mb-2">
                    <i className="bi bi-check2 me-2 text-success"></i>
                    {caracteristica}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="form-label">Cantidad</label>
            <div className="input-group" style={{ width: '140px' }}>
              <button
                className="btn btn-outline-dark"
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <i className="bi bi-dash"></i>
              </button>
              <input
                type="number"
                className="form-control text-center"
                id="quantity"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={producto.stock}
              />
              <button
                className="btn btn-outline-dark"
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= producto.stock}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
            <small className="text-muted">
              Stock disponible: {producto.stock} unidades
            </small>
          </div>

          <button
            className="btn btn-dark btn-lg w-100"
            onClick={handleAddToCart}
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? 'Producto agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDescription;