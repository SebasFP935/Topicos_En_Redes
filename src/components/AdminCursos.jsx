import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, CheckCircle, XCircle, Filter, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../hooks/UseAdmin';

export default function AdminCursos({ setVistaActual, verDetalleCurso }) {
  const {
    cursos,
    cargando,
    cargarCursos,
    eliminarCurso,
    cambiarEstadoCurso
  } = useAdmin();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarCursos();
  }, []);

  const cursosFiltrados = cursos.filter(c => {
    const matchBusqueda = 
      c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.instructor.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.categoria.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchEstado = 
      filtroEstado === '' ||
      (filtroEstado === 'publicado' && c.publicado) ||
      (filtroEstado === 'borrador' && !c.publicado);
    
    return matchBusqueda && matchEstado;
  });

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de eliminar este curso? Se eliminarán todos sus videos. Esta acción no se puede deshacer.')) {
      const result = await eliminarCurso(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleCambiarEstado = async (id, publicado) => {
    const mensaje = publicado 
      ? '¿Deseas publicar este curso?' 
      : '¿Deseas ocultar este curso? Los estudiantes no podrán verlo.';
    
    if (confirm(mensaje)) {
      await cambiarEstadoCurso(id, publicado);
    }
  };

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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gestión de Cursos</h1>
          <p className="text-gray-600">Administra todos los cursos de la plataforma</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-upb-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por título, instructor o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
              >
                <option value="">Todos los estados</option>
                <option value="publicado">Publicados</option>
                <option value="borrador">Borradores</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de cursos */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-upb-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando cursos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursosFiltrados.map((curso) => (
              <div key={curso.id} className="bg-white rounded-2xl shadow-upb overflow-hidden hover:shadow-upb-xl transition-all duration-300 group">
                <div className="relative">
                  <img
                    src={curso.imagenPortada || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop'}
                    alt={curso.titulo}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    {curso.publicado ? (
                      <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <CheckCircle size={14} />
                        PUBLICADO
                      </span>
                    ) : (
                      <span className="bg-yellow-500 text-upb-blue-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <XCircle size={14} />
                        BORRADOR
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg flex-1 line-clamp-2 group-hover:text-upb-blue-600 transition-colors">
                      {curso.titulo}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{curso.instructor}</p>
                  <p className="text-sm text-upb-blue-600 font-semibold mb-4">{curso.categoria}</p>
                  
                  <div className="flex justify-between text-sm text-gray-500 mb-4 pb-4 border-t pt-4">
                    <span className="font-medium">{curso.videos} videos</span>
                    <span className="font-semibold text-upb-blue-600">{curso.duracion}</span>
                  </div>

                                    <div className="pt-4 border-t">
                    {curso.precio && curso.precio > 0 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <DollarSign size={16} />
                        <span className="font-bold">{curso.precio.toFixed(2)} Bs</span>
                      </div>
                    ) : (
                      <div className="text-blue-600 font-semibold text-sm">
                        Curso Gratuito
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => verDetalleCurso(curso.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-upb-blue-50 text-upb-blue-600 px-3 py-2.5 rounded-xl hover:bg-upb-blue-100 transition-all font-semibold text-sm"
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                    
                    <button
                      onClick={() => handleCambiarEstado(curso.id, !curso.publicado)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                        curso.publicado
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                      title={curso.publicado ? 'Ocultar' : 'Publicar'}
                    >
                      {curso.publicado ? (
                        <>
                          <XCircle size={16} />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Publicar
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleEliminar(curso.id)}
                      className="flex items-center justify-center bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>                  
                </div>
              </div>
              
            ))}
          </div>
        )}

        {cursosFiltrados.length === 0 && !cargando && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-upb">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No se encontraron cursos</h3>
            <p className="text-gray-600">Intenta con otros filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}