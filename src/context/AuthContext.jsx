import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);

    // Listener para sincronizar sesiones entre pestañas
    const handleStorageChange = (e) => {
      // Solo reaccionar a cambios del token
      if (e.key === 'token') {
        if (e.newValue === null) {
          // El token fue removido en otra pestaña - cerrar sesión aquí también
          console.log('Sesión cerrada en otra pestaña, cerrando sesión aquí...');
          setUser(null);
          localStorage.removeItem('user');
        } else if (e.newValue && !user) {
          // Se inició sesión en otra pestaña - cargar usuario aquí también
          const userData = localStorage.getItem('user');
          if (userData) {
            console.log('Sesión iniciada en otra pestaña, sincronizando...');
            setUser(JSON.parse(userData));
          }
        }
      }
    };

    // El evento 'storage' solo se dispara en otras pestañas, no en la actual
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const registro = async (userData) => {
    try {
      const response = await authAPI.registro(userData);
      const { token, ...user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al registrarse' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isInstructor = () => {
    return user?.rol === 'INSTRUCTOR';
  };

  const isAdmin = () => {
    return user?.rol === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      registro, 
      logout, 
      isAuthenticated, 
      isInstructor,
      isAdmin,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};