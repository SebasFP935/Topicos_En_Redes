import React from 'react';
import { Play, Search } from 'lucide-react';

export default function Cursos({ 
  vistaActual, 
  cursos, 
  categorias, 
  busqueda, 
  setBusqueda, 
  categoriaSeleccionada, 
  setCategoriaSeleccionada, 
  buscarCursos, 
  cargando, 
  error, 
  verDetalleCurso 
}) {
  return (
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
                  <h3 className="font-bold text-xl mb-2 cursor-pointer hover:text-blue-600" onClick={() => verDetalleCurso(curso.id)}>
                    {curso.titulo}
                  </h3>
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
}