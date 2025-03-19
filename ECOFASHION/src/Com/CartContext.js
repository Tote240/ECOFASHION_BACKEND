// src/CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from './Firebase';
import { carritoService } from './firebaseServices';
import { productosService } from './firebaseServices';
import Swal from 'sweetalert2';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setLoading(true);
      try {
        if (currentUser) {
          const carritoData = await carritoService.obtenerCarrito(currentUser.uid);
          setCarrito(carritoData.items || []);
        } else {
          setCarrito([]);
        }
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        setError('Error al cargar el carrito');
        setCarrito([]);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Agregar al carrito
  const addToCart = async (producto) => {
    try {
      if (!user) {
        Swal.fire({
          title: '¡Necesitas iniciar sesión!',
          text: 'Para agregar productos al carrito, primero debes iniciar sesión.',
          icon: 'info',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#212529',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#6c757d'
        });
        return;
      }

      const productoActual = await productosService.obtenerProductoPorId(producto.id);
      const cantidadDeseada = producto.cantidadDeseada || 1;

      if (!productoActual) {
        Swal.fire({
          title: 'Error',
          text: 'Producto no encontrado',
          icon: 'error',
          confirmButtonColor: '#212529'
        });
        return;
      }

      if (productoActual.stock <= 0) {
        Swal.fire({
          title: 'Producto agotado',
          text: 'Lo sentimos, este producto está agotado',
          icon: 'warning',
          confirmButtonColor: '#212529'
        });
        return;
      }

      const itemEnCarrito = carrito.find(item => item.id === producto.id);
      const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

      if (cantidadEnCarrito + cantidadDeseada > productoActual.stock) {
        Swal.fire({
          title: 'Stock limitado',
          text: `Solo hay ${productoActual.stock} unidades disponibles`,
          icon: 'warning',
          confirmButtonColor: '#212529'
        });
        return;
      }

      let nuevoCarrito;
      if (itemEnCarrito) {
        nuevoCarrito = carrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidadDeseada }
            : item
        );
      } else {
        nuevoCarrito = [...carrito, { ...producto, cantidad: cantidadDeseada }];
      }

      setCarrito(nuevoCarrito);
      await carritoService.actualizarCarrito(user.uid, nuevoCarrito);

      await productosService.actualizarProducto(producto.id, {
        stock: productoActual.stock - cantidadDeseada
      });

      Swal.fire({
        title: '¡Producto agregado!',
        text: 'El producto se agregó correctamente al carrito',
        icon: 'success',
        confirmButtonColor: '#212529',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#212529'
      });
    }
  };

  // Remover del carrito
  const removeFromCart = async (productoId) => {
    try {
      if (!user) {
        Swal.fire({
          title: 'Error',
          text: 'Debes iniciar sesión para modificar el carrito',
          icon: 'error',
          confirmButtonColor: '#212529'
        });
        return;
      }

      // Obtener el item del carrito antes de eliminarlo
      const itemCarrito = carrito.find(item => item.id === productoId);
      if (itemCarrito) {
        // Obtener el producto actual y restaurar su stock
        const productoActual = await productosService.obtenerProductoPorId(productoId);
        if (productoActual) {
          await productosService.actualizarProducto(productoId, {
            stock: productoActual.stock + itemCarrito.cantidad
          });
        }
      }

      const nuevoCarrito = carrito.filter(item => item.id !== productoId);
      setCarrito(nuevoCarrito);
      await carritoService.actualizarCarrito(user.uid, nuevoCarrito);

      Swal.fire({
        title: 'Producto eliminado',
        text: 'El producto se eliminó del carrito',
        icon: 'success',
        confirmButtonColor: '#212529',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#212529'
      });
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (productoId, nuevaCantidad) => {
    try {
      if (!user) {
        Swal.fire({
          title: 'Error',
          text: 'Debes iniciar sesión para modificar el carrito',
          icon: 'error',
          confirmButtonColor: '#212529'
        });
        return;
      }

      if (nuevaCantidad < 0) {
        Swal.fire({
          title: 'Error',
          text: 'La cantidad no puede ser negativa',
          icon: 'error',
          confirmButtonColor: '#212529'
        });
        return;
      }

      if (nuevaCantidad === 0) {
        await removeFromCart(productoId);
        return;
      }

      const productoActual = await productosService.obtenerProductoPorId(productoId);
      const itemCarrito = carrito.find(item => item.id === productoId);

      if (!productoActual || !itemCarrito) {
        Swal.fire({
          title: 'Error',
          text: 'Producto no encontrado',
          icon: 'error',
          confirmButtonColor: '#212529'
        });
        return;
      }

      const diferenciaCantidad = nuevaCantidad - itemCarrito.cantidad;
      const nuevoStock = productoActual.stock - diferenciaCantidad;

      if (nuevoStock < 0) {
        Swal.fire({
          title: 'Stock insuficiente',
          text: `Solo hay ${productoActual.stock} unidades disponibles`,
          icon: 'warning',
          confirmButtonColor: '#212529'
        });
        return;
      }

      const nuevoCarrito = carrito.map(item =>
        item.id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      );

      setCarrito(nuevoCarrito);
      await carritoService.actualizarCarrito(user.uid, nuevoCarrito);
      await productosService.actualizarProducto(productoId, {
        stock: nuevoStock
      });

      Swal.fire({
        title: 'Cantidad actualizada',
        text: 'Se actualizó la cantidad en el carrito',
        icon: 'success',
        confirmButtonColor: '#212529',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#212529'
      });
    }
  };

  // Limpiar carrito completamente
  const clearCart = async () => {
    try {
      setLoading(true);

      // Restaurar stock de todos los productos
      if (user && carrito.length > 0) {
        for (const item of carrito) {
          const productoActual = await productosService.obtenerProductoPorId(item.id);
          if (productoActual) {
            await productosService.actualizarProducto(item.id, {
              stock: productoActual.stock + item.cantidad
            });
          }
        }

        // Eliminar el carrito en Firebase
        await carritoService.eliminarCarrito(user.uid);
      }

      // Limpiar el estado local
      setCarrito([]);
      
      console.log('Carrito limpiado exitosamente');
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      // Intentar limpiar el estado local de todas formas
      setCarrito([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const getTotalItems = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <CartContext.Provider
      value={{
        carrito,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalItems,
        loading,
        error,
        user
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;