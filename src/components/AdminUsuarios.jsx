// src/components/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, CheckCircle, XCircle, Search, Filter, ArrowLeft, Users, Mail, Shield, GraduationCap, User } from 'lucide-react';
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
  const [filtroEstado, setFiltroEstado] = useState('');
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
    const matchEstado = !filtroEstado || 
      (filtroEstado === 'activo' && u.activo) ||
      (filtroEstado === 'inactivo' && !u.activo);
    
    return matchBusqueda && matchRol && matchEstado;
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

  const getRolInfo = (rol) => {
    switch (rol) {
      case 'ADMIN':
        return { color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-700', icon: Shield };
      case 'INSTRUCTOR':
        return { color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700', icon: GraduationCap };
      default:
        return { color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-700', icon: User };
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-yellow-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setVistaActual('admin-dashboard')}
            className="flex items-center gap-2 text-upb-blue-600 hover:text-upb-blue-700 font-semibold mb-3 group transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">👥 Gestión de Usuarios</h1>
              <p className="text-gray-600">Administra todos los usuarios de la plataforma</p>
            </div>
            <button
              onClick={() => abrirModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb-lg hover:shadow-upb-xl"
            >
              <UserPlus size={20} />
              Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-upb-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
            >
              <option value="">Todos los roles</option>
              <option value="ESTUDIANTE">Estudiantes</option>
              <option value="INSTRUCTOR">Instructores</option>
              <option value="ADMIN">Administradores</option>
            </select>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Grid de usuarios */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-upb-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usuariosFiltrados.map((usuario) => {
              const rolInfo = getRolInfo(usuario.rol);
              const RolIcon = rolInfo.icon;

              return (
                <div 
                  key={usuario.id} 
                  className="bg-white rounded-2xl shadow-upb p-6 hover:shadow-upb-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  {/* Header con avatar y estado */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${rolInfo.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {usuario.nombre.charAt(0).toUpperCase()}
                        {usuario.apellido.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-upb-blue-600 transition-colors">
                          {usuario.nombre} {usuario.apellido}
                        </h3>
                        <div className={`flex items-center gap-1 ${rolInfo.bgColor} ${rolInfo.textColor} px-3 py-1 rounded-full text-xs font-semibold mt-1`}>
                          <RolIcon size={12} />
                          {usuario.rol}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      <span className="truncate">{usuario.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} className="text-gray-400" />
                      <span>{usuario.cursosCreados || 0} cursos creados</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs text-gray-500">
                        Registro: {formatearFecha(usuario.fechaRegistro)}
                      </span>
                      {usuario.activo ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
                          <CheckCircle size={14} />
                          Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm font-semibold bg-red-50 px-2 py-1 rounded-full">
                          <XCircle size={14} />
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => abrirModal(usuario)}
                      className="flex-1 flex items-center justify-center gap-1 bg-upb-blue-50 text-upb-blue-600 px-3 py-2.5 rounded-xl hover:bg-upb-blue-100 transition-all font-semibold text-sm"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleCambiarEstado(usuario.id, !usuario.activo)}
                      className={`flex items-center justify-center p-2.5 rounded-xl transition-all ${
                        usuario.activo 
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                      title={usuario.activo ? 'Desactivar' : 'Activar'}
                    >
                      {usuario.activo ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button
                      onClick={() => handleEliminar(usuario.id)}
                      className="flex items-center justify-center bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {usuariosFiltrados.length === 0 && !cargando && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-upb">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-600">Intenta con otros filtros de búsqueda</p>
          </div>
        )}

        {/* Modal */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {usuarioEditar ? <Edit2 size={24} /> : <UserPlus size={24} />}
                  {usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
              </div>

              <div className="p-6">
                {errorForm && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      !
                    </div>
                    <span className="text-sm">{errorForm}</span>
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
                      placeholder="Ingresa el nombre"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                      placeholder="Ingresa el apellido"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                        placeholder="correo@upb.edu"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select
                      value={formData.rol}
                      onChange={(e) => setFormData({...formData, rol: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
                      required
                    >
                      <option value="ESTUDIANTE">Estudiante</option>
                      <option value="INSTRUCTOR">Instructor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                    <input
                      type="checkbox"
                      id="activo"
                      checked={formData.activo}
                      onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                      className="w-5 h-5 text-upb-blue-600 rounded focus:ring-2 focus:ring-upb-blue-500 cursor-pointer"
                    />
                    <label htmlFor="activo" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Usuario activo
                    </label>
                  </div>

                  {!usuarioEditar && (
                    <div className="bg-upb-blue-50 border-l-4 border-upb-blue-500 p-4 rounded-lg">
                      <p className="text-sm text-upb-blue-800">
                        <strong>Nota:</strong> Se generará una contraseña temporal que se mostrará en la consola del servidor.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white py-3 rounded-xl font-semibold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb"
                    >
                      {usuarioEditar ? 'Actualizar Usuario' : 'Crear Usuario'}
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