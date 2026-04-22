import React from 'react';
// Importamos el CSS específico para el pollo
const ChickenVisual = () => {
  return (
    <div style={{ 
      position: 'relative', 
      width: 'clamp(190px, 20vw, 150px)', 
      aspectRatio: '1/1' 
    }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        {/* Cuerpo del pollo */}
        <ellipse cx="50" cy="55" rx="35" ry="30" fill="yellow" stroke="#EAB308" strokeWidth="2"/>
        {/* Ojo */}
        <circle cx="68" cy="45" r="4" fill="black"/>
        {/* Pico */}
        <polygon points="78,50 90,55 78,60" fill="#FF8000"/>
        {/* Ala */}
        <ellipse cx="35" cy="60" rx="18" ry="12" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5"/>
      </svg>
      {/* Sombra proyectada */}
      <div style={{ 
        position: 'absolute', 
        bottom: '5%', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '60%', 
        height: '5%', 
        backgroundColor: 'rgba(0,0,0,0.9)', 
        borderRadius: '100%', 
        filter: 'blur(3px)' 
      }}></div>
    </div>
  );
};

export default ChickenVisual;