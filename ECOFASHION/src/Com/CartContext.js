import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Estado del carrito
  const [carrito, setCarrito] = useState([]);

  // Agregar producto al carrito
  const addToCart = (producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map(item =>
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = (productoId) => {
    setCarrito(carrito.filter(item => item.id !== productoId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito(
      carrito.map(item =>
        item.id === productoId 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  // Vaciar todo el carrito
  const clearCart = () => {
    setCarrito([]);
  };

  // Calcular el total del carrito
  const getTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Obtener el número total de items en el carrito
  const getTotalItems = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <CartContext.Provider 
      value={{
        carrito,
        setCarrito,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;