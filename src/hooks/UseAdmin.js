import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

export function useAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarEstadisticas = async () => {
    setCargando(true);
    try {
      const response = await adminAPI.obtenerEstadisticas();
      setEstadisticas(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const response = await adminAPI.obtenerUsuarios();
      setUsuarios(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const cargarCursos = async () => {
    setCargando(true);
    try {
      const response = await adminAPI.obtenerCursos();
      setCursos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar cursos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const crearUsuario = async (datos) => {
    try {
      await adminAPI.crearUsuario(datos);
      await cargarUsuarios();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al crear usuario' 
      };
    }
  };

  const actualizarUsuario = async (id, datos) => {
    try {
      await adminAPI.actualizarUsuario(id, datos);
      await cargarUsuarios();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al actualizar usuario' 
      };
    }
  };

  const cambiarEstadoUsuario = async (id, activo) => {
    try {
      await adminAPI.cambiarEstadoUsuario(id, activo);
      await cargarUsuarios();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al cambiar estado' 
      };
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await adminAPI.eliminarUsuario(id);
      await cargarUsuarios();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al eliminar usuario' 
      };
    }
  };

  const eliminarCurso = async (id) => {
    try {
      await adminAPI.eliminarCurso(id);
      await cargarCursos();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al eliminar curso' 
      };
    }
  };

  const cambiarEstadoCurso = async (id, publicado) => {
    try {
      await adminAPI.cambiarEstadoCurso(id, publicado);
      await cargarCursos();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al cambiar estado' 
      };
    }
  };

  return {
    usuarios,
    cursos,
    estadisticas,
    cargando,
    error,
    cargarEstadisticas,
    cargarUsuarios,
    cargarCursos,
    crearUsuario,
    actualizarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario,
    eliminarCurso,
    cambiarEstadoCurso,
  };
}