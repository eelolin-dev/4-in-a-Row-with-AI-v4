
import React from 'react';
import { GameBoard, Player, Theme } from '../types';
import Cell from './Cell';
import { COLS, ROWS } from '../gameLogic';

interface BoardProps {
  board: GameBoard;
  players: [Player, Player];
  theme: Theme;
  onColumnClick: (colIndex: number) => void;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, players, theme, onColumnClick, disabled }) => {
  return (
    <div className={`w-full p-2 sm:p-4 rounded-2xl shadow-2xl ${theme.boardBg} grid grid-cols-7 gap-1 sm:gap-2`}>
      {Array.from({ length: COLS }).map((_, colIndex) => (
        <div 
          key={colIndex} 
          className="grid gap-1 sm:gap-2"
          onClick={() => !disabled && onColumnClick(colIndex)}
        >
          {Array.from({ length: ROWS }).map((_, rowIndex) => {
            const isClickableArea = rowIndex === 0;
            return (
              <div 
                key={rowIndex} 
                className={`relative ${isClickableArea && !disabled ? 'cursor-pointer' : ''}`}
              >
                {isClickableArea && !disabled && (
                  <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 rounded-full transition-opacity duration-300"></div>
                )}
                <Cell 
                  state={board[rowIndex][colIndex]} 
                  players={players} 
                  theme={theme}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
