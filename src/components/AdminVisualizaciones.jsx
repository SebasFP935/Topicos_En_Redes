import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Filter, TrendingUp } from 'lucide-react';
import { adminAPI } from '../services/api';

export default function AdminVisualizaciones({ setVistaActual }) {
  const [visualizaciones, setVisualizaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  
  // Filtros
  const [busquedaVideo, setBusquedaVideo] = useState('');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    cargarVisualizaciones();
    cargarEstadisticas();
  }, []);

  const cargarVisualizaciones = async (filtros = {}) => {
    setCargando(true);
    try {
      const response = await adminAPI.obtenerVisualizaciones(filtros);
      setVisualizaciones(response.data);
    } catch (err) {
      console.error('Error al cargar visualizaciones:', err);
      alert('Error al cargar las visualizaciones');
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await adminAPI.obtenerEstadisticasVisualizaciones();
      setEstadisticas(response.data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleBuscar = () => {
    const filtros = {};
    if (busquedaVideo) filtros.videoId = busquedaVideo;
    if (busquedaUsuario) filtros.usuarioId = busquedaUsuario;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    
    cargarVisualizaciones(filtros);
  };

  const handleLimpiarFiltros = () => {
    setBusquedaVideo('');
    setBusquedaUsuario('');
    setFechaDesde('');
    setFechaHasta('');
    cargarVisualizaciones();
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este registro de visualización?')) {
      return;
    }

    try {
      await adminAPI.eliminarVisualizacion(id);
      alert('Visualización eliminada exitosamente');
      cargarVisualizaciones();
      cargarEstadisticas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar la visualización');
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
  const visualizacionesFiltradas = visualizaciones.filter(v => {
    const matchVideo = !busquedaVideo || 
      v.videoTitulo?.toLowerCase().includes(busquedaVideo.toLowerCase()) ||
      v.videoId?.toString().includes(busquedaVideo);
    
    const matchUsuario = !busquedaUsuario || 
      v.nombreUsuario?.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      v.usuarioId?.toString().includes(busquedaUsuario);
    
    return matchVideo && matchUsuario;
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
          <h1 className="text-4xl font-bold text-gray-800">Gestión de Visualizaciones</h1>
        </div>

        {/* Tarjeta de Estadísticas */}
        {estadisticas && (
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <TrendingUp size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{estadisticas.toLocaleString()}</h2>
                <p className="text-purple-100">Visualizaciones Totales del Sistema</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video (ID o Título)
              </label>
              <input
                type="text"
                placeholder="Buscar por video..."
                value={busquedaVideo}
                onChange={(e) => setBusquedaVideo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleBuscar}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
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

        {/* Tabla de Visualizaciones */}
        {cargando ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando visualizaciones...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Video</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visualizacionesFiltradas.length > 0 ? (
                    visualizacionesFiltradas.map((vis) => (
                      <tr key={vis.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {vis.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {vis.usuarioId ? (
                              <>
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                  {vis.nombreUsuario?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {vis.nombreUsuario}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ID: {vis.usuarioId}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-500 italic">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Eye size={16} />
                                </div>
                                <span className="text-sm">Anónimo</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {vis.videoTitulo}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {vis.videoId}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatearFecha(vis.fechaVisualizacion)}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                          {vis.ipAddress || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleEliminar(vis.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar visualización"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No se encontraron visualizaciones
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Resumen */}
            {visualizacionesFiltradas.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Mostrando: <span className="font-semibold">{visualizacionesFiltradas.length}</span> visualizaciones
                  </p>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Eye size={20} />
                    <span className="font-semibold">
                      {visualizacionesFiltradas.length.toLocaleString()} vistas
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}