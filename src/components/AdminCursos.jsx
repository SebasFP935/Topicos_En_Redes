import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAdmin } from '../hooks/UseAdmin';

export default function AdminCursos({ setVistaActual, verDetalleCurso }) {
  const {
    cursos,
    cargando,
    cargarCursos,
    eliminarCurso,
    cambiarEstadoCurso
  } = useAdmin();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarCursos();
  }, []);

  const cursosFiltrados = cursos.filter(c => {
    const matchBusqueda = 
      c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.instructor.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.categoria.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchEstado = 
      filtroEstado === '' ||
      (filtroEstado === 'publicado' && c.publicado) ||
      (filtroEstado === 'borrador' && !c.publicado);
    
    return matchBusqueda && matchEstado;
  });

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de eliminar este curso? Se eliminarán todos sus videos. Esta acción no se puede deshacer.')) {
      const result = await eliminarCurso(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleCambiarEstado = async (id, publicado) => {
    const mensaje = publicado 
      ? '¿Deseas publicar este curso?' 
      : '¿Deseas ocultar este curso? Los estudiantes no podrán verlo.';
    
    if (confirm(mensaje)) {
      await cambiarEstadoCurso(id, publicado);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => setVistaActual('admin-dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Volver al Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Gestión de Cursos</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por título, instructor o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="publicado">Publicados</option>
              <option value="borrador">Borradores</option>
            </select>
          </div>
        </div>

        {cargando ? (
          <div className="text-center py-12">Cargando cursos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursosFiltrados.map((curso) => (
              <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img
                  src={curso.imagenPortada || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop'}
                  alt={curso.titulo}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg flex-1">{curso.titulo}</h3>
                    {curso.publicado ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Publicado
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Borrador
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{curso.instructor}</p>
                  <p className="text-sm text-blue-600 mb-4">{curso.categoria}</p>
                  
                  <div className="flex justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
                    <span>{curso.videos} videos</span>
                    <span>{curso.duracion}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => verDetalleCurso(curso.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition text-sm"
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                    
                    <button
                      onClick={() => handleCambiarEstado(curso.id, !curso.publicado)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded transition text-sm ${
                        curso.publicado
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                      title={curso.publicado ? 'Ocultar' : 'Publicar'}
                    >
                      {curso.publicado ? (
                        <>
                          <XCircle size={16} />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Publicar
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleEliminar(curso.id)}
                      className="flex items-center justify-center bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cursosFiltrados.length === 0 && !cargando && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron cursos
          </div>
        )}
      </div>
    </div>
  );
}