// src/firebaseServices.js
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  increment,
  addDoc
} from 'firebase/firestore';
import { db } from './Firebase';

// Servicios para productos
export const productosService = {
  // Agregar producto
  async agregarProducto(productoData) {
    try {
      if (!productoData.nombre || !productoData.precio || !productoData.stock || !productoData.categoria) {
        throw new Error('Faltan campos requeridos');
      }

      // Generar ID secuencial
      const querySnapshot = await getDocs(collection(db, 'productos'));
      let maxId = 0;
      querySnapshot.forEach((doc) => {
        const productId = doc.data().productId || 0;
        if (typeof productId === 'number' && productId > maxId) {
          maxId = productId;
        }
      });

      const productId = maxId + 1;
      
      const productoConId = {
        ...productoData,
        productId,
        nombre: productoData.nombre.trim(),
        precio: Number(productoData.precio),
        stock: Number(productoData.stock),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = doc(collection(db, 'productos'), `PROD_${productId}`);
      await setDoc(docRef, productoConId);

      return { id: docRef.id, ...productoConId };
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  },

  // Obtener productos
  async obtenerProductos() {
    try {
      const querySnapshot = await getDocs(collection(db, 'productos'));
      return querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => a.productId - b.productId);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  // Obtener producto por ID
  async obtenerProductoPorId(id) {
    try {
      const docRef = doc(db, 'productos', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  // Actualizar producto
  async actualizarProducto(id, datos) {
    try {
      const docRef = doc(db, 'productos', id);
      await updateDoc(docRef, {
        ...datos,
        updatedAt: serverTimestamp()
      });
      return { id, ...datos };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  // Eliminar producto
  async eliminarProducto(id) {
    try {
      await deleteDoc(doc(db, 'productos', id));
      return id;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  // Obtener productos recomendados
  async obtenerProductosRecomendados() {
    try {
      const q = query(
        collection(db, 'productos'),
        where('recomendado', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => a.productId - b.productId);
    } catch (error) {
      console.error('Error al obtener productos recomendados:', error);
      throw error;
    }
  }
};

// Servicio para carritos
export const carritoService = {
  async actualizarCarrito(userId, items) {
    try {
      const carritoRef = doc(db, 'carritos', userId);
      const carritoData = {
        userId,
        items,
        updatedAt: serverTimestamp(),
        totalItems: items.reduce((sum, item) => sum + item.cantidad, 0),
        totalAmount: items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
      };

      await setDoc(carritoRef, carritoData);
      return items;
    } catch (error) {
      console.error('Error al actualizar carrito:', error);
      throw error;
    }
  },

  async obtenerCarrito(userId) {
    try {
      if (!userId) return { items: [] };

      const docRef = doc(db, 'carritos', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }

      return { items: [] };
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return { items: [] };
    }
  },

  async eliminarCarrito(userId) {
    try {
      if (!userId) return;
      
      await deleteDoc(doc(db, 'carritos', userId));
      console.log('Carrito eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar carrito:', error);
      throw error;
    }
  }
};

// Servicio para órdenes
export const ordenesService = {
  async crearOrden(ordenData) {
    try {
      const ordenRef = await addDoc(collection(db, 'ordenes'), {
        ...ordenData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return ordenRef.id;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  },

  async actualizarEstadoOrden(ordenId, nuevoEstado, detallesTransaccion = null) {
    try {
      const ordenRef = doc(db, 'ordenes', ordenId);
      await updateDoc(ordenRef, {
        estado: nuevoEstado,
        detallesTransaccion,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      throw error;
    }
  },

  async obtenerOrdenesUsuario(userId) {
    try {
      const q = query(collection(db, 'ordenes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw error;
    }
  }
};

// Servicio para actualización de stock
export const stockService = {
  async actualizarStock(productoId, cantidad) {
    try {
      const productoRef = doc(db, 'productos', productoId);
      await updateDoc(productoRef, {
        stock: increment(-cantidad),
        updatedAt: serverTimestamp()
      });
      console.log(`Stock actualizado para producto ${productoId}: -${cantidad}`);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  },

  async restaurarStock(productoId, cantidad) {
    try {
      const productoRef = doc(db, 'productos', productoId);
      await updateDoc(productoRef, {
        stock: increment(cantidad),
        updatedAt: serverTimestamp()
      });
      console.log(`Stock restaurado para producto ${productoId}: +${cantidad}`);
    } catch (error) {
      console.error('Error al restaurar stock:', error);
      throw error;
    }
  }
};

// Utilidad para verificar si un usuario es administrador
export const isAdmin = (user) => {
  return user?.email === 'admin@gmail.com';
};