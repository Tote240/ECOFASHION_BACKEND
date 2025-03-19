import React, { useState, useEffect } from 'react';
import { shippingService } from './shippingService';
import Swal from 'sweetalert2';

const GestorEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');

  // Estados de envío posibles
  const estadosEnvio = [
    'pendiente', 
    'en preparación', 
    'en ruta', 
    'entregado', 
    'cancelado'
  ];

  // Cargar envíos
  useEffect(() => {
    const cargarEnvios = async () => {
      try {
        setLoading(true);
        const enviosData = filtroEstado 
          ? await shippingService.obtenerEnvios(filtroEstado)
          : await shippingService.obtenerEnvios();
        
        // Ordenar por fecha de creación más reciente
        const enviosOrdenados = enviosData.sort((a, b) => 
          new Date(b.fechaCreacion?.toDate()) - new Date(a.fechaCreacion?.toDate())
        );

        setEnvios(enviosOrdenados);
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los envíos',
          icon: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    cargarEnvios();
  }, [filtroEstado]);

  // Actualizar estado de envío
  const handleActualizarEstado = async (envioId, estadoActual) => {
    const { value: nuevoEstado } = await Swal.fire({
      title: 'Actualizar Estado de Envío',
      input: 'select',
      inputOptions: estadosEnvio.reduce((acc, estado) => {
        acc[estado] = estado.charAt(0).toUpperCase() + estado.slice(1);
        return acc;
      }, {}),
      inputValue: estadoActual,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar un estado';
        }
      }
    });

    if (nuevoEstado) {
      try {
        await shippingService.actualizarEstadoEnvio(envioId, nuevoEstado);
        
        // Actualizar estado local
        setEnvios(enviosAnteriores => 
          enviosAnteriores.map(envio => 
            envio.id === envioId 
              ? { ...envio, estado: nuevoEstado } 
              : envio
          )
        );

        Swal.fire({
          title: 'Éxito',
          text: 'Estado de envío actualizado',
          icon: 'success'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estado',
          icon: 'error'
        });
      }
    }
  };

  // Ver detalles de envío
  const verDetallesEnvio = (envio) => {
    Swal.fire({
      title: 'Detalles de Envío',
      html: `
        <div class="text-start">
          <p><strong>Número de Seguimiento:</strong> ${envio.trackingNumber}</p>
          <p><strong>Destinatario:</strong> ${envio.nombre} ${envio.apellido}</p>
          <p><strong>Dirección:</strong> ${envio.direccion}, ${envio.ciudad}, ${envio.region}</p>
          <p><strong>Teléfono:</strong> ${envio.telefono}</p>
          <p><strong>Email:</strong> ${envio.email}</p>
          <p><strong>Tipo de Entrega:</strong> ${envio.tipoEntrega}</p>
          <p><strong>Costo de Envío:</strong> $${envio.costoEnvio?.toLocaleString() || 'N/A'}</p>
          <p><strong>Estado Actual:</strong> ${envio.estado}</p>
        </div>
      `,
      icon: 'info'
    });
  };

  // Renderizar componente
  return (
    <div className="container-fluid mt-4">
      <div className="card">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Gestor de Envíos</h2>
          <select 
            className="form-select w-auto" 
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            {estadosEnvio.map(estado => (
              <option key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : envios.length === 0 ? (
            <div className="alert alert-info text-center">
              No hay envíos para mostrar
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Tracking</th>
                    <th>Destinatario</th>
                    <th>Dirección</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {envios.map((envio) => (
                    <tr key={envio.id}>
                      <td>{envio.trackingNumber}</td>
                      <td>{envio.nombre} {envio.apellido}</td>
                      <td>{envio.direccion}, {envio.ciudad}</td>
                      <td>
                        <span 
                          className={`badge ${
                            envio.estado === 'entregado' 
                              ? 'bg-success' 
                              : envio.estado === 'cancelado' 
                                ? 'bg-danger' 
                                : 'bg-warning'
                          }`}
                        >
                          {envio.estado}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-info"
                            onClick={() => verDetallesEnvio(envio)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-warning"
                            onClick={() => handleActualizarEstado(envio.id, envio.estado)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestorEnvios;