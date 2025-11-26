import React, { useState } from 'react';
import { BookOpen, User, Upload, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NavBar({ setVistaActual }) {
  const { user, logout, isAuthenticated, isInstructor } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
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
}