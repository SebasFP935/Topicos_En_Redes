import React, { useState } from 'react';
import { Gift, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { cuponesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CuponBanner({ cupon }) {
  const { isAuthenticated } = useAuth();
  const [copiado, setCopiado] = useState(false);
  const [usado, setUsado] = useState(cupon.usado);

  const handleCopiarCodigo = async () => {
    try {
      // Copiar al portapapeles
      await navigator.clipboard.writeText(cupon.codigoCupon);
      setCopiado(true);

      // Si está autenticado, marcar como usado
      if (isAuthenticated()) {
        await cuponesAPI.marcarComoUsado(cupon.codigoCupon);
        setUsado(true);
      }

      setTimeout(() => setCopiado(false), 2000);
    } catch (error) {
      console.error('Error al copiar código:', error);
    }
  };

  const calcularTiempoRestante = () => {
    if (!cupon.fechaExpiracion) return null;
    
    const ahora = new Date();
    const expiracion = new Date(cupon.fechaExpiracion);
    const diff = expiracion - ahora;
    
    if (diff <= 0) return 'Expirado';
    
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (dias > 0) return `${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `${horas} hora${horas > 1 ? 's' : ''}`;
    return 'Menos de 1 hora';
  };

  const tiempoRestante = calcularTiempoRestante();

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-upb-xl">
      {/* Fondo animado con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 animate-gradient-x"></div>
      
      {/* Patrón decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full filter blur-3xl"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 p-8">
        <div className="flex items-start gap-6">
          {/* Icono animado */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-2xl animate-ping"></div>
              <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Gift size={40} className="text-green-600 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-yellow-300" />
              <h3 className="text-2xl font-bold text-white">
                ¡Cupón de Descuento Disponible!
              </h3>
            </div>
            
            <p className="text-white/90 text-lg mb-4">
              Este curso ha alcanzado <span className="font-bold">{cupon.vistasRequeridas} visualizaciones</span>. 
              ¡Celebra con un descuento en Snack! 🍔
            </p>

            {/* Código del cupón */}
            <div className="bg-white rounded-xl p-5 mb-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">
                    Código de descuento
                  </p>
                  <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                    {cupon.codigoCupon}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
                      <Gift size={14} />
                      {cupon.porcentajeDescuento}% OFF
                    </span>
                    {tiempoRestante && tiempoRestante !== 'Expirado' && (
                      <span className="text-xs text-gray-500">
                        ⏰ Expira en {tiempoRestante}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCopiarCodigo}
                  disabled={usado && copiado}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                    copiado 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:scale-105'
                  }`}
                >
                  {copiado ? (
                    <>
                      <Check size={20} />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-white text-sm mb-3">
                <strong>📱 Cómo usar tu cupón:</strong>
              </p>
              <ol className="text-white/90 text-sm space-y-1.5 ml-4 list-decimal">
                <li>Copia el código haciendo clic en el botón</li>
                <li>Visita el sistema Snack de la UPB</li>
                <li>Ingresa el código en tu orden</li>
                <li>¡Disfruta tu descuento! 🎉</li>
              </ol>
              
              <a 
                href="http://localhost:3000/snack" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all text-sm"
              >
                Ir a Snack
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Badge de único uso */}
            {usado && (
              <div className="mt-3 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold">
                <Check size={16} />
                Cupón de único uso - Ya fue utilizado
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}