
import React from 'react';
import { CellState, Player, Theme } from '../types';

interface CellProps {
  state: CellState;
  players: [Player, Player];
  theme: Theme;
}

const Cell: React.FC<CellProps> = ({ state, players, theme }) => {
  const getCounterContent = () => {
    if (state === 1) return players[0].counter;
    if (state === 2) return players[1].counter;
    return '';
  };

  const getCounterColor = () => {
    if (state === 1) return theme.player1Counter;
    if (state === 2) return theme.player2Counter;
    return '';
  };
  
  return (
    <div className={`aspect-square rounded-full ${theme.cellBg} flex items-center justify-center p-1`}>
      <div className="w-full h-full bg-white/30 rounded-full flex items-center justify-center shadow-inner">
        {state !== 0 && (
           <span
            className={`text-4xl md:text-5xl lg:text-6xl drop-shadow-lg animate-drop ${getCounterColor()}`}
            style={{ transform: 'translateZ(0)' }} // For better animation performance
          >
            {getCounterContent()}
          </span>
        )}
      </div>
    </div>
  );
};

export default Cell;
