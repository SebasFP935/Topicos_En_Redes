import React, { useState, useEffect } from 'react';
import { X, BookOpen, FileText, Tag, Image, DollarSign, Save } from 'lucide-react';
import { cursosAPI, categoriasAPI } from '../services/api';

export default function EditarCursoModal({ cursoId, onClose, onSuccess }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoriaId: '',
    precio: '',
    imagen: null
  });
  const [imagenPreview, setImagenPreview] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [cursoId]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [cursoResponse, categoriasResponse] = await Promise.all([
        cursosAPI.obtenerPorId(cursoId),
        categoriasAPI.obtenerTodas()
      ]);

      const curso = cursoResponse.data;
      setFormData({
        titulo: curso.titulo || '',
        descripcion: curso.descripcion || '',
        categoriaId: curso.categoriaId || '',
        precio: curso.precio || '',
        imagen: null
      });
      
      if (curso.imagenPortada) {
        setImagenPreview(curso.imagenPortada);
      }

      setCategorias(categoriasResponse.data);
    } catch (err) {
      setError('Error al cargar los datos del curso');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imagen: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    const datos = new FormData();
    datos.append('titulo', formData.titulo);
    datos.append('descripcion', formData.descripcion);
    datos.append('categoriaId', formData.categoriaId);
    
    if (formData.precio !== '') {
      datos.append('precio', parseFloat(formData.precio));
    }
    
    if (formData.imagen) {
      datos.append('imagen', formData.imagen);
    }

    try {
      await cursosAPI.actualizar(cursoId, datos);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el curso');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-upb-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Cargando datos del curso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <BookOpen size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Editar Curso</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Preview de imagen */}
        {imagenPreview && (
          <div className="relative h-48 bg-gradient-to-br from-upb-blue-500 to-upb-blue-700 overflow-hidden">
            <img 
              src={imagenPreview} 
              alt="Preview" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <p className="text-sm font-semibold mb-1">Vista previa de la portada</p>
              <p className="text-xl font-bold">{formData.titulo || 'Título del curso'}</p>
            </div>
          </div>
        )}

        {/* Body con formulario */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <BookOpen size={18} className="text-upb-blue-600" />
                Título del Curso *
              </label>
              <input 
                type="text" 
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <FileText size={18} className="text-upb-blue-600" />
                Descripción del Curso *
              </label>
              <textarea 
                rows={5} 
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 resize-none"
                required
              />
            </div>

            {/* Grid: Categoría y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoría */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Tag size={18} className="text-upb-blue-600" />
                  Categoría *
                </label>
                <select 
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              {/* 🆕 PRECIO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <DollarSign size={18} className="text-green-600" />
                  Precio (Bs)
                  <span className="text-gray-400 text-xs font-normal">(Opcional)</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Dejar vacío para curso gratuito. Se sincroniza con UPBolis
                </p>
              </div>
            </div>

            {/* Cambiar imagen */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Image size={18} className="text-upb-blue-600" />
                Nueva Imagen de Portada (Opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-upb-blue-500 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="hidden"
                  id="imagen-input-edit"
                />
                <label htmlFor="imagen-input-edit" className="cursor-pointer">
                  <div className="text-center">
                    <Image className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Cambiar imagen de portada
                    </p>
                    {formData.imagen && (
                      <p className="text-xs text-upb-blue-600 font-semibold mt-2">
                        ✓ {formData.imagen.name}
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Info UPBolis */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl">
              <p className="text-sm text-green-800">
                <strong>🔄 Sincronización con UPBolis:</strong> Los cambios de precio se sincronizan automáticamente.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleSubmit}
                disabled={guardando}
                className="flex-1 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white py-4 rounded-xl font-bold hover:from-upb-blue-600 hover:to-upb-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {guardando ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar Cambios
                  </>
                )}
              </button>
              <button 
                onClick={onClose}
                disabled={guardando}
                className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}