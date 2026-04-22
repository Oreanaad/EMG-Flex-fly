import React, { useRef, useEffect } from 'react';

const GameView = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Aquí es donde empezaremos a traducir tu lógica de Python
    // Por ahora, solo dibujamos un fondo para probar
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#4a90e2';
    ctx.fillText("Aquí volará el pollito con EMG", 50, 50);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={400} 
      style={{ border: '2px solid #333', borderRadius: '8px' }}
    />
  );
};

export default GameView;