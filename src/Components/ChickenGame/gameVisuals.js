export const drawGame = (ctx, canvas, state, livesRef, scoreRef, effARef) => {
  // 1. Fondo y Suelo
  ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#228B22'; ctx.fillRect(0, 490, canvas.width, 110);

  // 2. Gusanos
  state.worms.forEach(w => {
    ctx.fillStyle = '#FFB6C1';
    for (let i = 0; i < 5; i++) {
      const segY = w.y + Math.sin(w.offset + i * 0.8) * 3;
      ctx.beginPath(); ctx.arc(w.x + i * 8, segY, 4, 0, Math.PI * 2); ctx.fill();
    }
  });

  // 3. Rocas
  state.rocks.forEach(r => {
    ctx.fillStyle = '#505050';
    ctx.beginPath(); ctx.arc(r.x, r.y, 15, 0, Math.PI * 2); ctx.fill();
  });

  // 4. Pollito (Copiado tal cual de tu código)
  const x = state.chickenX; const y = 440;
  ctx.fillStyle = 'yellow';
  ctx.beginPath(); ctx.ellipse(x + 30, y + 25, 30, 25, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(x + 45, y + 15, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#FF8000'; ctx.beginPath();
  ctx.moveTo(x + 55, y + 20); ctx.lineTo(x + 65, y + 25); ctx.lineTo(x + 55, y + 30); ctx.fill();
  
  const wingFlap = Math.sin(state.frame * 0.2) * (10 + effARef.current * 20);
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.ellipse(x + 20, y + 25, 15, 5 + Math.abs(wingFlap)/4, wingFlap * Math.PI / 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#EAB308'; ctx.lineWidth = 1; ctx.stroke();
  
  // 5. UI (Corazones y Score usando REFS)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath(); ctx.roundRect(25, 20, 120, 45, 10); ctx.fill();
  ctx.beginPath(); ctx.roundRect(canvas.width - 140, 20, 120, 45, 10); ctx.fill();

  ctx.fillStyle = 'white'; ctx.font = 'bold 22px Arial'; ctx.textAlign = 'left';
  ctx.fillText('❤️ '.repeat(livesRef.current), 35, 52); 
  ctx.textAlign = 'right'; 
  ctx.fillText(`🪱 ${scoreRef.current}`, canvas.width - 55, 52); 

  // 6. Alerta de Fatiga
  if (state.showFatigue) {
    const pulse = Math.abs(Math.sin(state.frame * 0.1));
    ctx.fillStyle = `rgba(220, 38, 38, ${0.7 + pulse * 0.3})`;
    const msgWidth = 360;
    const muscleName = state.fatiguedChannel === 'A' ? 'FLEXOR (Canal A)' : 'EXTENSOR (Canal B)';
    const msgX = (canvas.width - msgWidth) / 2;
    ctx.beginPath(); ctx.roundRect(msgX, 100, msgWidth, 75, 20); ctx.fill();
    ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.font = 'bold 22px Arial';
    ctx.fillText('⚠️ ESFUERZO ELEVADO', canvas.width / 2, 135);
    ctx.font = '14px Arial'; 
    ctx.fillText(`RELAJA EL ${muscleName}`, canvas.width / 2, 160);
  }
};