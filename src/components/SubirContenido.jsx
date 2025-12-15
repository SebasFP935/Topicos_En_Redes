import React, { useState } from 'react';
import { ArrowLeft, BookOpen, FileText, Tag, Image as ImageIcon, Upload, CheckCircle } from 'lucide-react';
import { cursosAPI } from '../services/api';
import { DollarSign } from 'lucide-react';

export default function SubirContenido({ categorias, setVistaActual }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [errorSubida, setErrorSubida] = useState('');
  const [exito, setExito] = useState(false);
  const [precio, setPrecio] = useState('');

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorSubida('');
    setExito(false);

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('categoriaId', categoriaId);
    if (imagen) {
      formData.append('imagen', imagen);
    }
    if (precio) {
      formData.append('precio', parseFloat(precio));
    }

    try {
      await cursosAPI.crear(formData);
      setExito(true);
      setTimeout(() => {
        setVistaActual('mis-cursos');
      }, 2000);
    } catch (err) {
      setErrorSubida(err.response?.data?.message || 'Error al crear el curso');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-yellow-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setVistaActual('home')}
            className="flex items-center gap-2 text-upb-blue-600 hover:text-upb-blue-700 font-semibold mb-4 group transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <div className="bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 rounded-2xl p-8 text-white shadow-upb-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <BookOpen size={150} />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">📚 Crear Nuevo Curso</h1>
              <p className="text-blue-100 text-lg">Comparte tu conocimiento con la comunidad UPBmy</p>
            </div>
          </div>
        </div>
        
        {/* Alertas */}
        {errorSubida && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-md">
            <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
              !
            </div>
            <span className="text-sm font-medium">{errorSubida}</span>
          </div>
        )}

        {exito && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-md animate-pulse">
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">¡Curso creado exitosamente!</p>
              <p className="text-sm mt-1">Redirigiendo a tus cursos...</p>
            </div>
          </div>
        )}
        
        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-upb-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Preview de imagen */}
            {imagenPreview && (
              <div className="relative h-64 bg-gradient-to-br from-upb-blue-500 to-upb-blue-700 overflow-hidden">
                <img 
                  src={imagenPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <p className="text-sm font-semibold mb-1">Vista previa de la portada</p>
                  <p className="text-2xl font-bold">{titulo || 'Título del curso'}</p>
                </div>
              </div>
            )}

            <div className="p-8 space-y-6">
              {/* Título */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <BookOpen size={18} className="text-upb-blue-600" />
                  Título del Curso *
                </label>
                <input 
                  type="text" 
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all" 
                  placeholder="Ej: Introducción a Python para Principiantes"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Mínimo 5 caracteres, máximo 200</p>
              </div>

              {/* Descripción */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <FileText size={18} className="text-upb-blue-600" />
                  Descripción del Curso *
                </label>
                <textarea 
                  rows={6} 
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all resize-none" 
                  placeholder="Describe de qué trata tu curso, qué aprenderán los estudiantes, requisitos previos, etc..."
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-2">Mínimo 20 caracteres, máximo 2000</p>
              </div>

              {/* Categoría */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Tag size={18} className="text-upb-blue-600" />
                  Categoría *
                </label>
                <select 
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">Ayuda a los estudiantes a encontrar tu curso</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <DollarSign size={18} className="text-green-600" />
                  Precio del Curso (Bs)
                  <span className="text-gray-400 text-xs font-normal">(Opcional)</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Dejar vacío para curso gratuito. Se sincronizará con UPBolis
                </p>
              </div>

              {/* Imagen de Portada */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <ImageIcon size={18} className="text-upb-blue-600" />
                  Imagen de Portada
                  <span className="text-gray-400 text-xs font-normal">(Opcional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-upb-blue-500 transition-all cursor-pointer bg-gray-50 hover:bg-blue-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="hidden"
                    id="imagen-input"
                  />
                  <label htmlFor="imagen-input" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto text-gray-400 mb-3" size={40} />
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Haz clic para subir una imagen
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG o GIF (máximo 5MB)
                      </p>
                      {imagen && (
                        <p className="text-xs text-upb-blue-600 font-semibold mt-2">
                          ✓ {imagen.name}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Info importante */}
              <div className="bg-upb-blue-50 border-l-4 border-upb-blue-500 p-4 rounded-xl">
                <p className="text-sm text-upb-blue-800">
                  <strong>💡 Importante:</strong> Después de crear el curso, podrás agregar videos y publicarlo cuando esté listo.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={exito}
                  className="flex-1 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white py-4 rounded-xl font-bold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb-lg hover:shadow-upb-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {exito ? '✓ Curso Creado' : 'Crear Curso'}
                </button>
                <button 
                  type="button"
                  onClick={() => setVistaActual('home')} 
                  className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all text-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-upb">
            <div className="w-12 h-12 bg-upb-blue-50 rounded-xl flex items-center justify-center mb-3">
              <BookOpen className="text-upb-blue-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Título Claro</h3>
            <p className="text-sm text-gray-600">Usa un título descriptivo y fácil de entender para atraer estudiantes.</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-upb">
            <div className="w-12 h-12 bg-upb-yellow-50 rounded-xl flex items-center justify-center mb-3">
              <FileText className="text-upb-yellow-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Descripción Completa</h3>
            <p className="text-sm text-gray-600">Explica qué aprenderán y qué requisitos necesitan los estudiantes.</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-upb">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <ImageIcon className="text-green-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Imagen Atractiva</h3>
            <p className="text-sm text-gray-600">Una buena portada aumenta el interés en tu curso.</p>
          </div>
        </div>
      </div>
    </div>
  );
}