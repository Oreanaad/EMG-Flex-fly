import React, { useRef, useEffect, useState } from 'react';

const ChickenGame = ({ eff_A, eff_B, gameMode }) => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const gameState = useRef({
    chickenX: 400,
    worms: [],
    rocks: [],
    frame: 0,
  });

  // Ref para acumular los datos clínicos sin causar re-renders
  const sessionHistory = useRef([]);

  // --- EFECTO 1: ENVIAR A POSTGRES AL TERMINAR ---
  useEffect(() => {
    if (gameOver && sessionHistory.current.length > 0) {
      const saveData = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/save-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: gameMode,
              score: score,
              samples: sessionHistory.current
            })
          });
          if (response.ok) console.log("¡Datos guardados en Postgres!");
        } catch (err) {
          console.error("Error al conectar con la API:", err);
        }
      };
      saveData();
    }
  }, [gameOver]);

  // --- EFECTO 2: BUCLE PRINCIPAL DEL JUEGO ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const update = () => {
      if (gameOver) return;
      const state = gameState.current;
      state.frame++;

      // 1. CAPTURA DE DATOS (Misma lógica que tu Python)
      const q = Math.abs(eff_A - eff_B) / (eff_A + eff_B + 0.01);
      const co = (eff_A > 0.3 && eff_B > 0.3) ? (eff_A + eff_B) / 2 : 0;
      
      sessionHistory.current.push({
        t: Date.now(),
        a: parseFloat(eff_A.toFixed(4)),
        b: parseFloat(eff_B.toFixed(4)),
        q: parseFloat(q.toFixed(4)),
        co: parseFloat(co.toFixed(4)),
        f: false 
      });

      // 2. FÍSICA DE MOVIMIENTO
      const SPEED_MOVE = 14.0;
      const GRAVITY_FORCE = 2.5;

      if (gameMode === "FLEX") state.chickenX += (eff_A * SPEED_MOVE) - GRAVITY_FORCE;
      else if (gameMode === "EXT") state.chickenX += GRAVITY_FORCE - (eff_B * SPEED_MOVE);
      else if (gameMode === "COMBINED") state.chickenX += (eff_A - eff_B) * SPEED_MOVE;

      state.chickenX = Math.max(0, Math.min(canvas.width - 60, state.chickenX));

      // 3. DINÁMICA DE DIFICULTAD
      const level = Math.floor(score / 25);
      const currentSpeed = 3 + (level * 1.2);
      const wormProb = Math.max(0.01, 0.02 + (level * 0.003));

      // 4. SPAWNING
      if (state.worms.length < (3 + level) && Math.random() < wormProb) {
        state.worms.push({ x: Math.random() * (canvas.width - 40), y: -20, offset: Math.random() * 10 });
      }
      if (score >= 25) {
        const rockProb = 0.005 + (level * 0.002);
        if (state.rocks.length < (2 + level) && Math.random() < rockProb) {
          state.rocks.push({ x: Math.random() * (canvas.width - 40), y: -20 });
        }
      }

      // 5. COLISIONES
      const chickenRect = { x: state.chickenX, y: 440, w: 60, h: 50 };

      state.worms.forEach((w, i) => {
        w.y += currentSpeed;
        w.offset += 0.15;
        if (checkCollision(chickenRect, { x: w.x, y: w.y, w: 40, h: 10 })) {
          setScore(s => s + 1);
          state.worms.splice(i, 1);
        }
      });

      state.rocks.forEach((r, i) => {
        r.y += currentSpeed + 1.5;
        if (checkCollision(chickenRect, { x: r.x - 15, y: r.y - 15, w: 30, h: 30 })) {
          setLives(l => {
            if (l <= 1) setGameOver(true);
            return l - 1;
          });
          state.rocks.splice(i, 1);
        }
      });

      state.worms = state.worms.filter(w => w.y < canvas.height);
      state.rocks = state.rocks.filter(r => r.y < canvas.height);

      draw(ctx, canvas);
      animationId = requestAnimationFrame(update);
    };

    const checkCollision = (r1, r2) => (
      r1.x < r2.x + r2.w && r1.x + r1.w > r2.x &&
      r1.y < r2.y + r2.h && r1.y + r1.h > r2.y
    );

    const draw = (ctx, canvas) => {
      const state = gameState.current;
      ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#228B22'; ctx.fillRect(0, 490, canvas.width, 110);

      // Lombrices
      ctx.fillStyle = '#FFB6C1';
      state.worms.forEach(w => {
        for (let i = 0; i < 5; i++) {
          const segY = w.y + Math.sin(w.offset + i * 0.8) * 3;
          ctx.beginPath(); ctx.arc(w.x + i * 8, segY, 4, 0, Math.PI * 2); ctx.fill();
        }
      });

      // Rocas
      ctx.fillStyle = '#505050';
      state.rocks.forEach(r => {
        ctx.beginPath(); ctx.arc(r.x, r.y, 15, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'black'; ctx.stroke();
      });

      // Pollito
      const x = state.chickenX; const y = 440;
      ctx.fillStyle = 'yellow';
      ctx.beginPath(); ctx.ellipse(x + 30, y + 25, 30, 25, 0, 0, Math.PI * 2); ctx.fill();
      const wingY = y + 18 + (eff_A * 12);
      ctx.fillStyle = '#F1C40F';
      ctx.beginPath(); ctx.ellipse(x + 20, wingY, 15, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(x + 45, y + 15, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FF8000'; ctx.beginPath();
      ctx.moveTo(x + 55, y + 20); ctx.lineTo(x + 65, y + 25); ctx.lineTo(x + 55, y + 30); ctx.fill();
    };

    update();
    return () => cancelAnimationFrame(animationId);
  }, [gameOver, eff_A, eff_B, gameMode, score]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex gap-10 mb-4 px-6 py-2 bg-slate-900/50 rounded-full border border-white/10 backdrop-blur-sm">
        <div className="text-white font-black text-xl">LOMBRICES: <span className="text-pink-400">{score}</span></div>
        <div className="text-white font-black text-xl">VIDAS: <span className="text-red-500">{'❤️'.repeat(lives)}</span></div>
      </div>
      
      <canvas ref={canvasRef} width={800} height={550} className="rounded-2xl shadow-2xl border-8 border-slate-800" />
      
      {gameOver && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-500">
          <h2 className="text-red-500 text-6xl font-black mb-2">¡SESIÓN TERMINADA!</h2>
          <p className="text-white text-2xl mb-10 opacity-80">Lograste recolectar {score} lombrices</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-4 rounded-full font-black text-2xl shadow-lg hover:scale-110 transition-all"
          >
            NUEVA SESIÓN
          </button>
        </div>
      )}
    </div>
  );
};

export default ChickenGame;