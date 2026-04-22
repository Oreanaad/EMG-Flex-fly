import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifySuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Temporizador para la redirección automática
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirigir cuando llegue a 0
    if (countdown === 0) {
      navigate('/login');
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#0f172a', // El mismo azul oscuro de tu login
      color: 'white',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      
      {/* Icono de éxito animado (Simple SVG) */}
      <div style={{ marginBottom: '30px' }}>
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="2"/>
          <path d="M8 12L11 15L16 9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '15px' }}>
        ¡Cuenta Verificada!
      </h1>
      
      <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '400px', lineHeight: '1.6' }}>
        Tu registro en la plataforma de rehabilitación biónica ha sido completado con éxito.
      </p>

      <div style={{ 
        marginTop: '40px', 
        padding: '15px 30px', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>
          Serás redirigido al panel de acceso en <span style={{ color: '#facc15', fontWeight: 'bold' }}>{countdown} segundos</span>...
        </p>
      </div>

      <button 
        onClick={() => navigate('/login')}
        style={{
          marginTop: '30px',
          background: 'none',
          border: 'none',
          color: '#6d28d9',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Ir al login ahora
      </button>

      {/* Decoración sutil de fondo */}
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        fontSize: '10px', 
        color: '#334155', 
        letterSpacing: '2px' 
      }}>
        KAWATEK SYSTEMS © 2026
      </div>
    </div>
  );
};

export default VerifySuccess;