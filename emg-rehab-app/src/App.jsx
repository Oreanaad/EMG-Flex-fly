import React, { useState } from 'react';
import { useWebSerial } from './useWebSerial';
import Calibration from './Calibration';
import ChickenGame from './ChickenGame';

const App = () => {
  const { rawValues, isConnected, connectSerial } = useWebSerial();
  const [state, setState] = useState('MENU');
  const [mode, setMode] = useState('COMBINED');
  const [limits, setLimits] = useState({ maxA: 1.0, maxB: 1.0 });

  // --- LÓGICA DE ESCALADO DINÁMICO ---
  // Si limits.maxA es 0.25, y rawValues.a es 0.25 -> effA será 1.0 (100%)
  const effA = Math.min(1.0, rawValues.a / (limits.maxA > 0.01 ? limits.maxA : 1.0));
  const effB = Math.min(1.0, rawValues.b / (limits.maxB > 0.01 ? limits.maxB : 1.0));

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      {isConnected && (
        <div className="fixed top-2 text-white font-mono text-xs bg-black/50 p-2 rounded">
          {`DEBUG -> A: ${(effA * 100).toFixed(0)}% | B: ${(effB * 100).toFixed(0)}%`}
        </div>
      )}

      {!isConnected && (
        <button onClick={connectSerial} className="bg-red-600 p-4 rounded text-white font-bold">
          CONECTAR ARDUINO
        </button>
      )}

      {state === 'MENU' && isConnected && (
        <div className="flex flex-col gap-4">
          <button onClick={() => { setMode('FLEX'); setState('CAL'); }} className="bg-blue-600 p-4 rounded text-white font-bold uppercase">Calibrar Flexión</button>
          <button onClick={() => { setMode('EXT'); setState('CAL'); }} className="bg-blue-600 p-4 rounded text-white font-bold uppercase">Calibrar Extensión</button>
          <button onClick={() => { setMode('COMBINED'); setState('CAL'); }} className="bg-green-600 p-4 rounded text-white font-bold uppercase">Modo Combinado</button>
        </div>
      )}

      {state === 'CAL' && (
        <Calibration 
          raw_A={rawValues.a} 
          raw_B={rawValues.b} 
          gameMode={mode} 
          onComplete={(l) => { 
            console.log("Nuevos límites guardados:", l);
            setLimits(l); 
            setState('PLAY'); 
          }} 
        />
      )}

      {state === 'PLAY' && (
        <div className="flex flex-col items-center">
          <ChickenGame eff_A={effA} eff_B={effB} gameMode={mode} />
          <button 
            onClick={() => setState('MENU')} 
            className="mt-4 text-slate-500 hover:text-white text-xs uppercase tracking-widest"
          >
            Re-Calibrar / Menú
          </button>
        </div>
      )}
    </div>
  );
};

export default App;