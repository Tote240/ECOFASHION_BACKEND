import React, { useState, useEffect } from 'react';
import { productosService } from './firebaseServices';
import { categoriaService } from './categoriaService';
import { useNavigate } from 'react-router-dom';
import { auth } from './Firebase';

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Estado para el formulario de nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    stock: '',
    categoria: '',
    recomendado: false,
    imagen: '', // URL
    caracteristicas: []
  });

  // Estado para el modo de edición y producto seleccionado
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Estado para las categorías
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('');

  // Verificar si el usuario es admin
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user || user.email !== 'admin@gmail.com') {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosData, categoriasData] = await Promise.all([
          productosService.obtenerProductos(),
          categoriaService.obtenerCategorias()
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (err) {
        setError('Error al cargar productos y categorías');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cargar productos
  const cargarProductos = async () => {
    try {
      setLoading(true);
      const productosData = await productosService.obtenerProductos();
      setProductos(productosData);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validar URL de la imagen
      if (!nuevoProducto.imagen.startsWith('http')) {
        alert('Por favor, ingrese una URL válida para la imagen');
        return;
      }

      // Crear objeto de producto
      const productoData = {
        nombre: nuevoProducto.nombre,
        precio: Number(nuevoProducto.precio),
        descripcion: nuevoProducto.descripcion,
        stock: Number(nuevoProducto.stock),
        categoria: nuevoProducto.categoria,
        recomendado: nuevoProducto.recomendado,
        imagen: nuevoProducto.imagen,
        caracteristicas: nuevoProducto.caracteristicas
      };
      await productosService.agregarProducto(productoData);
      await cargarProductos();

      // Limpiar formulario
      setNuevoProducto({
        nombre: '',
        precio: '',
        descripcion: '',
        stock: '',
        categoria: '',
        recomendado: false,
        imagen: '',
        caracteristicas: []
      });

      alert('Producto agregado exitosamente');

    } catch (err) {
      setError('Error al agregar producto');
      console.error(err);
      alert('Error al agregar producto');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        setLoading(true);
        await productosService.eliminarProducto(id);
        await cargarProductos();
        alert('Producto eliminado exitosamente');
      } catch (err) {
        setError('Error al eliminar producto');
        console.error(err);
        alert('Error al eliminar producto');
      } finally {
        setLoading(false);
      }
    }
  };

  // Actualizar stock
  const handleActualizarStock = async (id, nuevoStock) => {
    try {
      setLoading(true);
      await productosService.actualizarProducto(id, { stock: Number(nuevoStock) });
      await cargarProductos();
    } catch (err) {
      setError('Error al actualizar stock');
      console.error(err);
      alert('Error al actualizar stock');
    } finally {
      setLoading(false);
    }
  };

  // Manejar el envío del formulario de edición
  // Manejar el envío del formulario de edición
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validar URL de la imagen
      if (!selectedProduct.imagen.startsWith('http')) {
        alert('Por favor, ingrese una URL válida para la imagen');
        return;
      }

      // Crear objeto actualizado asegurándose de incluir recomendado
      const productoActualizado = {
        ...selectedProduct,
        precio: Number(selectedProduct.precio),
        stock: Number(selectedProduct.stock),
        recomendado: Boolean(selectedProduct.recomendado)
      };

      await productosService.actualizarProducto(selectedProduct.id, productoActualizado);
      await cargarProductos();
      setSelectedProduct(null);
      setEditMode(false);
      alert('Producto actualizado exitosamente');
    } catch (err) {
      setError('Error al actualizar producto');
      console.error(err);
      alert('Error al actualizar producto');
    } finally {
      setLoading(false);
    }
  };

  // Manejar la adición de una nueva categoría
  const handleAddCategoria = async (e) => {
    e.preventDefault();
    if (nuevaCategoria.trim() !== '') {
      try {
        setLoading(true);
        await categoriaService.agregarCategoria(nuevaCategoria.trim());
        const categoriasActualizadas = await categoriaService.obtenerCategorias();
        setCategorias(categoriasActualizadas);
        setNuevaCategoria('');
      } catch (err) {
        setError('Error al agregar categoría');
        console.error(err);
        alert('Error al agregar categoría');
      } finally {
        setLoading(false);
      }
    }
  };

  // Manejar la adición de una nueva característica
  const handleAddCaracteristica = (e) => {
    e.preventDefault();
    if (nuevaCaracteristica.trim() !== '') {
      setNuevoProducto({
        ...nuevoProducto,
        caracteristicas: [...nuevoProducto.caracteristicas, nuevaCaracteristica.trim()]
      });
      setNuevaCaracteristica('');
    }
  };

  // Eliminar categoría
  const handleEliminarCategoria = async (categoria) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria}"?`)) {
      try {
        setLoading(true);
        await categoriaService.eliminarCategoria(categoria);
        const categoriasActualizadas = await categoriaService.obtenerCategorias();
        setCategorias(categoriasActualizadas);
      } catch (err) {
        setError('Error al eliminar categoría');
        console.error(err);
        alert('Error al eliminar categoría');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && productos.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
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
    <div className="container mt-5">
      <h1 className="text-center text-dark mb-4">Panel de Administración</h1>

      {/* Formulario para agregar producto */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          <h2 className="h5 mb-0">Agregar Nuevo Producto</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del producto"
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({
                    ...nuevoProducto,
                    nombre: e.target.value
                  })}
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Precio"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({
                    ...nuevoProducto,
                    precio: e.target.value
                  })}
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Stock"
                  value={nuevoProducto.stock}
                  onChange={(e) => setNuevoProducto({
                    ...nuevoProducto,
                    stock: e.target.value
                  })}
                  required
                />
              </div>

              <div className="col-md-6">
                <select
                  className="form-select"
                  value={nuevoProducto.categoria}
                  onChange={(e) => setNuevoProducto({
                    ...nuevoProducto,
                    categoria: e.target.value
                  })}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="URL de la imagen"
                  value={nuevoProducto.imagen}
                  onChange={(e) => setNuevoProducto({
                    ...nuevoProducto,
                    imagen: e.target.value
                  })}
                  required
                />
              </div>

              <div className="col-12">
                <textarea
                  className="form-control"
                  placeholder="Descripción del producto"
                  value={nuevoProducto.descripcion}
                  onChange={(e) => setNuevoProducto({
                    ...nuevoProducto,
                    descripcion: e.target.value
                  })}
                  required
                  rows="3"
                />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={nuevoProducto.recomendado}
                    onChange={(e) => setNuevoProducto({
                      ...nuevoProducto,
                      recomendado: e.target.checked
                    })}
                    id="recomendadoCheck"
                  />
                  <label className="form-check-label" htmlFor="recomendadoCheck">
                    Producto recomendado
                  </label>
                </div>
              </div>

              {nuevoProducto.imagen && (
                <div className="col-12">
                  <div className="alert alert-info">
                    Vista previa de la imagen:
                    <img
                      src={nuevoProducto.imagen}
                      alt="Vista previa"
                      style={{ maxWidth: '200px', display: 'block', marginTop: '10px' }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                </div>
              )}

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={loading}
                >
                  {loading ? 'Agregando...' : 'Agregar Producto'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Formulario para añadir característica */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          <h2 className="h5 mb-0">Añadir Característica</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddCaracteristica}>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de la característica"
                  value={nuevaCaracteristica}
                  onChange={(e) => setNuevaCaracteristica(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={loading}
                >
                  {loading ? 'Añadiendo...' : 'Añadir Característica'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Tabla de categorías */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          <h2 className="h5 mb-0">Categorías</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria}>
                    <td>{categoria}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminarCategoria(categoria)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form onSubmit={handleAddCategoria} className="mt-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nueva categoría"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                required
              />
              <button
                className="btn btn-dark"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Añadiendo...' : 'Añadir Categoría'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Formulario de edición de producto */}
      {editMode && (
        <div className="card mb-4">
          <div className="card-header bg-dark text-white">
            <h2 className="h5 mb-0">Editar Producto</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleEditSubmit}>
              {/* Campos del formulario de edición */}
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del producto"
                    value={selectedProduct.nombre}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      nombre: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Precio"
                    value={selectedProduct.precio}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      precio: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Stock"
                    value={selectedProduct.stock}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      stock: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={selectedProduct.categoria}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      categoria: e.target.value
                    })}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="URL de la imagen"
                    value={selectedProduct.imagen}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      imagen: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="col-12">
                  <textarea
                    className="form-control"
                    placeholder="Descripción del producto"
                    value={selectedProduct.descripcion}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      descripcion: e.target.value
                    })}
                    required
                    rows="3"
                  />
                </div>
                <div className="col-12">
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="editRecomendadoCheck"
                      checked={selectedProduct.recomendado}
                      onChange={(e) => setSelectedProduct({
                        ...selectedProduct,
                        recomendado: e.target.checked
                      })}
                    />
                    <label className="form-check-label" htmlFor="editRecomendadoCheck">
                      Producto recomendado
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <h3 className="h5 mb-2">Características</h3>
                    <ul className="list-unstyled">
                      {selectedProduct.caracteristicas?.map((caracteristica, index) => (
                        <li key={index} className="d-flex align-items-center mb-2">
                          <i className="bi bi-check2 me-2 text-success"></i>
                          <span>{caracteristica}</span>
                        </li>
                      ))}

                    </ul>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nueva característica"
                        value={nuevaCaracteristica}
                        onChange={(e) => setNuevaCaracteristica(e.target.value)}
                      />
                      <button
                        className="btn btn-dark"
                        type="button"
                        onClick={() => {
                          setSelectedProduct({
                            ...selectedProduct,
                            caracteristicas: [...selectedProduct.caracteristicas, nuevaCaracteristica.trim()]
                          });
                          setNuevaCaracteristica('');
                        }}
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary me-2"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedProduct(null);
                      setEditMode(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="card">
        <div className="card-header bg-dark text-white">
          <h2 className="h5 mb-0">Inventario de Productos</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Recomendado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td>${producto.precio?.toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={producto.stock}
                        onChange={(e) => handleActualizarStock(producto.id, e.target.value)}
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>
                      <span className={`badge ${producto.recomendado ? 'bg-success' : 'bg-secondary'}`}>
                        {producto.recomendado ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => {
                          setSelectedProduct(producto);
                          setEditMode(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(producto.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;