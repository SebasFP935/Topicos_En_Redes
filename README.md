🎓 Sistema de Video Tutoriales Universitarios - Frontend
Plataforma educativa para gestionar y visualizar cursos con videos tutoriales, desarrollada como parte del proyecto de Tópicos Selectos en Redes.
🚀 Tecnologías Utilizadas

React 18 - Librería de JavaScript para construir interfaces
Vite - Herramienta de build rápida para desarrollo
Tailwind CSS 3 - Framework de CSS para estilos
Lucide React - Iconos modernos
React Router DOM - Navegación entre páginas
Axios - Cliente HTTP para consumir APIs

📋 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado:

Node.js versión 24.11.1 LTS (recomendado) o superior

Puedes descargarlo desde: https://nodejs.org/


npm (viene incluido con Node.js)
Git para clonar el repositorio

Para verificar que tienes Node.js instalado:
bashnode --version
npm --version
🔧 Instalación
1. Clonar el repositorio
bashgit clone https://github.com/SebasFP935/Topicos_En_Redes.git
cd Topicos_En_Redes/video-tutoriales-frontend
2. Instalar dependencias
bashnpm install
Este comando instalará todas las dependencias necesarias del proyecto:

React y React DOM
Vite
Tailwind CSS
React Router DOM
Axios
Lucide React (iconos)
Y todas sus dependencias

3. Ejecutar el proyecto en modo desarrollo
bashnpm run dev
El proyecto se abrirá automáticamente en tu navegador en:
http://localhost:5173
📦 Scripts Disponibles

npm run dev - Inicia el servidor de desarrollo
npm run build - Compila el proyecto para producción
npm run preview - Previsualiza la versión de producción
npm run lint - Ejecuta el linter para verificar código

🏗️ Estructura del Proyecto
video-tutoriales-frontend/
├── node_modules/          # Dependencias (no se sube a Git)
├── public/                # Archivos estáticos
│   └── vite.svg
├── src/                   # Código fuente
│   ├── assets/           # Imágenes, iconos
│   ├── App.jsx           # Componente principal
│   ├── App.css           # Estilos del App
│   ├── index.css         # Estilos globales + Tailwind
│   └── main.jsx          # Punto de entrada
├── .gitignore            # Archivos ignorados por Git
├── index.html            # HTML principal
├── package.json          # Dependencias y scripts
├── postcss.config.js     # Configuración de PostCSS
├── tailwind.config.js    # Configuración de Tailwind
├── vite.config.js        # Configuración de Vite
└── README.md             # Este archivo
🎨 Funcionalidades Actuales

✅ Página de Inicio: Hero section con estadísticas y cursos destacados
✅ Explorar Cursos: Listado de cursos con búsqueda y filtros
✅ Detalle de Curso: Vista de curso individual con lista de videos
✅ Subir Contenido: Formulario para que docentes suban cursos
✅ Navegación: Menú responsive que funciona en móvil y desktop
✅ Diseño Responsive: Adaptado a diferentes tamaños de pantalla

🔄 Integración con Backend
Actualmente el frontend utiliza datos de ejemplo (mock data). Para conectarlo con el backend de Spring Boot:

Asegúrate de que el backend esté corriendo en http://localhost:8080
Las llamadas a la API se realizarán mediante Axios
Los endpoints estarán en src/services/api.js (próximamente)

🐛 Solución de Problemas
El proyecto no inicia
bash# Elimina node_modules y vuelve a instalar
rm -rf node_modules
npm install
npm run dev
Error con Tailwind CSS
Verifica que tailwind.config.js y postcss.config.js existan en la raíz del proyecto.
Puerto 5173 ya en uso
bash# Vite intentará usar otro puerto automáticamente
# O puedes especificar uno diferente en vite.config.js
Problemas con la versión de Node.js
Si tienes problemas, asegúrate de usar Node.js LTS (v24.11.1 o v22.x):
bashnvm use 24.11.1
👥 Roles de Usuario
El sistema contempla tres tipos de usuarios:

Estudiante: Busca, visualiza y reproduce cursos
Docente/Instructor: Crea y gestiona cursos, sube videos
Administrador: Gestiona usuarios, cursos y contenido general

🔜 Próximas Características

 Integración completa con API REST del backend
 Sistema de autenticación (JWT)
 Reproductor de video funcional (react-player)
 Sistema de comentarios y calificaciones
 Progreso del curso por usuario
 Panel de administración completo
 Integración con Sistema Social (Instagram universitario)
 Subida real de videos a almacenamiento en la nube

📝 Notas Adicionales

Los datos actuales son de ejemplo y serán reemplazados por llamadas al backend
El diseño sigue los principios de Clean Architecture
El proyecto está configurado para trabajar con HTTP (no HTTPS) en desarrollo

🤝 Contribuidores

Equipo de Desarrollo: [Tu nombre y el de tu equipo]
Materia: Tópicos Selectos en Redes
Universidad: [Nombre de tu universidad]

📄 Licencia
Este proyecto es parte de un trabajo académico universitario.






# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.