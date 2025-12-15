import React, { useEffect, useState } from 'react';
import { Star, Play, Award, Users, BookOpen, TrendingUp, ArrowRight, Eye } from 'lucide-react';
import { calificacionesAPI } from '../services/api';

export default function Home({ cursos, categorias, cargando, setVistaActual, verDetalleCurso }) {
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (cursos.length > 0) {
      cargarRatings();
    }
  }, [cursos]);

  const cargarRatings = async () => {
    const ratingsTemp = {};
    const cursosDestacados = cursos.slice(0, 4);
    
    await Promise.all(
      cursosDestacados.map(async (curso) => {
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
      {/* Hero Section Mejorado */}
      <div className="relative overflow-hidden bg-gradient-to-br from-upb-blue-500 via-upb-blue-600 to-upb-blue-700">
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-upb-yellow-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-upb-yellow-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="inline-block mb-6">
            <span className="bg-upb-yellow-500 text-upb-blue-900 px-6 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg">
              CAMPUS VIRTUAL UPB
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Aprende sin
            <span className="block text-upb-yellow-400">Límites</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Plataforma educativa universitaria para compartir conocimiento,
            <span className="text-upb-yellow-400 font-semibold"> crecer juntos</span> y alcanzar el éxito
          </p>
        </div>

        {/* Onda decorativa */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 82.5C1200 85 1320 80 1380 77.5L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)"/>
          </svg>
        </div>
      </div>

      {/* Estadísticas mejoradas */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-upb-xl p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-upb-blue-500 group hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-upb-blue-50 rounded-xl group-hover:bg-upb-blue-100 transition-colors">
                <BookOpen className="text-upb-blue-500" size={32} />
              </div>
              <div className="text-5xl font-bold text-upb-blue-500">{cursos.length}+</div>
            </div>
            <div className="text-gray-600 font-semibold text-lg">Cursos Disponibles</div>
            <div className="text-sm text-gray-500 mt-2">Contenido de calidad universitaria</div>
          </div>

          <div className="bg-white rounded-2xl shadow-upb-xl p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-upb-yellow-500 group hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition-colors">
                <TrendingUp className="text-upb-yellow-600" size={32} />
              </div>
              <div className="text-5xl font-bold text-upb-yellow-600">{categorias.length}+</div>
            </div>
            <div className="text-gray-600 font-semibold text-lg">Categorías</div>
            <div className="text-sm text-gray-500 mt-2">Diversas áreas de conocimiento</div>
          </div>

          <div className="bg-white rounded-2xl shadow-upb-xl p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500 group hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                <Award className="text-green-600" size={32} />
              </div>
              <div className="text-5xl font-bold text-green-600">∞</div>
            </div>
            <div className="text-gray-600 font-semibold text-lg">Aprende sin Límites</div>
            <div className="text-sm text-gray-500 mt-2">A tu propio ritmo, 24/7</div>
          </div>
        </div>
      </div>

      {/* Cursos destacados */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Cursos Destacados</h2>
            <p className="text-gray-600 text-lg">Los más valorados por nuestra comunidad</p>
          </div>
          <button
            onClick={() => setVistaActual('cursos')}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-upb-blue-500 text-white rounded-xl font-semibold hover:bg-upb-blue-600 transition-all duration-300 shadow-upb"
          >
            Ver Todos
            <ArrowRight size={20} />
          </button>
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-upb-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando cursos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cursos.slice(0, 4).map(curso => {
              const rating = ratings[curso.id];
              
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-upb-yellow-500 text-upb-blue-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        DESTACADO
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-upb-blue-600 transition-colors">
                      {curso.titulo}
                    </h3>
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
                        <Play size={14} />
                        {curso.videos} videos
                      </span>
                      <span className="font-medium text-upb-blue-600">{curso.duracion}</span>
                    </div>

                    {/* 🆕 Mostrar visualizaciones */}
                    {curso.totalVistas !== undefined && curso.totalVistas > 0 && (
                      <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t text-purple-600">
                        <Eye size={16} />
                        <span className="text-sm font-semibold">{curso.totalVistas.toLocaleString()} vistas</span>
                      </div>
                    )}
                  </div>
                    {/* 🆕 Precio */}
                    <div className="pt-3 border-t">
                      {curso.precio && curso.precio > 0 ? (
                        <div className="flex items-center justify-center gap-1 bg-green-50 px-3 py-2 rounded-lg">
                          <DollarSign size={16} className="text-green-600" />
                          <span className="text-lg font-bold text-green-600">
                            {curso.precio.toFixed(2)} Bs
                          </span>
                        </div>
                      ) : (
                        <div className="text-center bg-blue-50 px-3 py-2 rounded-lg">
                          <span className="text-sm font-bold text-blue-600">
                            🎁 GRATIS
                          </span>
                        </div>
                      )}
                    </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botón móvil */}
        <div className="md:hidden mt-8 text-center">
          <button
            onClick={() => setVistaActual('cursos')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-upb-blue-500 text-white rounded-xl font-semibold hover:bg-upb-blue-600 transition-all duration-300 shadow-upb"
          >
            Ver Todos los Cursos
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Sección Call to Action */}
      <div className="bg-gradient-to-r from-upb-blue-500 to-upb-blue-700 py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para comenzar tu aprendizaje?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Únete a nuestra comunidad educativa y accede a contenido de calidad universitaria
          </p>
          <button
            onClick={() => setVistaActual('login')}
            className="px-10 py-4 bg-upb-yellow-500 text-upb-blue-900 rounded-xl text-lg font-bold hover:bg-upb-yellow-400 transition-all duration-300 shadow-2xl hover:scale-105"
          >
            Registrarse Gratis
          </button>
        </div>
      </div>
    </div>
  );
}