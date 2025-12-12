// src/components/Cursos.jsx
import React, { useEffect, useState } from 'react';
import { Play, Search, Star, Filter, Grid, List } from 'lucide-react';
import { calificacionesAPI } from '../services/api';

export default function Cursos({ 
  vistaActual, 
  cursos, 
  categorias, 
  busqueda, 
  setBusqueda, 
  categoriaSeleccionada, 
  setCategoriaSeleccionada, 
  buscarCursos, 
  cargando, 
  error, 
  verDetalleCurso 
}) {
  const [ratings, setRatings] = useState({});
  const [vistaGrid, setVistaGrid] = useState(true);

  useEffect(() => {
    if (cursos.length > 0) {
      cargarRatings();
    }
  }, [cursos]);

  const cargarRatings = async () => {
    const ratingsTemp = {};
    await Promise.all(
      cursos.map(async (curso) => {
        try {
          const response = await calificacionesAPI.obtenerResumen(curso.id);
          ratingsTemp[curso.id] = response.data;
        } catch (error) {
          console.error(`Error al cargar rating del curso ${curso.id}:`, error);
        }
      })
    );
    setRatings(ratingsTemp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-yellow-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {vistaActual === 'mis-cursos' ? ' Mis Cursos' : 'Explorar Cursos'}
          </h1>
          <p className="text-gray-600 text-lg">
            {vistaActual === 'mis-cursos' 
              ? 'Gestiona y visualiza tus cursos creados' 
              : 'Descubre contenido educativo de calidad'}
          </p>
        </div>

        {/* Barra de búsqueda y filtros mejorada */}
        <div className="bg-white rounded-2xl shadow-upb-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Buscar cursos por título, descripción o instructor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarCursos(busqueda)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filtro de categoría */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select 
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[200px] transition-all"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            {/* Botón buscar */}
            <button 
              onClick={() => buscarCursos(busqueda)}
              className="px-8 py-3 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white rounded-xl font-semibold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb hover:shadow-upb-lg whitespace-nowrap"
            >
              Buscar
            </button>

            {/* Toggle vista */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setVistaGrid(true)}
                className={`p-3 rounded-lg transition-all ${vistaGrid ? 'bg-white shadow-md text-upb-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="Vista en cuadrícula"
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setVistaGrid(false)}
                className={`p-3 rounded-lg transition-all ${!vistaGrid ? 'bg-white shadow-md text-upb-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="Vista en lista"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md">
            {error}
          </div>
        )}

        {/* Contenido */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-upb-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando cursos...</p>
          </div>
        ) : cursos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-upb">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No se encontraron cursos</h3>
            <p className="text-gray-600">Intenta con otros términos de búsqueda o filtros</p>
          </div>
        ) : (
          <div className={vistaGrid 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {cursos.map(curso => {
              const rating = ratings[curso.id];
              
              if (!vistaGrid) {
                // Vista de lista
                return (
                  <div 
                    key={curso.id} 
                    className="bg-white rounded-2xl shadow-upb overflow-hidden hover:shadow-upb-lg transition-all duration-300 cursor-pointer group flex"
                    onClick={() => verDetalleCurso(curso.id)}
                  >
                    <img 
                      src={curso.imagenPortada || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop'} 
                      alt={curso.titulo} 
                      className="w-64 h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-xl text-gray-800 group-hover:text-upb-blue-600 transition-colors flex-1">
                            {curso.titulo}
                          </h3>
                          {vistaActual === 'mis-cursos' && (
                            <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              curso.publicado 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {curso.publicado ? '✓ Publicado' : '⏳ Borrador'}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {curso.descripcion}
                        </p>
                        <p className="text-upb-blue-600 font-semibold mb-3">{curso.instructor}</p>
                        
                        {rating && rating.totalCalificaciones > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                              <Star size={16} className="fill-upb-yellow-500 text-upb-yellow-500" />
                              <span className="ml-1 text-sm font-bold text-gray-800">
                                {rating.promedioCalificacion.toFixed(1)}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                ({rating.totalCalificaciones})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                        <span className="flex items-center gap-1 font-medium">
                          <Play size={16} className="text-upb-blue-500" />
                          {curso.videos} videos
                        </span>
                        <span className="font-semibold text-upb-blue-600">{curso.duracion}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Vista de cuadrícula
              return (
                <div 
                  key={curso.id} 
                  className="group bg-white rounded-2xl shadow-upb overflow-hidden hover:shadow-upb-xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
                  onClick={() => verDetalleCurso(curso.id)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={curso.imagenPortada || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop'} 
                      alt={curso.titulo} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {vistaActual === 'mis-cursos' && (
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                          curso.publicado 
                            ? 'bg-green-500 text-white' 
                            : 'bg-yellow-500 text-upb-blue-900'
                        }`}>
                          {curso.publicado ? 'PUBLICADO' : 'BORRADOR'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-upb-blue-600 transition-colors">
                      {curso.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{curso.descripcion}</p>
                    <p className="text-upb-blue-600 font-semibold mb-3 text-sm">{curso.instructor}</p>
                    
                    {rating && rating.totalCalificaciones > 0 && (
                      <div className="flex items-center gap-2 mb-3 bg-yellow-50 p-2 rounded-lg">
                        <div className="flex items-center">
                          <Star size={16} className="fill-upb-yellow-500 text-upb-yellow-500" />
                          <span className="ml-1 text-sm font-bold text-gray-800">
                            {rating.promedioCalificacion.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">
                          ({rating.totalCalificaciones})
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t">
                      <span className="flex items-center gap-1">
                        <Play size={14} className="text-upb-blue-500" />
                        {curso.videos} videos
                      </span>
                      <span className="font-semibold text-upb-blue-600">{curso.duracion}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}