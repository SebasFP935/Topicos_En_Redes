// src/components/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { Users, BookOpen, Video, TrendingUp, Star, ArrowRight, BarChart3, Activity, Eye } from 'lucide-react';
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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      onClick: () => setVistaActual('admin-usuarios')
    },
    {
      titulo: 'Total Cursos',
      valor: estadisticas?.totalCursos || 0,
      subtitulo: `${estadisticas?.cursosPublicados || 0} publicados, ${estadisticas?.cursosBorrador || 0} borradores`,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      onClick: () => setVistaActual('admin-cursos')
    },
    {
      titulo: 'Total Videos',
      valor: estadisticas?.totalVideos || 0,
      subtitulo: 'Videos subidos al sistema',
      icon: Video,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      onClick: () => setVistaActual('admin-cursos')
    },
    {
      titulo: 'Categorías',
      valor: estadisticas?.totalCategorias || 0,
      subtitulo: 'Categorías disponibles',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      onClick: () => setVistaActual('admin-categorias')
    },
    {
      titulo: 'Calificaciones',
      valor: estadisticas?.totalCalificaciones || 0,
      subtitulo: 'Valoraciones totales',
      icon: Star,
      color: 'from-upb-yellow-500 to-upb-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-upb-yellow-600',
      onClick: () => setVistaActual('admin-calificaciones')
    },
    {
      titulo: 'Visualizaciones',
      valor: estadisticas?.totalVisualizaciones || 0,
      subtitulo: 'Reproducciones de videos',
      icon: Eye,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      onClick: () => setVistaActual('admin-visualizaciones')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-yellow-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-upb-blue-600 to-upb-blue-700 rounded-2xl p-8 mb-8 shadow-upb-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Activity size={200} />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-blue-100 text-lg">Gestiona y supervisa toda la plataforma UPBmy</p>
          </div>
        </div>

        {cargando ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-upb-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={index}
                    onClick={card.onClick}
                    className="group bg-white rounded-2xl shadow-upb p-6 hover:shadow-upb-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border-2 border-transparent hover:border-upb-blue-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-4 ${card.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={card.textColor} size={28} />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-semibold mb-2">{card.titulo}</h3>
                    <p className="text-4xl font-bold text-gray-800 mb-2">{card.valor}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.subtitulo}</p>
                  </div>
                );
              })}
            </div>

            {/* Grid de secciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Acciones Rápidas */}
              <div className="bg-white rounded-2xl shadow-upb-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-upb-blue-50 rounded-xl">
                    <BarChart3 className="text-upb-blue-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Acciones Rápidas</h2>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setVistaActual('admin-usuarios')}
                    className="group w-full text-left px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-upb-blue-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-upb-blue-800 text-lg mb-1 flex items-center gap-2">
                          <Users size={20} />
                          Gestionar Usuarios
                        </div>
                        <div className="text-sm text-upb-blue-600">Crear, editar y administrar usuarios</div>
                      </div>
                      <ArrowRight className="text-upb-blue-600 group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setVistaActual('admin-cursos')}
                    className="group w-full text-left px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-green-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-green-800 text-lg mb-1 flex items-center gap-2">
                          <BookOpen size={20} />
                          Gestionar Cursos
                        </div>
                        <div className="text-sm text-green-600">Ver y administrar todos los cursos</div>
                      </div>
                      <ArrowRight className="text-green-600 group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setVistaActual('admin-categorias')}
                    className="group w-full text-left px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-purple-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-purple-800 text-lg mb-1 flex items-center gap-2">
                          <TrendingUp size={20} />
                          Gestionar Categorías
                        </div>
                        <div className="text-sm text-purple-600">Crear y administrar categorías</div>
                      </div>
                      <ArrowRight className="text-purple-600 group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </button>

                  <button
                    onClick={() => setVistaActual('admin-calificaciones')}
                    className="group w-full text-left px-6 py-4 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-yellow-800 text-lg mb-1 flex items-center gap-2">
                          <Star size={20} />
                          Gestionar Calificaciones
                        </div>
                        <div className="text-sm text-yellow-600">Ver y moderar valoraciones</div>
                      </div>
                      <ArrowRight className="text-yellow-600 group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </button>

                  <button
                    onClick={() => setVistaActual('admin-visualizaciones')}
                    className="group w-full text-left px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-purple-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-purple-800 text-lg mb-1 flex items-center gap-2">
                          <Eye size={20} />
                          Gestionar Visualizaciones
                        </div>
                        <div className="text-sm text-purple-600">Analytics de reproducciones</div>
                      </div>
                      <ArrowRight className="text-purple-600 group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Resumen del Sistema */}
              <div className="bg-white rounded-2xl shadow-upb-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-upb-yellow-50 rounded-xl">
                    <Activity className="text-upb-yellow-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Resumen del Sistema</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b-2 border-gray-100 hover:bg-gray-50 px-4 rounded-lg transition-colors">
                    <span className="text-gray-700 font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Usuarios Activos
                    </span>
                    <span className="text-2xl font-bold text-gray-800">
                      {estadisticas?.totalUsuarios || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b-2 border-gray-100 hover:bg-gray-50 px-4 rounded-lg transition-colors">
                    <span className="text-gray-700 font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Cursos Publicados
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {estadisticas?.cursosPublicados || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b-2 border-gray-100 hover:bg-gray-50 px-4 rounded-lg transition-colors">
                    <span className="text-gray-700 font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Cursos en Borrador
                    </span>
                    <span className="text-2xl font-bold text-yellow-600">
                      {estadisticas?.cursosBorrador || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 hover:bg-gray-50 px-4 rounded-lg transition-colors">
                    <span className="text-gray-700 font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Total de Videos
                    </span>
                    <span className="text-2xl font-bold text-purple-600">
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