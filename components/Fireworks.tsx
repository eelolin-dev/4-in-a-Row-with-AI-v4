
import React, { useEffect, useState } from 'react';

interface FireworksProps {
  winnerName: string;
}

// Inspired by the request image
const colors = ['#ff822e', '#ffda2a', '#b5fd3c', '#44fbfd', '#9696ff', '#e391fa', '#f78fa5', '#ff822e', '#ffda2a', '#b5fd3c', '#44fbfd', '#9696ff', '#e391fa'];
const fireworkColors = ['#ffc700', '#f44336', '#9c27b0', '#2196f3', '#4caf50', '#ff9800'];

const Fireworks: React.FC<FireworksProps> = ({ winnerName }) => {
  const [fireworks, setFireworks] = useState<React.ReactNode[]>([]);

  // Generate a set of fireworks on component mount
  useEffect(() => {
    const newFireworks = Array.from({ length: 30 }).map((_, i) => {
      // FIX: Cast the style object to allow for the '--firework-color' custom property.
      const style = {
        left: `${5 + Math.random() * 90}%`, // Avoid edges
        top: `${5 + Math.random() * 90}%`,
        transform: `scale(${0.8 + Math.random() * 1.0})`,
        animationDelay: `${0.1 + Math.random() * 2.5}s`,
        '--firework-color': fireworkColors[i % fireworkColors.length]
      } as React.CSSProperties;
      return <div key={i} className="firework" style={style}></div>;
    });
    setFireworks(newFireworks);
  }, []);

  const congratulationsText = `CONGRATULATIONS`.split('').map((char, i) => (
    <span
      key={`congrats-${i}`}
      style={{
        animationDelay: `${0.5 + i * 0.08}s`,
        color: colors[i],
        textShadow: `
          0 0 2px #fff,
          0 0 5px ${colors[i]},
          0 0 10px ${colors[i]}
        `,
      }}
      className="animate-light-up"
    >
      {char}
    </span>
  ));

  const winnerText = winnerName.split('').map((char, i) => (
    <span
      key={`winner-${i}`}
      style={{
        animationDelay: `${1.5 + i * 0.08}s`,
        color: '#fff',
         textShadow: `
          0 0 5px #fff,
          0 0 10px #fff,
          0 0 20px #ff00de
        `,
      }}
      className="animate-light-up"
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {fireworks}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4">
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest">
          {congratulationsText}
        </h2>
        <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
            {winnerText}
        </h3>
      </div>
    </div>
  );
};

export default Fireworks;