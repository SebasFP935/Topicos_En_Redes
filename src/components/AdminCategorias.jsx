import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Tag } from 'lucide-react';
import { categoriasAPI } from '../services/api';

export default function AdminCategorias({ setVistaActual }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [errorForm, setErrorForm] = useState('');

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setCargando(true);
    try {
      const response = await categoriasAPI.obtenerTodas();
      setCategorias(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (categoria = null) => {
    if (categoria) {
      setCategoriaEditar(categoria);
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || ''
      });
    } else {
      setCategoriaEditar(null);
      setFormData({
        nombre: '',
        descripcion: ''
      });
    }
    setErrorForm('');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCategoriaEditar(null);
    setFormData({
      nombre: '',
      descripcion: ''
    });
    setErrorForm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');

    try {
      if (categoriaEditar) {
        await categoriasAPI.actualizar(categoriaEditar.id, formData);
      } else {
        await categoriasAPI.crear(formData);
      }
      await cargarCategorias();
      cerrarModal();
    } catch (err) {
      setErrorForm(err.response?.data?.message || 'Error al guardar la categoría');
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta categoría? No se puede eliminar si tiene cursos asociados.')) {
      try {
        await categoriasAPI.eliminar(id);
        await cargarCategorias();
      } catch (err) {
        alert(err.response?.data?.message || 'Error al eliminar la categoría');
      }
    }
  };

  const coloresCategoria = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-yellow-500 to-yellow-600',
    'from-red-500 to-red-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-yellow-50/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button
              onClick={() => setVistaActual('admin-dashboard')}
              className="flex items-center gap-2 text-upb-blue-600 hover:text-upb-blue-700 font-semibold mb-3 group transition-all"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Volver al Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Gestión de Categorías</h1>
            <p className="text-gray-600">Organiza los cursos por temáticas</p>
          </div>
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb-lg hover:shadow-upb-xl"
          >
            <Plus size={20} />
            Nueva Categoría
          </button>
        </div>

        {/* Grid de categorías */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-upb-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando categorías...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((categoria, index) => (
              <div 
                key={categoria.id} 
                className="bg-white rounded-2xl shadow-upb p-6 hover:shadow-upb-xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 bg-gradient-to-br ${coloresCategoria[index % coloresCategoria.length]} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Tag className="text-white" size={28} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirModal(categoria)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleEliminar(categoria.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-upb-blue-600 transition-colors">
                  {categoria.nombre}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {categoria.descripcion || 'Sin descripción'}
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    ID: {categoria.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {categorias.length === 0 && !cargando && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-upb">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No hay categorías creadas</h3>
            <p className="text-gray-600 mb-6">Comienza creando la primera categoría</p>
            <button
              onClick={() => abrirModal()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb"
            >
              <Plus size={20} />
              Crear Primera Categoría
            </button>
          </div>
        )}

        {/* Modal */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white">
                  {categoriaEditar ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
                </h2>
              </div>

              <div className="p-6">
                {errorForm && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
                    {errorForm}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                      required
                      placeholder="Ej: Programación"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all resize-none"
                      rows={3}
                      placeholder="Descripción de la categoría (opcional)"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white py-3 rounded-xl font-semibold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb"
                    >
                      {categoriaEditar ? 'Actualizar' : 'Crear Categoría'}
                    </button>
                    <button
                      type="button"
                      onClick={cerrarModal}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}