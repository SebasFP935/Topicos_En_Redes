import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => setVistaActual('admin-dashboard')}
              className="text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Volver al Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Gestión de Categorías</h1>
          </div>
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Nueva Categoría
          </button>
        </div>

        {cargando ? (
          <div className="text-center py-12">Cargando categorías...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{categoria.nombre}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirModal(categoria)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleEliminar(categoria.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {categoria.descripcion || 'Sin descripción'}
                </p>
                <div className="mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    ID: {categoria.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {categorias.length === 0 && !cargando && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No hay categorías creadas</p>
            <button
              onClick={() => abrirModal()}
              className="text-blue-600 hover:text-blue-800"
            >
              Crear la primera categoría
            </button>
          </div>
        )}

        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                {categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>

              {errorForm && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                  {errorForm}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Ej: Programación"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descripción de la categoría (opcional)"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {categoriaEditar ? 'Actualizar' : 'Crear Categoría'}
                  </button>
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}