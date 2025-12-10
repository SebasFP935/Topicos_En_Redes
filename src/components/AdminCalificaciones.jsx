import React, { useState, useEffect } from 'react';
import { Search, Trash2, Star } from 'lucide-react';
import { adminAPI } from '../services/api';
import StarRating from './StarRating';

export default function AdminCalificaciones({ setVistaActual }) {
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  
  // Filtros
  const [busquedaCurso, setBusquedaCurso] = useState('');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    cargarCalificaciones();
  }, []);

  const cargarCalificaciones = async (filtros = {}) => {
    setCargando(true);
    try {
      const response = await adminAPI.obtenerCalificaciones(filtros);
      setCalificaciones(response.data);
    } catch (err) {
      console.error('Error al cargar calificaciones:', err);
      alert('Error al cargar las calificaciones');
    } finally {
      setCargando(false);
    }
  };

  const handleBuscar = () => {
    const filtros = {};
    if (busquedaCurso) filtros.cursoId = busquedaCurso;
    if (busquedaUsuario) filtros.usuarioId = busquedaUsuario;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    
    cargarCalificaciones(filtros);
  };

  const handleLimpiarFiltros = () => {
    setBusquedaCurso('');
    setBusquedaUsuario('');
    setFechaDesde('');
    setFechaHasta('');
    cargarCalificaciones();
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta calificación? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await adminAPI.eliminarCalificacion(id);
      alert('Calificación eliminada exitosamente');
      cargarCalificaciones();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar la calificación');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrado local adicional por texto
  const calificacionesFiltradas = calificaciones.filter(c => {
    const matchCurso = !busquedaCurso || 
      c.cursoTitulo?.toLowerCase().includes(busquedaCurso.toLowerCase()) ||
      c.cursoId?.toString().includes(busquedaCurso);
    
    const matchUsuario = !busquedaUsuario || 
      c.nombreUsuario?.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      c.usuarioId?.toString().includes(busquedaUsuario);
    
    return matchCurso && matchUsuario;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => setVistaActual('admin-dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Volver al Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Gestión de Calificaciones</h1>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtros de Búsqueda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso (ID o Título)
              </label>
              <input
                type="text"
                placeholder="Buscar por curso..."
                value={busquedaCurso}
                onChange={(e) => setBusquedaCurso(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario (ID o Nombre)
              </label>
              <input
                type="text"
                placeholder="Buscar por usuario..."
                value={busquedaUsuario}
                onChange={(e) => setBusquedaUsuario(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Desde
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleBuscar}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Buscar
            </button>
            <button
              onClick={handleLimpiarFiltros}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Tabla de Calificaciones */}
        {cargando ? (
          <div className="text-center py-12">Cargando calificaciones...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Curso</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calificación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Mod.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {calificacionesFiltradas.length > 0 ? (
                    calificacionesFiltradas.map((calificacion) => (
                      <tr key={calificacion.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {calificacion.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {calificacion.nombreUsuario}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {calificacion.usuarioId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {calificacion.cursoTitulo || `Curso #${calificacion.cursoId}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {calificacion.cursoId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StarRating 
                            rating={calificacion.puntuacion} 
                            readonly 
                            size={18}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatearFecha(calificacion.fechaCreacion)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {calificacion.fechaModificacion 
                            ? formatearFecha(calificacion.fechaModificacion)
                            : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleEliminar(calificacion.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar calificación"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No se encontraron calificaciones
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Resumen */}
            {calificacionesFiltradas.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t">
                <p className="text-sm text-gray-600">
                  Total de calificaciones: <span className="font-semibold">{calificacionesFiltradas.length}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}