import { 
    collection, 
    doc, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    serverTimestamp,
    updateDoc
  } from 'firebase/firestore';
  import { db } from './Firebase';
  
  export const shippingService = {
    // Calcular costo de envío simulado
    async calcularCostoEnvio(datosEnvio) {
      try {
        // Lógica simulada de cálculo de envío
        const basePrice = 3000; // Precio base de envío
        const weightFactor = (datosEnvio.peso || 1) * 100; // Ejemplo de cálculo por peso
        const distanceFactor = datosEnvio.destino ? 500 : 0; // Factor por distancia
        
        // Regiones con sobrecargo
        const regionesCaras = ['Magallanes', 'Aysén', 'Atacama'];
        const regionSobrecargo = regionesCaras.includes(datosEnvio.region) ? 2000 : 0;
        
        const costoEnvio = Math.round(basePrice + weightFactor + distanceFactor + regionSobrecargo);
        
        // Aplicar descuento si el pedido supera los $30.000
        return costoEnvio > 3000 ? costoEnvio : 3000;
      } catch (error) {
        console.error('Error calculando costo de envío:', error);
        return 3000; // Costo de envío por defecto
      }
    },
  
    // Crear orden de envío simulada
    async crearOrdenEnvio(datosEnvio) {
      try {
        // Generar tracking number simulado
        const trackingNumber = `CE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
        // Guardar datos de envío en Firebase
        const shippingRef = await addDoc(collection(db, 'envios'), {
          ...datosEnvio,
          trackingNumber: trackingNumber,
          estado: 'pendiente',
          fechaCreacion: serverTimestamp(),
          ultimaActualizacion: serverTimestamp()
        });
  
        return {
          id: shippingRef.id,
          trackingNumber: trackingNumber
        };
      } catch (error) {
        console.error('Error creando orden de envío:', error);
        throw error;
      }
    },
  
    // Obtener envíos 
    async obtenerEnvios(estado = null) {
      try {
        let q = query(collection(db, 'envios'));
        
        if (estado) {
          q = query(collection(db, 'envios'), where('estado', '==', estado));
        }
  
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error obteniendo envíos:', error);
        throw error;
      }
    },
  
    // Actualizar estado de envío
    async actualizarEstadoEnvio(envioId, nuevoEstado) {
      try {
        const envioRef = doc(db, 'envios', envioId);
        await updateDoc(envioRef, {
          estado: nuevoEstado,
          ultimaActualizacion: serverTimestamp()
        });
      } catch (error) {
        console.error('Error actualizando estado de envío:', error);
        throw error;
      }
    },
  
    // Obtener tracking de envío simulado
    async obtenerTrackingEnvio(trackingNumber) {
      try {
        // Estados simulados de envío
        const estadosPosibles = [
          'Preparando',
          'En centro de distribución',
          'En ruta',
          'Próximo a entrega',
          'Entregado'
        ];
  
        // Calcular estado y fecha estimada de manera aleatoria
        const estadoActual = estadosPosibles[Math.floor(Math.random() * estadosPosibles.length)];
        const fechaEstimadaEntrega = new Date(Date.now() + (3 + Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000);
  
        return {
          trackingNumber,
          estado: estadoActual,
          ubicacionActual: 'Santiago, Región Metropolitana',
          fechaEstimadaEntrega
        };
      } catch (error) {
        console.error('Error obteniendo tracking de envío:', error);
        throw error;
      }
    },
  
    // Método para obtener envíos por usuario
    async obtenerEnviosUsuario(userId) {
      try {
        const q = query(
          collection(db, 'envios'), 
          where('userId', '==', userId)
        );
  
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error obteniendo envíos de usuario:', error);
        throw error;
      }
    }
  };
  
  export default shippingService;