// src/components/AgregarVideo.jsx
import React, { useState } from 'react';
import { ArrowLeft, Film, FileText, Hash, Clock, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { videosAPI } from '../services/api';

export default function AgregarVideo({ cursoSeleccionado, setVistaActual, verDetalleCurso }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [orden, setOrden] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [duracion, setDuracion] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea un video
      if (!file.type.startsWith('video/')) {
        setError('Por favor selecciona un archivo de video válido');
        setArchivo(null);
        return;
      }
      
      // Validar tamaño (500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB en bytes
      if (file.size > maxSize) {
        setError('El video no puede exceder 500MB');
        setArchivo(null);
        return;
      }
      
      setArchivo(file);
      setError('');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!archivo) {
      setError("Debes seleccionar un archivo de video");
      return;
    }

    if (!titulo.trim()) {
      setError("El título es obligatorio");
      return;
    }

    if (!orden || orden < 1) {
      setError("El orden debe ser un número mayor a 0");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("orden", orden);
    formData.append("duracionSegundos", duracion || 0);
    formData.append("archivo", archivo);

    try {
      setSubiendo(true);
      await videosAPI.subirVideo(cursoSeleccionado.id, formData);
      setExito(true);
      setTimeout(() => {
        verDetalleCurso(cursoSeleccionado.id);
      }, 2000);
    } catch (err) {
      console.error("Error al subir video:", err);
      const errorMsg = err.response?.data?.message || "Error al subir el video";
      setError(errorMsg);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-yellow-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setVistaActual('curso-detalle')}
            className="flex items-center gap-2 text-upb-blue-600 hover:text-upb-blue-700 font-semibold mb-4 group transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver al curso
          </button>
          
          <div className="bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 rounded-2xl p-8 text-white shadow-upb-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Film size={150} />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">🎥 Agregar Video</h1>
              <p className="text-blue-100 text-lg">
                Curso: <span className="font-semibold">{cursoSeleccionado?.titulo}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-md">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {exito && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-md animate-pulse">
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">¡Video subido exitosamente!</p>
              <p className="text-sm mt-1">Redirigiendo al curso...</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-upb-lg p-8">
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Film size={18} className="text-upb-blue-600" />
                Título del Video *
              </label>
              <input 
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: Introducción a Variables en Python"
                disabled={subiendo || exito}
              />
              <p className="text-xs text-gray-500 mt-2">Mínimo 3 caracteres, máximo 200</p>
            </div>

            {/* Descripción */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <FileText size={18} className="text-upb-blue-600" />
                Descripción
                <span className="text-gray-400 text-xs font-normal">(Opcional)</span>
              </label>
              <textarea 
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe brevemente el contenido de este video..."
                disabled={subiendo || exito}
              />
              <p className="text-xs text-gray-500 mt-2">Máximo 1000 caracteres</p>
            </div>

            {/* Grid para Orden y Duración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orden */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Hash size={18} className="text-upb-blue-600" />
                  Número de Orden *
                </label>
                <input 
                  type="number"
                  min="1"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                  placeholder="1"
                  disabled={subiendo || exito}
                />
                <p className="text-xs text-gray-500 mt-2">Posición en la lista de videos</p>
              </div>

              {/* Duración */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Clock size={18} className="text-upb-blue-600" />
                  Duración (segundos)
                  <span className="text-gray-400 text-xs font-normal">(Opcional)</span>
                </label>
                <input 
                  type="number"
                  min="0"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                  placeholder="300"
                  disabled={subiendo || exito}
                />
                <p className="text-xs text-gray-500 mt-2">Ejemplo: 300 = 5 minutos</p>
              </div>
            </div>

            {/* Upload de Video */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Upload size={18} className="text-upb-blue-600" />
                Archivo de Video *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-upb-blue-500 transition-all cursor-pointer bg-gray-50 hover:bg-blue-50/50">
                <input 
                  type="file"
                  accept="video/*"
                  onChange={handleArchivoChange}
                  className="hidden"
                  id="video-input"
                  disabled={subiendo || exito}
                />
                <label htmlFor="video-input" className="cursor-pointer">
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {archivo ? '✓ Video seleccionado' : 'Haz clic para seleccionar un video'}
                    </p>
                    {archivo ? (
                      <div className="space-y-1">
                        <p className="text-sm text-upb-blue-600 font-semibold">{archivo.name}</p>
                        <p className="text-xs text-gray-500">{formatBytes(archivo.size)}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">MP4, MOV, AVI (máximo 500MB)</p>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Info importante */}
            <div className="bg-upb-yellow-50 border-l-4 border-upb-yellow-500 p-4 rounded-xl">
              <p className="text-sm text-upb-yellow-800">
                <strong>⚠️ Importante:</strong> Asegúrate de que el número de orden no esté duplicado. 
                El sistema no permite dos videos con el mismo orden en un curso.
              </p>
            </div>

            {/* Progreso de subida */}
            {subiendo && (
              <div className="bg-upb-blue-50 border-2 border-upb-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-upb-blue-600 border-t-transparent"></div>
                  <p className="font-semibold text-upb-blue-800">Subiendo video...</p>
                </div>
                <div className="w-full bg-upb-blue-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-upb-blue-600 h-full rounded-full animate-pulse w-3/4"></div>
                </div>
                <p className="text-xs text-upb-blue-600 mt-2">
                  Esto puede tomar varios minutos dependiendo del tamaño del archivo
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={subiendo || exito || !archivo}
                className="flex-1 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white py-4 rounded-xl font-bold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb-lg hover:shadow-upb-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {subiendo ? 'Subiendo...' : exito ? '✓ Video Subido' : 'Subir Video'}
              </button>
              <button
                onClick={() => setVistaActual('curso-detalle')}
                disabled={subiendo}
                className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-upb">
            <div className="w-12 h-12 bg-upb-blue-50 rounded-xl flex items-center justify-center mb-3">
              <Hash className="text-upb-blue-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Orden Correcto</h3>
            <p className="text-sm text-gray-600">Organiza tus videos en el orden que quieres que sean vistos.</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-upb">
            <div className="w-12 h-12 bg-upb-yellow-50 rounded-xl flex items-center justify-center mb-3">
              <Film className="text-upb-yellow-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Calidad HD</h3>
            <p className="text-sm text-gray-600">Sube videos en la mejor calidad posible para una mejor experiencia.</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-upb">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <Clock className="text-green-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Duración Ideal</h3>
            <p className="text-sm text-gray-600">Los videos de 5-15 minutos tienen mejor retención de audiencia.</p>
          </div>
        </div>
      </div>
    </div>
  );
}