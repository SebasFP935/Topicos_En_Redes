import React, { useState, useEffect } from 'react';
import { Play, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calificacionesAPI } from '../services/api';
import StarRating from './StarRating';

export default function CursoDetalle({ 
  cursoSeleccionado, 
  videos, 
  cargando, 
  setVistaActual, 
  publicarCurso 
}) {
  const { isAuthenticated, isInstructor, user } = useAuth();
  const [videoActual, setVideoActual] = useState(null);
  const [miCalificacion, setMiCalificacion] = useState(null);
  const [resumenCalificaciones, setResumenCalificaciones] = useState(null);
  const [cargandoCalificacion, setCargandoCalificacion] = useState(false);

  // Set first video when videos load
  useEffect(() => {
    if (videos.length > 0 && !videoActual) {
      setVideoActual(videos[0]);
    }
  }, [videos]);

  // Cargar calificaciones cuando se carga el curso
  useEffect(() => {
    if (cursoSeleccionado) {
      cargarResumenCalificaciones();
      if (isAuthenticated()) {
        cargarMiCalificacion();
      }
    }
  }, [cursoSeleccionado]);

  const cargarResumenCalificaciones = async () => {
    try {
      const response = await calificacionesAPI.obtenerResumen(cursoSeleccionado.id);
      setResumenCalificaciones(response.data);
    } catch (error) {
      console.error('Error al cargar resumen de calificaciones:', error);
    }
  };

  const cargarMiCalificacion = async () => {
    try {
      const response = await calificacionesAPI.obtenerMiCalificacion(cursoSeleccionado.id);
      setMiCalificacion(response.data);
    } catch (error) {
      // 204 No Content es esperado si no hay calificación
      if (error.response?.status !== 204) {
        console.error('Error al cargar mi calificación:', error);
      }
    }
  };

  const handleCalificar = async (puntuacion) => {
    setCargandoCalificacion(true);
    try {
      await calificacionesAPI.calificar(cursoSeleccionado.id, puntuacion);
      await cargarMiCalificacion();
      await cargarResumenCalificaciones();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al calificar el curso');
    } finally {
      setCargandoCalificacion(false);
    }
  };

  const handleEliminarCalificacion = async () => {
    if (!confirm('¿Estás seguro de eliminar tu calificación?')) return;
    
    setCargandoCalificacion(true);
    try {
      await calificacionesAPI.eliminar(cursoSeleccionado.id);
      setMiCalificacion(null);
      await cargarResumenCalificaciones();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar la calificación');
    } finally {
      setCargandoCalificacion(false);
    }
  };

  const cambiarVideo = (video) => {
    console.log('Cambiando a video:', video.titulo);
    setVideoActual(video);
  };

  // Verificar si el usuario actual es el instructor del curso
  const esInstructorDelCurso = () => {
    return isAuthenticated() && isInstructor() && 
           user && cursoSeleccionado && 
           user.id === cursoSeleccionado.instructorId;
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

                {/* Sección de Calificaciones */}
                <div className="mb-4 pb-4 border-b">
                  {resumenCalificaciones && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <StarRating 
                          rating={resumenCalificaciones.promedioCalificacion} 
                          readonly 
                          size={24}
                        />
                        <span className="text-lg font-semibold text-gray-800">
                          {resumenCalificaciones.promedioCalificacion.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        ({resumenCalificaciones.totalCalificaciones} {resumenCalificaciones.totalCalificaciones === 1 ? 'calificación' : 'calificaciones'})
                      </span>
                    </div>
                  )}

                  {/* Calificar solo si está autenticado y no es el instructor del curso */}
                  {isAuthenticated() && !esInstructorDelCurso() && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {miCalificacion ? 'Tu calificación:' : 'Califica este curso:'}
                      </p>
                      <div className="flex items-center gap-4">
                        <StarRating 
                          rating={miCalificacion?.puntuacion || 0} 
                          onRate={handleCalificar}
                          size={28}
                          readonly={cargandoCalificacion}
                        />
                        {miCalificacion && (
                          <button
                            onClick={handleEliminarCalificacion}
                            disabled={cargandoCalificacion}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                            title="Eliminar calificación"
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mensaje si es el instructor */}
                  {esInstructorDelCurso() && (
                    <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
                      No puedes calificar tu propio curso
                    </div>
                  )}
                </div>

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

                {esInstructorDelCurso() && (
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