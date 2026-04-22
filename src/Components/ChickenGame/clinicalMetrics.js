// Mantenemos tu lógica Kawatek intacta
export const calculateClinicalMetrics = (history, score, rocksHit, startTime) => {
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