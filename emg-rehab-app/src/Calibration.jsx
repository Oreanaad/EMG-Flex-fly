import React, { useState, useEffect } from 'react';

const Calibration = ({ raw_A, raw_B, gameMode, onComplete }) => {
  const [phase, setPhase] = useState(gameMode === "EXT" ? "CAL_B" : "CAL_A");
  const [maxA, setMaxA] = useState(0.01);
  const [maxB, setMaxB] = useState(0.01);
  const [timeLeft, setTimeLeft] = useState(5);

  const currentRaw = phase === "CAL_A" ? raw_A : raw_B;
  const currentMax = phase === "CAL_A" ? maxA : maxB;

  // Captura de picos
  useEffect(() => {
    if (phase === "CAL_A" && raw_A > maxA) setMaxA(raw_A);
    if (phase === "CAL_B" && raw_B > maxB) setMaxB(raw_B);
  }, [raw_A, raw_B, phase]);

  // Cronómetro blindado
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (phase === "CAL_A" && (gameMode === "EXT" || gameMode === "COMBINED")) {
            setPhase("CAL_B");
            return 5;
          } else {
            clearInterval(timer);
            onComplete({ maxA: maxA || 0.5, maxB: maxB || 0.5 });
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, gameMode]);

  return (
    <div className="p-8 bg-slate-900 border-2 border-blue-500 rounded-2xl text-white text-center w-96">
      <h2 className="text-xl font-bold uppercase">{phase}</h2>
      <div className="text-6xl font-black my-4">{timeLeft}s</div>
      <div className="flex justify-around items-end h-40 bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex flex-col items-center w-12">
          <div className="w-full bg-green-500 rounded-t" style={{ height: `${currentRaw * 100}%`, transition: 'height 0.1s' }} />
          <span className="text-xs mt-1">RAW</span>
        </div>
        <div className="flex flex-col items-center w-12">
          <div className="w-full bg-yellow-400 rounded-t opacity-70" style={{ height: `${currentMax * 100}%` }} />
          <span className="text-xs mt-1">MAX</span>
        </div>
      </div>
      <p className="mt-4 text-blue-400">Esfuerzo: {(currentRaw * 100).toFixed(1)}%</p>
    </div>
  );
};

export default Calibration;