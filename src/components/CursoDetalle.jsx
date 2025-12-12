// src/components/CursoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { Play, Plus, Trash2, Clock, Film, Award, Share2, Bookmark, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    if (videos.length > 0 && !videoActual) {
      setVideoActual(videos[0]);
    }
  }, [videos]);

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
    setVideoActual(video);
  };

  const esInstructorDelCurso = () => {
    return isAuthenticated() && isInstructor() && 
           user && cursoSeleccionado && 
           user.id === cursoSeleccionado.instructorId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-yellow-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón volver mejorado */}
        <button 
          onClick={() => setVistaActual('cursos')}
          className="flex items-center gap-2 text-upb-blue-600 hover:text-upb-blue-700 font-semibold mb-6 group transition-all"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver a cursos
        </button>

        {cargando ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-upb-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando curso...</p>
          </div>
        ) : cursoSeleccionado ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reproductor de video mejorado */}
              <div className="bg-black rounded-2xl overflow-hidden shadow-upb-xl" style={{aspectRatio: '16/9'}}>
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
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-upb-blue-600 to-upb-blue-800">
                    <div className="text-center text-white">
                      <Play size={80} className="mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-semibold">No hay videos disponibles</p>
                      <p className="text-blue-200 mt-2">El instructor aún no ha subido contenido</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Información del curso */}
              <div className="bg-white rounded-2xl shadow-upb-lg p-8">
                {/* Header del curso */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">{cursoSeleccionado.titulo}</h1>
                    <div className="flex items-center gap-4 flex-wrap">
                      <p className="text-upb-blue-600 font-semibold flex items-center gap-2">
                        <Award size={20} />
                        {cursoSeleccionado.instructor}
                      </p>
                      <span className="inline-flex items-center gap-1 bg-upb-blue-50 text-upb-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {cursoSeleccionado.categoria}
                      </span>
                    </div>
                    </div>
                  <div className="flex gap-2">
                    <button className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors" title="Compartir">
                      <Share2 size={20} className="text-gray-600" />
                    </button>
                    <button className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors" title="Guardar">
                      <Bookmark size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                 {/* Calificaciones */}
            <div className="mb-6 pb-6 border-b">
              {resumenCalificaciones && resumenCalificaciones.totalCalificaciones > 0 && (
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-3 bg-yellow-50 px-4 py-3 rounded-xl">
                    <StarRating 
                      rating={resumenCalificaciones.promedioCalificacion} 
                      readonly 
                      size={24}
                    />
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-gray-800">
                        {resumenCalificaciones.promedioCalificacion.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-600">
                        {resumenCalificaciones.totalCalificaciones} {resumenCalificaciones.totalCalificaciones === 1 ? 'calificación' : 'calificaciones'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Calificar */}
              {isAuthenticated() && !esInstructorDelCurso() && (
                <div className="bg-gradient-to-r from-upb-blue-50 to-blue-50 p-5 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {miCalificacion ? '⭐ Tu calificación:' : '✨ ¿Qué te pareció este curso?'}
                  </p>
                  <div className="flex items-center gap-4">
                    <StarRating 
                      rating={miCalificacion?.puntuacion || 0} 
                      onRate={handleCalificar}
                      size={32}
                      readonly={cargandoCalificacion}
                    />
                    {miCalificacion && (
                      <button
                        onClick={handleEliminarCalificacion}
                        disabled={cargandoCalificacion}
                        className="text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium transition-colors"
                        title="Eliminar calificación"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              )}

              {esInstructorDelCurso() && (
                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
                  ℹ️ No puedes calificar tu propio curso
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📋 Descripción del Curso</h3>
              <p className="text-gray-600 leading-relaxed">{cursoSeleccionado.descripcion}</p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-upb-blue-50 p-4 rounded-xl text-center">
                <Film className="mx-auto mb-2 text-upb-blue-600" size={24} />
                <div className="text-2xl font-bold text-gray-800">{cursoSeleccionado.videos}</div>
                <div className="text-sm text-gray-600">Videos</div>
              </div>
              <div className="bg-upb-yellow-50 p-4 rounded-xl text-center">
                <Clock className="mx-auto mb-2 text-upb-yellow-600" size={24} />
                <div className="text-2xl font-bold text-gray-800">{cursoSeleccionado.duracion}</div>
                <div className="text-sm text-gray-600">Duración</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <Award className="mx-auto mb-2 text-green-600" size={24} />
                <div className="text-2xl font-bold text-gray-800">
                  {resumenCalificaciones?.totalCalificaciones || 0}
                </div>
                <div className="text-sm text-gray-600">Valoraciones</div>
              </div>
            </div>

            {/* Video actual info */}
            {videoActual && (
              <div className="mt-6 pt-6 border-t">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 bg-upb-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {videoActual.numero}
                  </span>
                  {videoActual.titulo}
                </h2>
                {videoActual.descripcion ? (
                  <p className="text-gray-600 leading-relaxed pl-11">
                    {videoActual.descripcion}
                  </p>
                ) : (
                  <p className="text-gray-400 italic pl-11">
                    Sin descripción disponible
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-upb-lg p-6 sticky top-8">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Film className="text-upb-blue-600" size={24} />
              Contenido del Curso
            </h3>

            {/* Botones de acción para instructor */}
            {esInstructorDelCurso() && (
              <div className="mb-4 space-y-3">
                <button
                  onClick={() => setVistaActual('agregar-video')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white py-3 rounded-xl font-semibold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb"
                >
                  <Plus size={20} />
                  Agregar Video
                </button>
                
                {videos.length > 0 && !cursoSeleccionado.publicado && (
                  <button
                    onClick={() => publicarCurso(cursoSeleccionado.id)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                  >
                    ✓ Publicar Curso
                  </button>
                )}
              </div>
            )}

            {/* Lista de videos */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => cambiarVideo(video)}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                      videoActual?.id === video.id 
                        ? 'border-upb-blue-500 bg-upb-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-upb-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                      videoActual?.id === video.id
                        ? 'bg-upb-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {video.numero}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${
                        videoActual?.id === video.id ? 'text-upb-blue-900' : 'text-gray-800'
                      }`}>
                        {video.titulo}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-gray-500" />
                        <p className="text-xs text-gray-500">{video.duracion}</p>
                      </div>
                    </div>
                    {videoActual?.id === video.id && (
                      <Play size={16} className="text-upb-blue-600 flex-shrink-0" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Film size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No hay videos en este curso</p>
                  {esInstructorDelCurso() && (
                    <p className="text-sm text-gray-400 mt-2">Comienza agregando tu primer video</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : null}
  </div>

  {/* Estilos para scrollbar personalizado */}
  <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #0D47A1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #0A3D8F;
    }
  `}</style>
</div>
);
}