import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './Firebase';
import { productosService } from './firebaseServices';

export const paymentService = {
  // Crear orden
  async crearOrden(datosOrden) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      const ordenParaGuardar = {
        ...datosOrden,
        userId: user.uid,
        userEmail: user.email,
        estado: 'pendiente',
        fechaCreacion: serverTimestamp(),
        items: datosOrden.items.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad
        }))
      };

      const ordenRef = await addDoc(collection(db, 'ordenes'), ordenParaGuardar);
      console.log('Orden creada:', ordenRef.id);
      return ordenRef.id;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  },

  // Actualizar estado de orden
  async actualizarEstadoOrden(ordenId, estado, detallesTransaccion = null) {
    try {
      console.log('Actualizando estado de orden:', { ordenId, estado });
      const ordenRef = doc(db, 'ordenes', ordenId);
      await updateDoc(ordenRef, {
        estado,
        detallesTransaccion,
        fechaActualizacion: serverTimestamp()
      });
      console.log('Estado de orden actualizado');
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      throw error;
    }
  },

  // Actualizar stock
  async actualizarStock(items) {
    try {
      console.log('Iniciando actualización de stock para:', items);
      for (const item of items) {
        const productoRef = doc(db, 'productos', item.id);

        // Obtener el documento actual
        const productoDoc = await getDoc(productoRef);
        if (productoDoc.exists()) {
          const stockActual = productoDoc.data().stock;
          const nuevoStock = Math.max(0, stockActual - item.cantidad);

          console.log(`Actualizando stock del producto ${item.id}:`, {
            stockActual,
            cantidad: item.cantidad,
            nuevoStock
          });

          // Actualizar el stock
          await productosService.actualizarProducto(item.id, {
            stock: nuevoStock
          });
        }
      }
      console.log('Stock actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  },

  // Iniciar transacción con Transbank
  async iniciarTransaccion(datosOrden) {
    try {
      const response = await fetch('http://localhost:3001/crear-transaccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(datosOrden.total),
          buyOrder: datosOrden.buyOrder,
          sessionId: datosOrden.sessionId,
          returnUrl: datosOrden.returnUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar la transacción');
      }

      const data = await response.json();
      console.log('Respuesta de iniciar transacción:', data);

      return data;
    } catch (error) {
      console.error('Error al iniciar transacción:', error);
      throw error;
    }
  }
};