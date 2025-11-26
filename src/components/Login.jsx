import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ setVistaActual }) {
  const { login, registro } = useAuth();
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
}