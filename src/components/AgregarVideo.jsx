import React, { useState } from 'react';
import { videosAPI } from '../services/api';

export default function AgregarVideo({ cursoSeleccionado, setVistaActual, verDetalleCurso }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [orden, setOrden] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [duracion, setDuracion] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubmit = async () => {
    if (!archivo) {
      setError("Debes seleccionar un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("orden", orden);
    formData.append("duracionSegundos", duracion);
    formData.append("archivo", archivo);

    try {
      await videosAPI.subirVideo(cursoSeleccionado.id, formData);
      setExito(true);
      setTimeout(() => {
        verDetalleCurso(cursoSeleccionado.id);
      }, 1500);
    } catch (err) {
      console.error("Error al subir video:", err);
      const errorMsg = err.response?.data?.message || "Error al subir el video";
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setVistaActual('curso-detalle')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Volver al curso
        </button>

        <h1 className="text-3xl font-bold mb-6">Agregar Video</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
        {exito && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            ¡Video subido correctamente!
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Título *</label>
            <input 
              className="w-full border p-2 rounded"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Descripción</label>
            <textarea 
              className="w-full border p-2 rounded"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Orden *</label>
            <input 
              type="number"
              className="w-full border p-2 rounded"
              value={orden}
              onChange={e => setOrden(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Duración (segundos)</label>
            <input 
              type="number"
              className="w-full border p-2 rounded"
              value={duracion}
              onChange={e => setDuracion(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Archivo de video *</label>
            <input 
              type="file"
              accept="video/*"
              onChange={e => setArchivo(e.target.files[0])}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Subir Video
          </button>
        </div>
      </div>
    </div>
  );
}