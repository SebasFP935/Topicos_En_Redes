// src/components/AdminCalificaciones.jsx
import React, { useState, useEffect } from 'react';
import { Search, Trash2, Star, Filter, ArrowLeft, BookOpen, User, Calendar } from 'lucide-react';
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

  const calcularEstadisticas = () => {
    if (calificacionesFiltradas.length === 0) return { promedio: 0, total: 0 };
    
    const suma = calificacionesFiltradas.reduce((acc, cal) => acc + cal.puntuacion, 0);
    const promedio = suma / calificacionesFiltradas.length;
    
    return {
      promedio: promedio.toFixed(1),
      total: calificacionesFiltradas.length
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-yellow-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setVistaActual('admin-dashboard')}
            className="flex items-center gap-2 text-upb-blue-600 hover:text-upb-blue-700 font-semibold mb-3 group transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⭐ Gestión de Calificaciones</h1>
          <p className="text-gray-600">Administra todas las valoraciones de los cursos</p>
        </div>

        {/* Tarjeta de Estadísticas */}
        <div className="bg-gradient-to-r from-upb-yellow-500 to-upb-yellow-600 rounded-2xl shadow-upb-lg p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Star size={200} />
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <Star size={32} className="fill-current" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{stats.promedio}</h2>
                <p className="text-yellow-100">Calificación Promedio</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <BookOpen size={32} />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{stats.total}</h2>
                <p className="text-yellow-100">Valoraciones Totales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-upb-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Curso (ID o Título)
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por curso..."
                  value={busquedaCurso}
                  onChange={(e) => setBusquedaCurso(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-yellow-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuario (ID o Nombre)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por usuario..."
                  value={busquedaUsuario}
                  onChange={(e) => setBusquedaUsuario(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-yellow-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha Desde
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-yellow-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha Hasta
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-yellow-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleBuscar}
              className="px-6 py-3 bg-gradient-to-r from-upb-yellow-500 to-upb-yellow-600 text-white rounded-xl hover:from-upb-yellow-600 hover:to-upb-yellow-700 transition-all font-semibold shadow-upb"
            >
              Buscar
            </button>
            <button
              onClick={handleLimpiarFiltros}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all font-semibold"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Grid de Calificaciones */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-upb-yellow-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando calificaciones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calificacionesFiltradas.length > 0 ? (
              calificacionesFiltradas.map((calificacion) => (
                <div 
                  key={calificacion.id} 
                  className="bg-white rounded-2xl shadow-upb p-6 hover:shadow-upb-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  {/* Header con usuario */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-upb-blue-500 to-upb-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                        {calificacion.nombreUsuario?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 group-hover:text-upb-blue-600 transition-colors">
                          {calificacion.nombreUsuario}
                        </h3>
                        <p className="text-xs text-gray-500">ID: {calificacion.usuarioId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Calificación */}
                  <div className="bg-yellow-50 rounded-xl p-4 mb-4">
                    <StarRating 
                      rating={calificacion.puntuacion} 
                      readonly 
                      size={24}
                    />
                    <p className="text-2xl font-bold text-gray-800 mt-2">
                      {calificacion.puntuacion}.0 estrellas
                    </p>
                  </div>

                  {/* Información del curso */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <BookOpen size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 line-clamp-2">
                          {calificacion.cursoTitulo || `Curso #${calificacion.cursoId}`}
                        </p>
                        <p className="text-xs text-gray-500">ID: {calificacion.cursoId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar size={14} className="text-gray-400" />
                      <span>Creada: {formatearFecha(calificacion.fechaCreacion)}</span>
                    </div>
                    {calificacion.fechaModificacion && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>Modificada: {formatearFecha(calificacion.fechaModificacion)}</span>
                      </div>
                    )}
                  </div>

                  {/* Acción */}
                  <button
                    onClick={() => handleEliminar(calificacion.id)}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl hover:bg-red-100 transition-all font-semibold text-sm"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-upb">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No se encontraron calificaciones</h3>
                <p className="text-gray-600">Intenta con otros filtros de búsqueda</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}