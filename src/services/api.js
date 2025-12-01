import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registro: (userData) => api.post('/auth/registro', userData),
};

// Cursos APIs
export const cursosAPI = {
  obtenerPublicos: () => api.get('/cursos/publicos'),
  obtenerPorId: (id) => api.get(`/cursos/${id}`),
  obtenerMisCursos: () => api.get('/cursos/mis-cursos'),
  obtenerPorCategoria: (categoriaId) => api.get(`/cursos/categoria/${categoriaId}`),
  buscar: (query, categoria) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (categoria) params.append('categoria', categoria);
    return api.get(`/cursos/buscar?${params}`);
  },
  crear: (formData) => api.post('/cursos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  actualizar: (id, formData) => api.put(`/cursos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  eliminar: (id) => api.delete(`/cursos/${id}`),
  publicar: (id) => api.post(`/cursos/${id}/publicar`),
};

// Videos APIs
export const videosAPI = {
  obtenerPorCurso: (cursoId) => api.get(`/videos/curso/${cursoId}`),
  obtenerPorId: (id) => api.get(`/videos/${id}`),
  subirVideo: (cursoId, formData) =>
    api.post(`/videos/curso/${cursoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  actualizar: (id, formData) => api.put(`/videos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  eliminar: (id) => api.delete(`/videos/${id}`),
};

// Categorías APIs
export const categoriasAPI = {
  obtenerTodas: () => api.get('/categorias'),
  obtenerPorId: (id) => api.get(`/categorias/${id}`),
  crear: (data) => api.post('/categorias', data),
  actualizar: (id, data) => api.put(`/categorias/${id}`, data),
  eliminar: (id) => api.delete(`/categorias/${id}`),
};

// Admin APIs
export const adminAPI = {
  // Estadísticas
  obtenerEstadisticas: () => api.get('/admin/estadisticas'),
  
  // Usuarios
  obtenerUsuarios: () => api.get('/admin/usuarios'),
  obtenerUsuarioPorId: (id) => api.get(`/admin/usuarios/${id}`),
  crearUsuario: (data) => api.post('/admin/usuarios', data),
  actualizarUsuario: (id, data) => api.put(`/admin/usuarios/${id}`, data),
  cambiarEstadoUsuario: (id, activo) => api.patch(`/admin/usuarios/${id}/estado?activo=${activo}`),
  eliminarUsuario: (id) => api.delete(`/admin/usuarios/${id}`),
  
  // Cursos
  obtenerCursos: () => api.get('/admin/cursos'),
  eliminarCurso: (id) => api.delete(`/admin/cursos/${id}`),
  cambiarEstadoCurso: (id, publicado) => api.patch(`/admin/cursos/${id}/estado?publicado=${publicado}`),
  
  // Videos
  eliminarVideo: (id) => api.delete(`/admin/videos/${id}`),
};

export default api;