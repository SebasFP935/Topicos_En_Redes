import { useState, useEffect } from 'react';
import { cursosAPI, categoriasAPI } from '../services/api';

export function useCursos() {
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [videos, setVideos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await categoriasAPI.obtenerTodas();
      setCategorias(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const cargarCursosPublicos = async () => {
    setCargando(true);
    try {
      const response = await cursosAPI.obtenerPublicos();
      setCursos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar cursos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const cargarMisCursos = async () => {
    setCargando(true);
    try {
      const response = await cursosAPI.obtenerMisCursos();
      setCursos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar tus cursos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const buscarCursos = async (query) => {
    if (!query.trim()) {
      cargarCursosPublicos();
      return;
    }
    setCargando(true);
    try {
      const response = await cursosAPI.buscar(query, categoriaSeleccionada || null);
      setCursos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al buscar cursos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const verDetalleCurso = async (cursoId) => {
    setCargando(true);
    try {
      const response = await cursosAPI.obtenerPorId(cursoId);
      setCursoSeleccionado(response.data);
      console.log("Curso cargado:", { 
        id: response.data.id, 
        publicado: response.data.publicado, 
        videosCount: response.data.listaVideos?.length 
      });
      setVideos(response.data.listaVideos || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar el curso');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const publicarCurso = async (cursoId) => {
    try {
      console.log("Publicando curso ID:", cursoId);
      await cursosAPI.publicar(cursoId);
      alert('Curso publicado exitosamente');
      verDetalleCurso(cursoId);
    } catch (err) {
      console.error('Error al publicar:', err);
      alert('Error al publicar el curso');
    }
  };

  return {
    cursos,
    categorias,
    videos,
    cursoSeleccionado,
    cargando,
    error,
    busqueda,
    setBusqueda,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    cargarCursosPublicos,
    cargarMisCursos,
    buscarCursos,
    verDetalleCurso,
    publicarCurso,
  };
}