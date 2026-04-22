import React, { useRef, useEffect, useState } from 'react';
import '../src/css/ChickenGame.css'

// --- FUNCIONES DE CÁLCULO CLÍNICO (KAWATEK PROTOCOL) ---
const calculateClinicalMetrics = (history, score, rocksHit, startTime) => {
  if (history.length === 0) return { si: 0, cr: 0, fatigue: 0, ce: 0 };
  const ACTIVATION_THRESHOLD = 0.15; 
  let t_muscle_activity = 0;
  let t_selective_a = 0, t_selective_b = 0, t_coactivation = 0;

  history.forEach(s => {
    const actA = s.a > ACTIVATION_THRESHOLD;
    const actB = s.b > ACTIVATION_THRESHOLD;
    if (actA || actB) t_muscle_activity++;
    if (actA && !actB) t_selective_a++;
    if (!actA && actB) t_selective_b++;
    if (actA && actB) t_coactivation++;
  });

  const si = t_muscle_activity > 0 ? (t_selective_a + t_selective_b) / t_muscle_activity : 0;
  const cr = t_muscle_activity > 0 ? (t_coactivation / t_muscle_activity) * 100 : 0;
  const firstSamples = history.slice(0, 5); 
  const lastSamples = history.slice(-5);
  const avgInitial = firstSamples.length > 0 ? firstSamples.reduce((acc, val) => acc + Math.max(val.a, val.b), 0) / firstSamples.length : 0;
  const avgFinal = lastSamples.length > 0 ? lastSamples.reduce((acc, val) => acc + Math.max(val.a, val.b), 0) / lastSamples.length : 0;
  const fatigue = avgInitial > 0 ? (1 - (avgFinal / avgInitial)) * 100 : 0;

  const sessionMinutes = (Date.now() - startTime) / 60000;
  const ce = sessionMinutes > 0 ? (score - (rocksHit * 1.5)) / sessionMinutes : 0;

  return { 
    si: parseFloat(si.toFixed(2)), 
    cr: parseFloat(cr.toFixed(2)), 
    fatigue: parseFloat(fatigue.toFixed(2)),
    ce: parseFloat(ce.toFixed(2))
  };
};

// Agregamos patientId a las props del componente
const ChickenGame = ({ eff_A, eff_B, gameMode, patientId }) => { 
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [startTime] = useState(Date.now());
  const effARef = useRef(0);
  const effBRef = useRef(0);
  const scoreRef = useRef(0);
  const gameState = useRef({
    chickenX: 400,
    worms: [],
    rocks: [],
    frame: 0,
    showFatigue: false 
  });

  const sessionHistory = useRef([]);
  const rocksHit = useRef(0);
  const accumulator = useRef({ a: 0, b: 0, count: 0 });
  const lastSaveTime = useRef(Date.now());
  const initialBaseline = useRef(null);

  useEffect(() => {
    effARef.current = eff_A;
    effBRef.current = eff_B;
  }, [eff_A, eff_B]);
  // --- EFECTO DE GUARDADO ---
  useEffect(() => {
    // Verificamos que el juego haya terminado, que existan datos Y que tengamos un ID de paciente
    if (gameOver && sessionHistory.current.length > 0) {
      if (!patientId) {
        console.error("⚠️ No se puede guardar: patientId no definido.");
        return;
      }

      const metrics = calculateClinicalMetrics(sessionHistory.current, score, rocksHit.current, startTime);
      
      const saveData = async () => {
        try {
          console.log("📡 Enviando sesión al servidor...");
          const response = await fetch('http://localhost:3001/api/save-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              mode: gameMode, 
              patient_id: patientId, // Ahora sí está definido
              score: score, 
              samples: sessionHistory.current, 
              metrics: metrics 
            })
          });
          const result = await response.json();
          if (result.success) console.log("✅ Guardado exitoso:", result.sessionId);
        } catch (err) { 
          console.error("❌ Error de red:", err); 
        }
      };
      saveData();
    }
  }, [gameOver, patientId, gameMode, score, startTime]); // Añadidas dependencias correctas

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

  console.log("--- DEBUG KAWATEK ---");
  console.log("Modo recibido:", gameMode);
  console.log("Tipo de dato:", typeof gameMode);
  console.log("Señal A actual:", eff_A);
  console.log("Señal B actual:", eff_B);
  // ... resto del código
    const update = () => {
      if (gameOver) return;
      const state = gameState.current;
      state.frame++;

      accumulator.current.a += eff_A;
      accumulator.current.b += eff_B;
      accumulator.current.count++;

      const now = Date.now();
      if (now - lastSaveTime.current >= 1000) {
        const avgA = accumulator.current.a / accumulator.current.count;
        const avgB = accumulator.current.b / accumulator.current.count;
        const currentAvg = Math.max(avgA, avgB);

        if (initialBaseline.current === null && sessionHistory.current.length === 2) {
          initialBaseline.current = currentAvg;
        }

        state.showFatigue = (currentAvg > 0.85 || (initialBaseline.current > 0.05 && currentAvg > (initialBaseline.current * 1.2)));

        sessionHistory.current.push({
          t: new Date(now).toISOString(),
          a: parseFloat(avgA.toFixed(4)),
          b: parseFloat(avgB.toFixed(4))
        });
        accumulator.current = { a: 0, b: 0, count: 0 };
        lastSaveTime.current = now;
      }
// --- MOTOR DE FÍSICA SEGÚN EL MODO SELECCIONADO ---
      const SPEED_MOVE = 18.0;   // Qué tan rápido reacciona al músculo
      const GRAVITY_FORCE = 3.5; // Fuerza constante de la gravedad

      switch (gameMode) {
        case "FLEXION":
        case "FLEX":
          // MODULO FLEX: 
          // El paciente jala a la DERECHA con Canal A.
          // La gravedad jala siempre a la IZQUIERDA.
          state.chickenX += (effARef.current * SPEED_MOVE) - GRAVITY_FORCE;
          break;

        case "EXTENSION":
        case "EXT":

          state.chickenX += GRAVITY_FORCE - (effBRef.current * SPEED_MOVE);
          break;

        case "COMBINED":
        case "COMBINADO":
      
          state.chickenX += (effARef.current - effBRef.current) * SPEED_MOVE;
          break;

        default:

          state.chickenX += (effARef.current - effBRef.current) * SPEED_MOVE;
      }

      // --- LÍMITES FÍSICOS ---
      if (state.chickenX < 0) state.chickenX = 0;
      if (state.chickenX > 740) state.chickenX = 740;

      const level = Math.floor(score / 10);
      const currentSpeed = 3 + (level * 1.2);
      
      if (state.worms.length < (3 + level) && Math.random() < 0.02) {
        state.worms.push({ x: Math.random() * (canvas.width - 40), y: -20, offset: Math.random() * 10 });
      }
      if (score >= 25 && state.rocks.length < (2 + level) && Math.random() < 0.005) {
        state.rocks.push({ x: Math.random() * (canvas.width - 40), y: -20 });
      }

      const chickenRect = { x: state.chickenX, y: 440, w: 60, h: 50 };

      state.worms.forEach((w, i) => {
        w.y += currentSpeed;
        if (checkCollision(chickenRect, { x: w.x, y: w.y, w: 40, h: 10 })) {
          setScore(s => s + 1);
          state.worms.splice(i, 1);
        }
      });

      state.rocks.forEach((r, i) => {
        r.y += currentSpeed + 1.5;
        if (checkCollision(chickenRect, { x: r.x - 15, y: r.y - 15, w: 30, h: 30 })) {
          rocksHit.current += 1;
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

      state.worms.forEach(w => {
        ctx.fillStyle = '#FFB6C1';
        for (let i = 0; i < 5; i++) {
          const segY = w.y + Math.sin(w.offset + i * 0.8) * 3;
          ctx.beginPath(); ctx.arc(w.x + i * 8, segY, 4, 0, Math.PI * 2); ctx.fill();
        }
      });

      state.rocks.forEach(r => {
        ctx.fillStyle = '#505050';
        ctx.beginPath(); ctx.arc(r.x, r.y, 15, 0, Math.PI * 2); ctx.fill();
      });

      const x = state.chickenX; const y = 440;
      ctx.fillStyle = 'yellow';
      ctx.beginPath(); ctx.ellipse(x + 30, y + 25, 30, 25, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(x + 45, y + 15, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FF8000'; ctx.beginPath();
      ctx.moveTo(x + 55, y + 20); ctx.lineTo(x + 65, y + 25); ctx.lineTo(x + 55, y + 30); ctx.fill();
      
      const wingFlap = Math.sin(state.frame * 0.2) * (10 + eff_A * 20);
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.ellipse(x + 20, y + 25, 15, 5 + Math.abs(wingFlap)/4, wingFlap * Math.PI / 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#EAB308'; ctx.lineWidth = 1; ctx.stroke();
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath(); ctx.roundRect(25, 20, 120, 45, 10); ctx.fill();
      ctx.beginPath(); ctx.roundRect(canvas.width - 140, 20, 120, 45, 10); ctx.fill();

      ctx.fillStyle = 'white'; ctx.font = 'bold 22px Arial'; ctx.textAlign = 'left';
      ctx.fillText('❤️ '.repeat(lives), 35, 52); 
      ctx.textAlign = 'right'; ctx.fillText(`🪱 ${score}`, canvas.width - 55, 52); 

      if (state.showFatigue) {
        const pulse = Math.abs(Math.sin(state.frame * 0.1));
        ctx.fillStyle = `rgba(220, 38, 38, ${0.7 + pulse * 0.3})`;
        const msgWidth = 360;
        const msgX = (canvas.width - msgWidth) / 2;
        ctx.beginPath(); ctx.roundRect(msgX, 100, msgWidth, 75, 20); ctx.fill();
        ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.font = 'bold 22px Arial';
        ctx.fillText('⚠️ ESFUERZO ELEVADO', canvas.width / 2, 135);
        ctx.font = '14px Arial'; ctx.fillText('EL MÚSCULO ESTÁ MUY TENSO. RELAJA.', canvas.width / 2, 160);
      }
    };
    
    update();
    return () => cancelAnimationFrame(animationId);
  }, [gameOver, eff_A, eff_B, gameMode, score, lives]);

  return (
    <div className="game-wrapper">
      <canvas ref={canvasRef} width={800} height={550} className="game-canvas" />
      {gameOver && (
        <div className="game-over-overlay">
          <h2 className="game-over-title">SESIÓN TERMINADA</h2>
          <p className="game-over-score">{score} LOMBRICES RECOLECTADAS</p>
          <button onClick={() => window.location.reload()} className="new-session-btn">NUEVA SESIÓN</button>
        </div>
      )}
    </div>
  );
};

export default ChickenGame;