import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { calificacionesAPI } from '../services/api';

export default function Home({ cursos, categorias, cargando, setVistaActual, verDetalleCurso }) {
  const [ratings, setRatings] = useState({});

  // Cargar ratings de los cursos destacados
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Aprende con Video Tutoriales
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma educativa universitaria para compartir y aprender
        </p>
        <button 
          onClick={() => setVistaActual('cursos')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Explorar Cursos
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{cursos.length}+</div>
            <div className="text-gray-600">Cursos Disponibles</div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{categorias.length}+</div>
            <div className="text-gray-600">Categorías</div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">∞</div>
            <div className="text-gray-600">Aprende sin Límites</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Cursos Destacados</h2>
        {cargando ? (
          <div className="text-center py-12">Cargando cursos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cursos.slice(0, 4).map(curso => {
              const rating = ratings[curso.id];
              
              return (
                <div 
                  key={curso.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer" 
                  onClick={() => verDetalleCurso(curso.id)}
                >
                  <img 
                    src={curso.imagenPortada || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop'} 
                    alt={curso.titulo} 
                    className="w-full h-40 object-cover" 
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{curso.titulo}</h3>
                    <p className="text-gray-600 text-sm mb-2">{curso.instructor}</p>
                    
                    {/* Rating */}
                    {rating && rating.totalCalificaciones > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-xs font-semibold text-gray-800">
                            {rating.promedioCalificacion.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({rating.totalCalificaciones})
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{curso.videos} videos</span>
                      <span>{curso.duracion}</span>
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