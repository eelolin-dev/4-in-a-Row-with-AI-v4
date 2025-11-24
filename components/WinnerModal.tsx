
import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import Fireworks from './Fireworks';

interface WinnerModalProps {
  winner: Player | null;
  isDraw: boolean;
  onRestart: () => void;
  onNewGame: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, isDraw, onRestart, onNewGame }) => {
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (winner) {
      setShowControls(false); // Reset on new winner
      const timer = setTimeout(() => {
        setShowControls(true);
      }, 4000); // Show controls after fireworks animation
      return () => clearTimeout(timer);
    }
    if (isDraw) {
      setShowControls(true);
    }
  }, [winner, isDraw]);

  if (!winner && !isDraw) return null;

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      {winner && <Fireworks winnerName={winner.name} />}

      {/* For Draw */}
      {isDraw && showControls && (
        <div className="bg-slate-800/80 rounded-2xl p-8 text-center text-white shadow-2xl animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-4">It's a Draw!</h2>
          <div className="flex gap-4 mt-8">
            <button onClick={onRestart} className="px-6 py-3 bg-purple-600 rounded-lg text-lg font-bold hover:bg-purple-700 transition-colors">Play Again</button>
            <button onClick={onNewGame} className="px-6 py-3 bg-slate-600 rounded-lg text-lg font-bold hover:bg-slate-700 transition-colors">New Game</button>
          </div>
        </div>
      )}
      
      {/* For Winner, show controls after animation */}
      {winner && showControls && (
        <div className="absolute bottom-10 sm:bottom-20 z-20 animate-fade-in-up">
            <p className="text-2xl mb-4 text-center text-white drop-shadow-lg">{`Winner's Counter: ${winner.counter}`}</p>
            <div className="flex gap-4 mt-4">
              <button onClick={onRestart} className="px-6 py-3 bg-purple-600/80 backdrop-blur-sm rounded-lg text-lg font-bold hover:bg-purple-700 transition-colors">
                Play Again
              </button>
              <button onClick={onNewGame} className="px-6 py-3 bg-slate-600/80 backdrop-blur-sm rounded-lg text-lg font-bold hover:bg-slate-700 transition-colors">
                New Game
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default WinnerModal;
