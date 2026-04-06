import { useEffect, useRef } from 'react';

export const useGameLoop = (callback) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = time => {
    if (previousTimeRef.current !== undefined) {
      callback(time);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); 
};