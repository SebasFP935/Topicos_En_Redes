import React, { useState, useEffect } from 'react';
import { Play, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CursoDetalle({ 
  cursoSeleccionado, 
  videos, 
  cargando, 
  setVistaActual, 
  publicarCurso 
}) {
  const { isAuthenticated, isInstructor } = useAuth();
  const [videoActual, setVideoActual] = useState(null);

  // Set first video when videos load
  useEffect(() => {
    if (videos.length > 0 && !videoActual) {
      setVideoActual(videos[0]);
    }
  }, [videos]);

  const cambiarVideo = (video) => {
    console.log('Cambiando a video:', video.titulo);
    setVideoActual(video);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => setVistaActual('cursos')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Volver a cursos
        </button>

        {cargando ? (
          <div className="text-center py-12">Cargando curso...</div>
        ) : cursoSeleccionado ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-black rounded-lg overflow-hidden mb-4" style={{aspectRatio: '16/9'}}>
                {videoActual && videoActual.urlVideo ? (
                  <video 
                    key={videoActual.id}
                    controls 
                    className="w-full h-full"
                    src={videoActual.urlVideo}
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Play size={64} className="mx-auto mb-4" />
                      <p className="text-lg">No hay videos disponibles</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{cursoSeleccionado.titulo}</h1>
                <p className="text-blue-600 font-semibold mb-2">{cursoSeleccionado.instructor}</p>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mb-4">
                  {cursoSeleccionado.categoria}
                </span>
                <p className="text-gray-600 mb-4">{cursoSeleccionado.descripcion}</p>
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span>{cursoSeleccionado.videos} videos</span>
                  <span>{cursoSeleccionado.duracion} de contenido</span>
                </div>

                {/* Separador */}
                {videoActual && (
                  <>
                    <div className="border-t border-gray-200 my-4"></div>
                    
                    {/* Descripción del video actual */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {videoActual.numero}
                        </span>
                        {videoActual.titulo}
                      </h2>
                      {videoActual.descripcion ? (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {videoActual.descripcion}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">
                          Sin descripción
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold text-lg mb-4">Contenido del Curso</h3>

                {isAuthenticated() && isInstructor() && (
                  <div className="mb-4 space-y-2">
                    <button
                      onClick={() => setVistaActual('agregar-video')}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus size={18} />
                      Agregar Video
                    </button>
                    
                    {videos.length > 0 && !cursoSeleccionado.publicado && (
                      <button
                        onClick={() => publicarCurso(cursoSeleccionado.id)}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Publicar Curso
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {videos.length > 0 ? (
                    videos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => cambiarVideo(video)}
                        className={`flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer border transition ${
                          videoActual?.id === video.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          videoActual?.id === video.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {video.numero}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{video.titulo}</p>
                          <p className="text-xs text-gray-500">{video.duracion}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No hay videos en este curso
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}