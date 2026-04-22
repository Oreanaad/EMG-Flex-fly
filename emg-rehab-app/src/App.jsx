import React, { useState } from 'react';
import { useWebSerial } from './useWebSerial';
import { AuthProvider } from './Context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import BionicLogin from './pages/Login'; 
import Registro from './pages/Registro';
import VerifySuccess from './VerifySuccess';
import DoctorDashboard from './DoctorDashboard';
import Calibration from './Calibration';
import ChickenGame from './ChickenGame';

const App = () => {
  const { rawValues, isConnected, connectSerial } = useWebSerial();
  
  // UNIFICADO: Usamos 'mode' como estado único para el tipo de ejercicio
  const [mode, setMode] = useState('COMBINED');
  const [limits, setLimits] = useState({ maxA: 1.0, maxB: 1.0 });

  // Cálculo de esfuerzo normalizado (0.0 a 1.0)
  const effA = Math.min(1.0, rawValues.a / (limits.maxA > 0.01 ? limits.maxA : 1.0));
  const effB = Math.min(1.0, rawValues.b / (limits.maxB > 0.01 ? limits.maxB : 1.0));

  const [selectedPatient, setSelectedPatient] = useState({ id: 1, name: "Oreana" });

  return (
    <div className="min-h-screen bg-slate-950">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<BionicLogin />} /> 
            <Route path="/login" element={<BionicLogin />} /> 
            <Route path="/registro" element={<Registro />} />
            <Route path="/verify-success" element={<VerifySuccess />} />
            <Route path="/dashboard" element={<DoctorDashboard />} />

            {/* RUTA DE CALIBRACIÓN */}
            <Route path="/calibration" element={
              <Calibration 
                isConnected={isConnected}
                connectSerial={connectSerial}
                raw_A={rawValues.a} 
                raw_B={rawValues.b} 
                onComplete={(l, m) => {
                  // 'l' son los nuevos límites (maxA, maxB)
                  // 'm' es el modo seleccionado (FLEXION, EXTENSION o COMBINED)
                  setLimits(l);
                  setMode(m); 
                }} 
              />
            } />

            {/* RUTA DEL JUEGO */}
            <Route path="/game" element={
              <div className="flex flex-col items-center justify-center min-h-screen relative">
                {isConnected && (
                  <div className="fixed top-4 left-4 text-emerald-400 font-mono text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl z-50">
                    <span className="block mb-1 text-slate-500 uppercase text-[10px]">EMG Telemetry</span>
                    <div className="flex flex-col gap-1">
                      <span>{`EFF_A: ${(effA * 100).toFixed(0)}%`}</span>
                      <span>{`EFF_B: ${(effB * 100).toFixed(0)}%`}</span>
                      <span className="text-amber-400 mt-1 border-t border-slate-700 pt-1">
                        {`MODO: ${mode}`}
                      </span>
                    </div>
                  </div>
                )}
          
                <ChickenGame 
                  eff_A={effA} 
                  eff_B={effB}
                  gameMode={mode} // Ahora sí le pasamos el estado que actualiza la calibración
                  patientId={selectedPatient.id}
                />
              </div>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;