export type PlayerId = 1 | 2;
export type CellState = 0 | PlayerId;
export type GameBoard = CellState[][];

export interface Player {
  name: string;
  counter: string;
}

export interface Theme {
  name: string;
  bg: string;
  boardBg: string;
  cellBg: string;
  player1Counter: string;
  player2Counter: string;
}

export type GameMode = 'PVP' | 'PVA';
export type GamePhase = 'setup' | 'playing' | 'gameOver';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
