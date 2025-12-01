import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useCursos } from './hooks/useCursos';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Home from './components/Home';
import Cursos from './components/Cursos';
import CursoDetalle from './components/CursoDetalle';
import SubirContenido from './components/SubirContenido';
import AgregarVideo from './components/AgregarVideo';
import AdminDashboard from './components/AdminDashboard';
import AdminUsuarios from './components/AdminUsuarios';
import AdminCursos from './components/AdminCursos';
import AdminCategorias from './components/AdminCategorias';

function AppContent() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [vistaActual, setVistaActual] = useState('home');

  // Función para cerrar sesión y redirigir al login
  const handleLogout = () => {
    logout();
    setVistaActual('login');
  };
  
  const {
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
  } = useCursos();

  useEffect(() => {
    if (vistaActual === 'home' || vistaActual === 'cursos') {
      cargarCursosPublicos();
    } else if (vistaActual === 'mis-cursos' && isAuthenticated()) {
      cargarMisCursos();
    }
  }, [vistaActual]);

  const handleVerDetalleCurso = async (cursoId) => {
    await verDetalleCurso(cursoId);
    setVistaActual('curso-detalle');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar setVistaActual={setVistaActual} handleLogout={handleLogout} />
      
      {vistaActual === 'login' && <Login setVistaActual={setVistaActual} />}
      
      {vistaActual === 'home' && (
        <Home 
          cursos={cursos}
          categorias={categorias}
          cargando={cargando}
          setVistaActual={setVistaActual}
          verDetalleCurso={handleVerDetalleCurso}
        />
      )}
      
      {(vistaActual === 'cursos' || vistaActual === 'mis-cursos') && (
        <Cursos 
          vistaActual={vistaActual}
          cursos={cursos}
          categorias={categorias}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          categoriaSeleccionada={categoriaSeleccionada}
          setCategoriaSeleccionada={setCategoriaSeleccionada}
          buscarCursos={buscarCursos}
          cargando={cargando}
          error={error}
          verDetalleCurso={handleVerDetalleCurso}
        />
      )}
      
      {vistaActual === 'curso-detalle' && (
        <CursoDetalle 
          cursoSeleccionado={cursoSeleccionado}
          videos={videos}
          cargando={cargando}
          setVistaActual={setVistaActual}
          publicarCurso={publicarCurso}
        />
      )}
      
      {vistaActual === 'subir' && (
        <SubirContenido 
          categorias={categorias}
          setVistaActual={setVistaActual}
        />
      )}
      
      {vistaActual === 'agregar-video' && (
        <AgregarVideo 
          cursoSeleccionado={cursoSeleccionado}
          setVistaActual={setVistaActual}
          verDetalleCurso={handleVerDetalleCurso}
        />
      )}

      {/* RUTAS DE ADMINISTRADOR */}
      {isAuthenticated() && isAdmin() && (
        <>
          {vistaActual === 'admin-dashboard' && (
            <AdminDashboard setVistaActual={setVistaActual} />
          )}
          
          {vistaActual === 'admin-usuarios' && (
            <AdminUsuarios setVistaActual={setVistaActual} />
          )}
          
          {vistaActual === 'admin-cursos' && (
            <AdminCursos 
              setVistaActual={setVistaActual}
              verDetalleCurso={handleVerDetalleCurso}
            />
          )}
          
          {vistaActual === 'admin-categorias' && (
            <AdminCategorias setVistaActual={setVistaActual} />
          )}
        </>
      )}
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