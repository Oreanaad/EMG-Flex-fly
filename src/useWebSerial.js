import { useState, useRef } from 'react';

export const useWebSerial = () => {
  const [rawValues, setRawValues] = useState({ a: 0, b: 0 });
  const [isConnected, setIsConnected] = useState(false);
  const readerRef = useRef(null);

  const connectSerial = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setIsConnected(true);

      const decoder = new TextDecoderStream();
      port.readable.pipeTo(decoder.writable);
      readerRef.current = decoder.readable.getReader();

      let buffer = "";
      while (true) {
        const { value, done } = await readerRef.current.read();
        if (done) break;
        
        buffer += value;

        if (buffer.length > 150) buffer = buffer.slice(-70);

        if (buffer.includes("\n")) {
          const lines = buffer.split("\n");
          const lastLine = lines[lines.length - 2];
          buffer = lines[lines.length - 1];

          if (lastLine) {
            const parts = lastLine.trim().split(',');
            if (parts.length >= 2) {
              const valA = (parseFloat(parts[0]) || 0) / 1023.0;
              const valB = (parseFloat(parts[1]) || 0) / 1023.0;

              setRawValues(prev => {
                // Si la señal nueva es menor a la anterior, bajamos a 0 inmediatamente
                // Si es mayor, aplicamos un poco de suavizado (0.5/0.5)
                const finalA = valA > prev.a ? (prev.a * 0.5 + valA * 0.5) : valA;
                const finalB = valB > prev.b ? (prev.b * 0.5 + valB * 0.5) : valB;

                return {
                  a: finalA < 0.02 ? 0 : finalA,
                  b: finalB < 0.02 ? 0 : finalB
                };
              });
            }
          }
        }
      }
    } catch (e) { 
      console.error(e); 
      setIsConnected(false); 
    }
  };

  return { rawValues, isConnected, connectSerial };
};