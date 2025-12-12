// src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Users, GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function Login({ setVistaActual }) {
  const { login, registro } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rol, setRol] = useState('ESTUDIANTE');
  const [mostrarPassword, setMostrarPassword] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-upb-blue-500 via-upb-blue-600 to-upb-blue-700 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-upb-yellow-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-upb-yellow-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-upb-yellow-500 rounded-2xl mb-4 shadow-upb-xl">
            <GraduationCap size={40} className="text-upb-blue-900" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            {esRegistro ? '¡Únete a UPBmy!' : 'Bienvenido de Nuevo'}
          </h2>
          <p className="text-blue-100">
            {esRegistro ? 'Crea tu cuenta y comienza a aprender' : 'Inicia sesión para continuar'}
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-upb-xl p-8">
          {errorLogin && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                !
              </div>
              <span className="text-sm">{errorLogin}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {esRegistro && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellido
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                      placeholder="Ingresa tu apellido"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                  placeholder="tucorreo@upb.edu"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {esRegistro && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Usuario
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upb-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                  >
                    <option value="ESTUDIANTE">Estudiante</option>
                    <option value="INSTRUCTOR">Instructor</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-upb-blue-500 to-upb-blue-600 text-white py-4 rounded-xl font-bold hover:from-upb-blue-600 hover:to-upb-blue-700 transition-all duration-300 shadow-upb-lg hover:shadow-upb-xl transform hover:-translate-y-0.5"
            >
              {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setEsRegistro(!esRegistro);
                setErrorLogin('');
              }}
              className="text-upb-blue-600 hover:text-upb-blue-700 font-semibold text-sm transition-colors"
            >
              {esRegistro 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-blue-100 text-sm">
            Al continuar, aceptas los términos y condiciones de UPBmy
          </p>
        </div>
      </div>
    </div>
  );
}