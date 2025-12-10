import React, { useEffect } from 'react';
import { Users, BookOpen, Video, TrendingUp, Star } from 'lucide-react';
import { useAdmin } from '../hooks/UseAdmin';

export default function AdminDashboard({ setVistaActual }) {
  const { estadisticas, cargando, cargarEstadisticas } = useAdmin();

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cards = [
    {
      titulo: 'Total Usuarios',
      valor: estadisticas?.totalUsuarios || 0,
      subtitulo: `${estadisticas?.estudiantes || 0} estudiantes, ${estadisticas?.instructores || 0} instructores`,
      icon: Users,
      color: 'bg-blue-500',
      onClick: () => setVistaActual('admin-usuarios')
    },
    {
      titulo: 'Total Cursos',
      valor: estadisticas?.totalCursos || 0,
      subtitulo: `${estadisticas?.cursosPublicados || 0} publicados, ${estadisticas?.cursosBorrador || 0} borradores`,
      icon: BookOpen,
      color: 'bg-green-500',
      onClick: () => setVistaActual('admin-cursos')
    },
    {
      titulo: 'Total Videos',
      valor: estadisticas?.totalVideos || 0,
      subtitulo: 'Videos subidos al sistema',
      icon: Video,
      color: 'bg-purple-500',
      onClick: () => setVistaActual('admin-cursos')
    },
    {
      titulo: 'Categorías',
      valor: estadisticas?.totalCategorias || 0,
      subtitulo: 'Categorías disponibles',
      icon: TrendingUp,
      color: 'bg-orange-500',
      onClick: () => setVistaActual('admin-categorias')
    },
    {
      titulo: 'Calificaciones',
      valor: estadisticas?.totalCalificaciones || 0,
      subtitulo: 'Calificaciones de cursos',
      icon: Star,
      color: 'bg-yellow-500',
      onClick: () => setVistaActual('admin-calificaciones')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Panel de Administración</h1>

        {cargando ? (
          <div className="text-center py-12">Cargando estadísticas...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={index}
                    onClick={card.onClick}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${card.color} p-3 rounded-lg`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">{card.titulo}</h3>
                    <p className="text-3xl font-bold text-gray-800 mb-1">{card.valor}</p>
                    <p className="text-xs text-gray-500">{card.subtitulo}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setVistaActual('admin-usuarios')}
                    className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    <div className="font-semibold text-blue-800">Gestionar Usuarios</div>
                    <div className="text-sm text-blue-600">Crear, editar y administrar usuarios</div>
                  </button>
                  <button
                    onClick={() => setVistaActual('admin-cursos')}
                    className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition"
                  >
                    <div className="font-semibold text-green-800">Gestionar Cursos</div>
                    <div className="text-sm text-green-600">Ver y administrar todos los cursos</div>
                  </button>
                  <button
                    onClick={() => setVistaActual('admin-categorias')}
                    className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                  >
                    <div className="font-semibold text-purple-800">Gestionar Categorías</div>
                    <div className="text-sm text-purple-600">Crear y administrar categorías</div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del Sistema</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Usuarios Activos</span>
                    <span className="font-semibold text-gray-800">
                      {estadisticas?.totalUsuarios || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Cursos Publicados</span>
                    <span className="font-semibold text-green-600">
                      {estadisticas?.cursosPublicados || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Cursos en Borrador</span>
                    <span className="font-semibold text-yellow-600">
                      {estadisticas?.cursosBorrador || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Total de Videos</span>
                    <span className="font-semibold text-purple-600">
                      {estadisticas?.totalVideos || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}