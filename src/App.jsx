import React, { useState, useEffect } from 'react';
import { Play, BookOpen, User, Search, Upload, Menu, X, LogOut, Edit, Trash2, Plus } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { cursosAPI, videosAPI, categoriasAPI } from './services/api';

function AppContent() {
  const { user, login, registro, logout, isAuthenticated, isInstructor } = useAuth();
  const [vistaActual, setVistaActual] = useState('home');
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  
  // Estados para datos del backend
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [videos, setVideos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar categorías al iniciar
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Cargar cursos cuando cambia la vista
  useEffect(() => {
    if (vistaActual === 'home' || vistaActual === 'cursos') {
      cargarCursosPublicos();
    } else if (vistaActual === 'mis-cursos' && isAuthenticated()) {
      cargarMisCursos();
    }
  }, [vistaActual]);

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
      setVideos(response.data.listaVideos || []);
      setVistaActual('curso-detalle');
      setError(null);
    } catch (err) {
      setError('Error al cargar el curso');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const NavBar = () => (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setVistaActual('home')}>
            <BookOpen size={28} />
            <span className="text-xl font-bold">UniTutoriales</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setVistaActual('cursos')} className="hover:text-blue-200 transition">
              Explorar Cursos
            </button>
            {isAuthenticated() && isInstructor() && (
              <>
                <button onClick={() => setVistaActual('mis-cursos')} className="hover:text-blue-200 transition">
                  Mis Cursos
                </button>
                <button onClick={() => setVistaActual('subir')} className="hover:text-blue-200 transition flex items-center gap-1">
                  <Upload size={18} />
                  Crear Curso
                </button>
              </>
            )}
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">{user.nombre}</span>
                <button onClick={logout} className="hover:text-blue-200 transition flex items-center gap-1">
                  <LogOut size={18} />
                  Salir
                </button>
              </div>
            ) : (
              <button onClick={() => setVistaActual('login')} className="hover:text-blue-200 transition flex items-center gap-1">
                <User size={18} />
                Iniciar Sesión
              </button>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuAbierto && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => { setVistaActual('cursos'); setMenuAbierto(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-2 rounded">
              Explorar Cursos
            </button>
            {isAuthenticated() && isInstructor() && (
              <>
                <button onClick={() => { setVistaActual('mis-cursos'); setMenuAbierto(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-2 rounded">
                  Mis Cursos
                </button>
                <button onClick={() => { setVistaActual('subir'); setMenuAbierto(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-2 rounded">
                  Crear Curso
                </button>
              </>
            )}
            {isAuthenticated() ? (
              <button onClick={() => { logout(); setMenuAbierto(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-2 rounded">
                Cerrar Sesión
              </button>
            ) : (
              <button onClick={() => { setVistaActual('login'); setMenuAbierto(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-2 rounded">
                Iniciar Sesión
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );

  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorLogin, setErrorLogin] = useState('');
    const [esRegistro, setEsRegistro] = useState(false);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [rol, setRol] = useState('ESTUDIANTE');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorLogin('');

      if (esRegistro) {
        const result = await registro({ nombre, apellido, email, password, rol });
        if (result.success) {
          setVistaActual('home');
        } else {
          setErrorLogin(result.error);
        }
      } else {
        const result = await login({ email, password });
        if (result.success) {
          setVistaActual('home');
        } else {
          setErrorLogin(result.error);
        }
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          
          {errorLogin && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorLogin}
            </div>
          )}

          <div className="space-y-4">
            {esRegistro && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {esRegistro && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ESTUDIANTE">Estudiante</option>
                  <option value="INSTRUCTOR">Instructor</option>
                </select>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {esRegistro ? 'Registrarse' : 'Iniciar Sesión'}
            </button>

            <button
              onClick={() => setEsRegistro(!esRegistro)}
              className="w-full text-blue-600 hover:text-blue-800 text-sm"
            >
              {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Home = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Aprende con Video Tutoriales
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma educativa universitaria para compartir y aprender
        </p>
        <button 
          onClick={() => setVistaActual('cursos')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Explorar Cursos
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{cursos.length}+</div>
            <div className="text-gray-600">Cursos Disponibles</div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{categorias.length}+</div>
            <div className="text-gray-600">Categorías</div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">∞</div>
            <div className="text-gray-600">Aprende sin Límites</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Cursos Destacados</h2>
        {cargando ? (
          <div className="text-center py-12">Cargando cursos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cursos.slice(0, 4).map(curso => (
              <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer" onClick={() => verDetalleCurso(curso.id)}>
                <img src={curso.imagenPortada || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop'} alt={curso.titulo} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{curso.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-2">{curso.instructor}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{curso.videos} videos</span>
                    <span>{curso.duracion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const Cursos = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {vistaActual === 'mis-cursos' ? 'Mis Cursos' : 'Explorar Cursos'}
        </h1>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Buscar cursos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarCursos(busqueda)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <button 
            onClick={() => buscarCursos(busqueda)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Buscar
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {cargando ? (
          <div className="text-center py-12">Cargando cursos...</div>
        ) : cursos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No se encontraron cursos</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map(curso => (
              <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img 
                  src={curso.imagenPortada || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop'} 
                  alt={curso.titulo} 
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => verDetalleCurso(curso.id)}
                />
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 cursor-pointer hover:text-blue-600" onClick={() => verDetalleCurso(curso.id)}>{curso.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-3">{curso.descripcion?.substring(0, 100)}...</p>
                  <p className="text-blue-600 font-semibold mb-3">{curso.instructor}</p>
                  <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
                    <span className="flex items-center gap-1">
                      <Play size={16} />
                      {curso.videos} videos
                    </span>
                    <span>{curso.duracion}</span>
                  </div>
                  {vistaActual === 'mis-cursos' && (
                    <div className="mt-4 flex gap-2">
                      <span className={`px-3 py-1 rounded text-sm ${curso.publicado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {curso.publicado ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const CursoDetalle = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => setVistaActual('cursos')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Volver a cursos
        </button>

        {cargando ? (
          <div className="text-center py-12">Cargando curso...</div>
        ) : cursoSeleccionado ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-black rounded-lg overflow-hidden mb-4" style={{aspectRatio: '16/9'}}>
                {videos.length > 0 && videos[0].urlVideo ? (
                  <video 
                    controls 
                    className="w-full h-full"
                    src={videos[0].urlVideo}
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Play size={64} className="mx-auto mb-4" />
                      <p className="text-lg">No hay videos disponibles</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{cursoSeleccionado.titulo}</h1>
                <p className="text-blue-600 font-semibold mb-2">{cursoSeleccionado.instructor}</p>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mb-4">
                  {cursoSeleccionado.categoria}
                </span>
                <p className="text-gray-600 mb-4">{cursoSeleccionado.descripcion}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{cursoSeleccionado.videos} videos</span>
                  <span>{cursoSeleccionado.duracion} de contenido</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold text-lg mb-4">Contenido del Curso</h3>
                <div className="space-y-2">
                  {videos.length > 0 ? videos.map(video => (
                    <div key={video.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer border border-gray-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {video.numero}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{video.titulo}</p>
                        <p className="text-xs text-gray-500">{video.duracion}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No hay videos en este curso</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  const SubirContenido = () => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [imagen, setImagen] = useState(null);
    const [errorSubida, setErrorSubida] = useState('');
    const [exito, setExito] = useState(false);

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Crear Nuevo Curso</h1>
          
          {errorSubida && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorSubida}
            </div>
          )}

          {exito && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              ¡Curso creado exitosamente! Redirigiendo...
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título del Curso *</label>
                <input 
                  type="text" 
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ej: Introducción a Python"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea 
                  rows={4} 
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Describe el contenido del curso..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                <select 
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de Portada</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Crear Curso
                </button>
                <button onClick={() => setVistaActual('home')} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {vistaActual === 'login' && <Login />}
      {vistaActual === 'home' && <Home />}
      {(vistaActual === 'cursos' || vistaActual === 'mis-cursos') && <Cursos />}
      {vistaActual === 'curso-detalle' && <CursoDetalle />}
      {vistaActual === 'subir' && <SubirContenido />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;