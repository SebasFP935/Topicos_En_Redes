import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { useAdmin } from '../hooks/UseAdmin';

export default function AdminUsuarios({ setVistaActual }) {
  const {
    usuarios,
    cargando,
    cargarUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario
  } = useAdmin();

  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'ESTUDIANTE',
    activo: true
  });
  const [errorForm, setErrorForm] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(u => {
    const matchBusqueda = 
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchRol = !filtroRol || u.rol === filtroRol;
    
    return matchBusqueda && matchRol;
  });

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setUsuarioEditar(usuario);
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo
      });
    } else {
      setUsuarioEditar(null);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        rol: 'ESTUDIANTE',
        activo: true
      });
    }
    setErrorForm('');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioEditar(null);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      rol: 'ESTUDIANTE',
      activo: true
    });
    setErrorForm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');

    const result = usuarioEditar
      ? await actualizarUsuario(usuarioEditar.id, formData)
      : await crearUsuario(formData);

    if (result.success) {
      cerrarModal();
    } else {
      setErrorForm(result.error);
    }
  };

  const handleCambiarEstado = async (id, activo) => {
    if (confirm(`¿Deseas ${activo ? 'activar' : 'desactivar'} este usuario?`)) {
      await cambiarEstadoUsuario(id, activo);
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      const result = await eliminarUsuario(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const getRolBadgeColor = (rol) => {
    switch (rol) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'INSTRUCTOR': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => setVistaActual('admin-dashboard')}
              className="text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Volver al Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Gestión de Usuarios</h1>
          </div>
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <UserPlus size={20} />
            Nuevo Usuario
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="ESTUDIANTE">Estudiantes</option>
              <option value="INSTRUCTOR">Instructores</option>
              <option value="ADMIN">Administradores</option>
            </select>
          </div>
        </div>

        {cargando ? (
          <div className="text-center py-12">Cargando usuarios...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cursos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {usuario.nombre} {usuario.apellido}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {usuario.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRolBadgeColor(usuario.rol)}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {usuario.cursosCreados || 0}
                    </td>
                    <td className="px-6 py-4">
                      {usuario.activo ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle size={16} />
                          Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <XCircle size={16} />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModal(usuario)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleCambiarEstado(usuario.id, !usuario.activo)}
                          className={usuario.activo ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          title={usuario.activo ? 'Desactivar' : 'Activar'}
                        >
                          {usuario.activo ? <XCircle size={18} /> : <CheckCircle size={18} />}
                        </button>
                        <button
                          onClick={() => handleEliminar(usuario.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {usuariosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron usuarios
              </div>
            )}
          </div>
        )}

        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                {usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol *
                  </label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({...formData, rol: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="ESTUDIANTE">Estudiante</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                    Usuario activo
                  </label>
                </div>

                {!usuarioEditar && (
                  <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                    Se generará una contraseña temporal que se mostrará en consola.
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {usuarioEditar ? 'Actualizar' : 'Crear Usuario'}
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