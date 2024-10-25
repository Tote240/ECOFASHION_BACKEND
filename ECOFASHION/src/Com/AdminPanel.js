import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminPanel() {
  const [productos, setProductos] = useState(() => {
    const savedProducts = localStorage.getItem('productos');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [newProduct, setNewProduct] = useState({ nombre: '', precio: '', cantidad: '' });

  useEffect(() => {
    localStorage.setItem('productos', JSON.stringify(productos));
  }, [productos]);

  const handleAddProduct = () => {
    if (newProduct.nombre && (newProduct.precio || newProduct.cantidad)) {
      setProductos([...productos, { ...newProduct, id: productos.length + 1 }]);
      setNewProduct({ nombre: '', precio: '', cantidad: '' });
    }
  };

  const handleDeleteProduct = (id) => {
    setProductos(productos.filter((producto) => producto.id !== id));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-dark">Panel de Administración</h1>

      <h2 className="text-secondary mt-4">Inventario</h2>
      <table className="table table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>${producto.precio.toLocaleString()}</td>
              <td>{producto.cantidad}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDeleteProduct(producto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-secondary mt-5">Agregar Producto</h2>
      <div className="row mb-3 shadow p-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del producto"
            value={newProduct.nombre}
            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
          />
        </div>
        <div className="col-md-3 mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Precio"
            value={newProduct.precio}
            onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
          />
        </div>
        <div className="col-md-3 mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Cantidad"
            value={newProduct.cantidad}
            onChange={(e) => setNewProduct({ ...newProduct, cantidad: e.target.value })}
          />
        </div>
        <div className="col-md-12 text-center">
          <button className="btn btn-success" onClick={handleAddProduct}>Agregar Producto</button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

