import React, { useState } from 'react';
import { BookOpen, User, Upload, Menu, X, LogOut, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NavBar({ setVistaActual, handleLogout }) {
  const { user, isAuthenticated, isInstructor, isAdmin } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-upb-blue-500 to-upb-blue-700 text-white shadow-upb-lg relative">
      {/* Barra amarilla superior decorativa */}
      <div className="h-1 bg-gradient-to-r from-upb-yellow-500 via-upb-yellow-400 to-upb-yellow-500"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo mejorado */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setVistaActual('home')}
          >
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl group-hover:bg-upb-yellow-500 transition-all duration-300">
              <GraduationCap size={32} className="group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">UPBmy</span>
              <span className="text-xs text-upb-yellow-400 font-medium">Campus Virtual</span>
            </div>
          </div>
          
          {/* Menú desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => setVistaActual('cursos')} 
              className="px-4 py-2.5 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
            >
              Explorar Cursos
            </button>

            {isAuthenticated() && isAdmin() && (
              <button 
                onClick={() => setVistaActual('admin-dashboard')} 
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-upb-yellow-500 text-upb-blue-900 hover:bg-upb-yellow-400 transition-all duration-200 font-semibold shadow-lg"
              >
                <Shield size={18} />
                Admin
              </button>
            )}

            {isAuthenticated() && isInstructor() && (
              <>
                <button 
                  onClick={() => setVistaActual('mis-cursos')} 
                  className="px-4 py-2.5 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Mis Cursos
                </button>
                <button 
                  onClick={() => setVistaActual('subir')} 
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 font-medium backdrop-blur-sm"
                >
                  <Upload size={18} />
                  Crear Curso
                </button>
              </>
            )}

            {isAuthenticated() ? (
              <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">{user.nombre}</span>
                    <span className="text-xs text-upb-yellow-400 font-medium">{user.rol}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-upb-yellow-500 flex items-center justify-center text-upb-blue-900 font-bold text-lg">
                    {user.nombre.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2.5 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                  title="Cerrar Sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setVistaActual('login')} 
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-upb-yellow-500 text-upb-blue-900 hover:bg-upb-yellow-400 transition-all duration-200 font-semibold shadow-lg ml-4"
              >
                <User size={18} />
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Botón menú móvil */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menú móvil mejorado */}
        {menuAbierto && (
          <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top">
            <button 
              onClick={() => { setVistaActual('cursos'); setMenuAbierto(false); }} 
              className="block w-full text-left py-3 px-4 hover:bg-white/10 rounded-lg transition-all font-medium"
            >
              Explorar Cursos
            </button>

            {isAuthenticated() && isAdmin() && (
              <button 
                onClick={() => { setVistaActual('admin-dashboard'); setMenuAbierto(false); }} 
                className="block w-full text-left py-3 px-4 bg-upb-yellow-500 text-upb-blue-900 rounded-lg font-semibold"
              >
                Panel de Administración
              </button>
            )}

            {isAuthenticated() && isInstructor() && (
              <>
                <button 
                  onClick={() => { setVistaActual('mis-cursos'); setMenuAbierto(false); }} 
                  className="block w-full text-left py-3 px-4 hover:bg-white/10 rounded-lg transition-all font-medium"
                >
                  Mis Cursos
                </button>
                <button 
                  onClick={() => { setVistaActual('subir'); setMenuAbierto(false); }} 
                  className="block w-full text-left py-3 px-4 hover:bg-white/10 rounded-lg transition-all font-medium"
                >
                  Crear Curso
                </button>
              </>
            )}

            {isAuthenticated() ? (
              <>
                <div className="px-4 py-3 bg-white/10 rounded-lg mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-upb-yellow-500 flex items-center justify-center text-upb-blue-900 font-bold text-xl">
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{user.nombre}</div>
                      <div className="text-xs text-upb-yellow-400">{user.rol}</div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { handleLogout(); setMenuAbierto(false); }} 
                  className="block w-full text-left py-3 px-4 hover:bg-red-500/20 rounded-lg transition-all font-medium text-red-300"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button 
                onClick={() => { setVistaActual('login'); setMenuAbierto(false); }} 
                className="block w-full text-left py-3 px-4 bg-upb-yellow-500 text-upb-blue-900 rounded-lg font-semibold"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}