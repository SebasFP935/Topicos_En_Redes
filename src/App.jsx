import React, { useState } from 'react';
import { Play, BookOpen, User, Search, Upload, Menu, X } from 'lucide-react';

// Datos de ejemplo (mock data)
const cursosEjemplo = [
  {
    id: 1,
    titulo: "Introducción a Programación",
    instructor: "Prof. García",
    descripcion: "Curso básico de programación para principiantes",
    videos: 12,
    duracion: "8 horas",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop"
  },
  {
    id: 2,
    titulo: "Bases de Datos Avanzadas",
    instructor: "Prof. Rodríguez",
    descripcion: "Aprende SQL, NoSQL y diseño de bases de datos",
    videos: 18,
    duracion: "12 horas",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop"
  },
  {
    id: 3,
    titulo: "Redes de Computadoras",
    instructor: "Prof. Martínez",
    descripcion: "Fundamentos de redes y protocolos TCP/IP",
    videos: 15,
    duracion: "10 horas",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop"
  },
  {
    id: 4,
    titulo: "Desarrollo Web Full Stack",
    instructor: "Prof. López",
    descripcion: "Frontend y Backend desde cero",
    videos: 24,
    duracion: "16 horas",
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=225&fit=crop"
  }
];

const videosEjemplo = [
  { id: 1, titulo: "Introducción al curso", duracion: "5:30", numero: 1 },
  { id: 2, titulo: "Variables y tipos de datos", duracion: "12:45", numero: 2 },
  { id: 3, titulo: "Estructuras de control", duracion: "18:20", numero: 3 },
  { id: 4, titulo: "Funciones y métodos", duracion: "15:10", numero: 4 },
  { id: 5, titulo: "Programación orientada a objetos", duracion: "22:35", numero: 5 }
];

function App() {
  const [vistaActual, setVistaActual] = useState('home');
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const NavBar = () => (
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
            <button onClick={() => setVistaActual('subir')} className="hover:text-blue-200 transition flex items-center gap-1">
              <Upload size={18} />
              Subir Contenido
            </button>
            <button className="hover:text-blue-200 transition flex items-center gap-1">
              <User size={18} />
              Mi Perfil
            </button>
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
            <button onClick={() => { setVistaActual('subir'); setMenuAbierto(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-2 rounded">
              Subir Contenido
            </button>
            <button className="block w-full text-left py-2 hover:bg-blue-700 px-2 rounded">
              Mi Perfil
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  const Home = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Aprende con Video Tutoriales
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma educativa universitaria para compartir y aprender
        </p>
        <button 
          onClick={() => setVistaActual('cursos')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Explorar Cursos
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600">Cursos Disponibles</div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">2,500+</div>
            <div className="text-gray-600">Videos Tutoriales</div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">5,000+</div>
            <div className="text-gray-600">Estudiantes Activos</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Cursos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cursosEjemplo.map(curso => (
            <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer" onClick={() => {
              setCursoSeleccionado(curso);
              setVistaActual('curso-detalle');
            }}>
              <img src={curso.thumbnail} alt={curso.titulo} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{curso.titulo}</h3>
                <p className="text-gray-600 text-sm mb-2">{curso.instructor}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{curso.videos} videos</span>
                  <span>{curso.duracion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Cursos = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Explorar Cursos</h1>
        
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Buscar cursos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todas las categorías</option>
            <option>Programación</option>
            <option>Bases de Datos</option>
            <option>Redes</option>
            <option>Desarrollo Web</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosEjemplo.filter(c => c.titulo.toLowerCase().includes(busqueda.toLowerCase())).map(curso => (
            <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer" onClick={() => {
              setCursoSeleccionado(curso);
              setVistaActual('curso-detalle');
            }}>
              <img src={curso.thumbnail} alt={curso.titulo} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{curso.titulo}</h3>
                <p className="text-gray-600 text-sm mb-3">{curso.descripcion}</p>
                <p className="text-blue-600 font-semibold mb-3">{curso.instructor}</p>
                <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
                  <span className="flex items-center gap-1">
                    <Play size={16} />
                    {curso.videos} videos
                  </span>
                  <span>{curso.duracion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CursoDetalle = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => setVistaActual('cursos')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Volver a cursos
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden mb-4" style={{aspectRatio: '16/9'}}>
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <Play size={64} className="mx-auto mb-4" />
                  <p className="text-lg">Reproductor de Video</p>
                  <p className="text-sm text-gray-400 mt-2">Aquí se reproducirán los videos del curso</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{cursoSeleccionado?.titulo}</h1>
              <p className="text-blue-600 font-semibold mb-4">{cursoSeleccionado?.instructor}</p>
              <p className="text-gray-600 mb-4">{cursoSeleccionado?.descripcion}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{cursoSeleccionado?.videos} videos</span>
                <span>{cursoSeleccionado?.duracion} de contenido</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-4">Contenido del Curso</h3>
              <div className="space-y-2">
                {videosEjemplo.map(video => (
                  <div key={video.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer border border-gray-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {video.numero}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{video.titulo}</p>
                      <p className="text-xs text-gray-500">{video.duracion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SubirContenido = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      alert('Funcionalidad de subida en desarrollo');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Subir Nuevo Curso</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título del Curso</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Introducción a Python" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe el contenido del curso..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Selecciona una categoría</option>
                  <option>Programación</option>
                  <option>Bases de Datos</option>
                  <option>Redes</option>
                  <option>Desarrollo Web</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de Portada</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">Haz clic o arrastra una imagen aquí</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Videos del Curso</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                  <Play className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">Haz clic o arrastra videos aquí</p>
                  <p className="text-xs text-gray-500 mt-1">Formatos soportados: MP4, AVI, MOV</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Publicar Curso
                </button>
                <button onClick={() => setVistaActual('home')} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {vistaActual === 'home' && <Home />}
      {vistaActual === 'cursos' && <Cursos />}
      {vistaActual === 'curso-detalle' && <CursoDetalle />}
      {vistaActual === 'subir' && <SubirContenido />}
    </div>
  );
}

export default App;