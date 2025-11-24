

import { Theme } from './types';

export const COUNTER_OPTIONS = [
    // Standard Circles
    '🔴', '🟡', '🔵', '🟢', '🟣', '🟠',
    // Shapes
    '🟥', '🟨', '⭐', '💎', '✨', '💠',
    // Fun Icons
    '🤖', '👑', '🚀', '🦊', '🐼', '🐙',
    // Seasonal
    '🎃', '👻', '❄️', '☀️', '🍁', '🌸', '🎄', '🎅', '🎁', '🦌', '🐰', '🥚', '🐣', '🥕', '🌷', '🦋', '🐞', '🍂', '🍄', '🐿️'
];

export const THEMES: Theme[] = [
  {
    name: 'Classic',
    bg: 'bg-gradient-to-br from-blue-500 to-blue-700',
    boardBg: 'bg-blue-800/80 backdrop-blur-sm',
    cellBg: 'bg-blue-400',
    player1Counter: 'text-red-500',
    player2Counter: 'text-yellow-400',
  },
  {
    name: 'Winter',
    bg: 'bg-gradient-to-b from-sky-300 via-slate-100 to-white',
    boardBg: 'bg-sky-500/70 backdrop-blur-sm',
    cellBg: 'bg-sky-200',
    player1Counter: 'text-white',
    player2Counter: 'text-blue-200',
  },
  {
    name: 'Spring',
    bg: 'bg-gradient-to-b from-sky-400 to-green-400',
    boardBg: 'bg-green-400/70 backdrop-blur-sm',
    cellBg: 'bg-green-200',
    player1Counter: 'text-pink-500',
    player2Counter: 'text-purple-500',
  },
  {
    name: 'Summer',
    bg: 'bg-gradient-to-b from-sky-400 via-yellow-200 to-orange-400',
    boardBg: 'bg-yellow-400/70 backdrop-blur-sm',
    cellBg: 'bg-yellow-100',
    player1Counter: 'text-red-500',
    player2Counter: 'text-sky-500',
  },
  {
    name: 'Autumn',
    bg: 'bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500',
    boardBg: 'bg-amber-800/80 backdrop-blur-sm',
    cellBg: 'bg-orange-300',
    player1Counter: 'text-red-700',
    player2Counter: 'text-yellow-500',
  },
  {
    name: 'Halloween',
    bg: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-orange-800',
    boardBg: 'bg-gray-900/80 backdrop-blur-sm',
    cellBg: 'bg-gray-700',
    player1Counter: 'text-orange-500',
    player2Counter: 'text-purple-500',
  },
  {
    name: 'Christmas',
    bg: 'bg-gradient-to-b from-gray-900 via-blue-900 to-slate-200',
    boardBg: 'bg-green-950/70 backdrop-blur-sm',
    cellBg: 'bg-slate-300',
    player1Counter: 'text-red-500',
    player2Counter: 'text-green-400',
  },
  {
    name: 'Easter',
    bg: 'bg-gradient-to-b from-sky-200 via-pink-200 to-green-200',
    boardBg: 'bg-purple-400/70 backdrop-blur-sm',
    cellBg: 'bg-pink-200',
    player1Counter: 'text-yellow-400',
    player2Counter: 'text-sky-400',
  },
];