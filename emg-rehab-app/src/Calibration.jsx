import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: 'white',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '32px', fontWeight: '800', margin: 0 },
  subtitle: { color: '#94a3b8', marginTop: '8px' },
  connectBtn: {
    backgroundColor: '#6d28d9',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '40px',
    boxShadow: '0 0 30px rgba(109, 40, 217, 0.4)',
    transition: 'all 0.3s ease',
  },
  connectedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '12px 24px',
    borderRadius: '50px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    marginBottom: '40px',
    fontSize: '14px',
    fontWeight: '700',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    width: '100%',
    maxWidth: '900px',
    marginBottom: '40px',
  },
  modeCard: {
    backgroundColor: '#1e293b',
    borderRadius: '24px',
    padding: '30px',
    textAlign: 'center',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  activeCard: {
    borderColor: '#6d28d9',
    backgroundColor: 'rgba(109, 40, 217, 0.1)',
    boxShadow: '0 0 20px rgba(109, 40, 217, 0.2)',
  },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '50px' },
  statBox: {
    backgroundColor: '#000',
    padding: '24px',
    borderRadius: '20px',
    width: '200px',
    textAlign: 'center',
    border: '1px solid #334155',
  },
  statLabel: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' },
  statValue: { fontSize: '28px', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace' },
  actionBtn: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '18px 60px',
    borderRadius: '50px',
    fontWeight: '900',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)',
  }
};

const Calibration = ({ isConnected, connectSerial, raw_A, raw_B, onComplete }) => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState('COMBINED');
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState('IDLE'); 
  const [tempMax, setTempMax] = useState({ a: 0, b: 0 });
  const timerRef = useRef(null);

  // Valores para visualización (Porcentaje)
  const displayRawA = `${(Number(raw_A || 0) * 100).toFixed(0)}%`;
  const displayRawB = `${(Number(raw_B || 0) * 100).toFixed(0)}%`;

  // Captura de picos máximos en tiempo real
  useEffect(() => {
    if (isCalibrating) {
      if (phase === 'A' || activeMode === 'FLEXION') {
        setTempMax(prev => ({ ...prev, a: Math.max(prev.a, raw_A) }));
      }
      if (phase === 'B' || activeMode === 'EXTENSION') {
        setTempMax(prev => ({ ...prev, b: Math.max(prev.b, raw_B) }));
      }
    }
  }, [raw_A, raw_B, isCalibrating, phase, activeMode]);
 
  // Lógica del contador y control de flujo
// Lógica del contador y control de flujo
  useEffect(() => {
    // Si no estamos calibrando, no hacemos nada
    if (!isCalibrating) return;

    if (timeLeft > 0) {
      // Usamos setInterval para que sea más estable que setTimeout
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      // Limpiamos el intervalo si el componente se desmonta o el efecto se reinicia
      return () => clearInterval(timer);
    } 
    
    // Cuando el tiempo llega a 0
    if (timeLeft === 0) {
      if (activeMode === 'COMBINED' && phase === 'A') {
        setPhase('B');
        setTimeLeft(5);
      } else {
        // Finalización
        setIsCalibrating(false);
        setPhase('IDLE');

        // Protegemos contra valores en 0 (vital para que funcione la gravedad en el juego)
        const finalMaxA = tempMax.a > 0.02 ? tempMax.a : 0.5;
        const finalMaxB = tempMax.b > 0.02 ? tempMax.b : 0.5;

        onComplete({ maxA: finalMaxA, maxB: finalMaxB }, activeMode);
        setTimeout(() => navigate('/game'), 800);
      }
    }
  }, [isCalibrating, timeLeft, phase, activeMode]); 
  // NOTA: Quitamos tempMax de aquí para que el contador no se resetee con cada señal del sensor.

 const handleStartCalibration = () => {
  if (!isConnected) return alert("Please connect the Arduino first.");
  
  // IMPORTANTE: Inicializar con un valor pequeño (0.1) en lugar de 0 
  // para evitar divisiones por cero en el juego si el modo es simple.
  setTempMax({ a: 0.1, b: 0.1 }); 
  
  setIsCalibrating(true);
  setTimeLeft(5);
  setPhase((activeMode === 'COMBINED' || activeMode === 'FLEXION') ? 'A' : 'B');
};

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Bio-Sensor Configuration</h1>
        <p style={styles.subtitle}>Calibrate EMG intensity for KAWATEK Protocol.</p>
      </header>

      {!isConnected ? (
        <button style={styles.connectBtn} onClick={connectSerial}>🔌 CONNECT ARDUINO</button>
      ) : (
        <div style={styles.connectedBadge}>SISTEMA KAWATEK CONECTADO</div>
      )}

      <div style={styles.grid}>
        {['FLEXION', 'EXTENSION', 'COMBINED'].map(mode => (
          <div 
            key={mode}
            onClick={() => !isCalibrating && setActiveMode(mode)}
            style={{...styles.modeCard, ...(activeMode === mode ? styles.activeCard : {})}}
          >
            <div style={{ fontSize: '42px' }}>{mode === 'FLEXION' ? '💪' : mode === 'EXTENSION' ? '🤚' : '⚙️'}</div>
            <h3>{mode}</h3>
            <p style={{ fontSize: '11px', color: '#64748b' }}>
              {mode === 'COMBINED' ? 'SEQUENTIAL A/B' : `CHANNEL ${mode === 'FLEXION' ? 'A' : 'B'} ONLY`}
            </p>
          </div>
        ))}
      </div>

      <div style={styles.statsRow}>
        <div style={{...styles.statBox, opacity: (phase === 'B') ? 0.3 : 1}}>
          <span style={styles.statLabel}>Raw Channel A</span>
          <p style={styles.statValue}>{displayRawA}</p>
          <span style={{fontSize: '10px', color: '#444'}}>MAX: {(tempMax.a * 100).toFixed(0)}%</span>
        </div>
        <div style={{...styles.statBox, opacity: (phase === 'A') ? 0.3 : 1}}>
          <span style={styles.statLabel}>Raw Channel B</span>
          <p style={styles.statValue}>{displayRawB}</p>
          <span style={{fontSize: '10px', color: '#444'}}>MAX: {(tempMax.b * 100).toFixed(0)}%</span>
        </div>
      </div>

      {isCalibrating ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#f59e0b', fontWeight: 'bold' }}>
            {phase === 'A' ? "PULL / FLEX (CHANNEL A)" : "PUSH / EXTEND (CHANNEL B)"}
          </p>
          <div style={{ fontSize: '60px', fontWeight: '900', color: '#f59e0b' }}>{timeLeft}s</div>
        </div>
      ) : (
        <button 
          style={{...styles.actionBtn, opacity: isConnected ? 1 : 0.5}} 
          onClick={handleStartCalibration}
          disabled={!isConnected}
        >
          {activeMode === 'COMBINED' ? "START FULL CALIBRATION (10s)" : "START 5s CALIBRATION"}
        </button>
      )}
    </div>
  );
};

export default Calibration;