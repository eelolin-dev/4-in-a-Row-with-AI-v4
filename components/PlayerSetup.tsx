import React, { useState, useEffect } from 'react';
import { GameMode, Player, Difficulty, Theme } from '../types';
import { COUNTER_OPTIONS, THEMES } from '../constants';

interface PlayerSetupProps {
  onStartGame: (players: [Player, Player], gameMode: GameMode, difficulty: Difficulty, theme: Theme) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame }) => {
  const [gameMode, setGameMode] = useState<GameMode>('PVP');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [player1, setPlayer1] = useState<Player>({ name: 'Player 1', counter: '🔴' });
  const [player2, setPlayer2] = useState<Player>({ name: 'Player 2', counter: '🟡' });
  const [player2NameCache, setPlayer2NameCache] = useState('Player 2');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);

  useEffect(() => {
    if (gameMode === 'PVA') {
      // When switching to AI mode, cache the current P2 name if it's not the AI's name.
      if (player2.name !== 'Gemini AI') {
        setPlayer2NameCache(player2.name);
      }
      setPlayer2(p => ({ ...p, name: 'Gemini AI' }));
    } else {
      // When switching back to PVP, restore the cached name.
      setPlayer2(p => ({ ...p, name: player2NameCache }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameMode]);


  const handlePlayer2NameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setPlayer2(p => ({ ...p, name: newName }));
    if (gameMode === 'PVP') {
      setPlayer2NameCache(newName);
    }
  };

  const handleStart = () => {
    if (player1.name.trim() === '' || (gameMode === 'PVP' && player2.name.trim() === '')) {
        alert('Player names cannot be empty!');
        return;
    }
    if (player1.counter === player2.counter) {
        alert('Players must have different counters!');
        return;
    }
    onStartGame([player1, player2], gameMode, difficulty, selectedTheme);
  };
  
  const CounterSelector: React.FC<{ value: string, onChange: (counter: string) => void }> = ({ value, onChange }) => (
    <div className="grid grid-cols-6 gap-2 mt-2">
      {COUNTER_OPTIONS.map(c => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`text-3xl rounded-full aspect-square flex items-center justify-center transition-all ${value === c ? 'ring-4 ring-white/80 scale-110' : 'hover:bg-white/20'}`}
        >
          {c}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-slate-900 p-4">
      <div className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 text-white">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">4 in a Row</h1>
        <p className="text-center text-slate-300 mb-8">with a Gemini AI opponent</p>

        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-center">Game Mode</h2>
            <div className="flex justify-center gap-4 bg-slate-900/50 p-2 rounded-xl">
                <button onClick={() => setGameMode('PVP')} className={`px-6 py-2 rounded-lg font-medium transition-colors w-1/2 ${gameMode === 'PVP' ? 'bg-purple-600' : 'bg-transparent hover:bg-white/10'}`}>Player vs Player</button>
                <button onClick={() => setGameMode('PVA')} className={`px-6 py-2 rounded-lg font-medium transition-colors w-1/2 ${gameMode === 'PVA' ? 'bg-purple-600' : 'bg-transparent hover:bg-white/10'}`}>Player vs AI</button>
            </div>
        </div>

        {gameMode === 'PVA' && (
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-center">AI Difficulty</h2>
                <div className="flex justify-center gap-4 bg-slate-900/50 p-2 rounded-xl">
                    <button onClick={() => setDifficulty('Easy')} className={`px-6 py-2 rounded-lg font-medium transition-colors w-1/3 ${difficulty === 'Easy' ? 'bg-green-600' : 'bg-transparent hover:bg-white/10'}`}>Easy</button>
                    <button onClick={() => setDifficulty('Medium')} className={`px-6 py-2 rounded-lg font-medium transition-colors w-1/3 ${difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-transparent hover:bg-white/10'}`}>Medium</button>
                    <button onClick={() => setDifficulty('Hard')} className={`px-6 py-2 rounded-lg font-medium transition-colors w-1/3 ${difficulty === 'Hard' ? 'bg-red-600' : 'bg-transparent hover:bg-white/10'}`}>Hard</button>
                </div>
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Player 1 Setup */}
          <div className="bg-slate-900/50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-purple-400 mb-4">Player 1</h3>
            <label className="block mb-4">
              <span className="text-slate-300">Name</span>
              <input type="text" value={player1.name} onChange={(e) => setPlayer1(p => ({ ...p, name: e.target.value }))} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
            </label>
            <div>
              <span className="text-slate-300">Counter</span>
              <CounterSelector value={player1.counter} onChange={(c) => setPlayer1(p => ({...p, counter: c}))}/>
            </div>
          </div>

          {/* Player 2 / AI Setup */}
          <div className="bg-slate-900/50 p-6 rounded-xl">
            <h3 className={`text-lg font-bold mb-4 ${gameMode === 'PVP' ? 'text-pink-500' : 'text-cyan-400'}`}>{gameMode === 'PVP' ? 'Player 2' : 'AI Opponent'}</h3>
            <label className="block mb-4">
              <span className="text-slate-300">Name</span>
              <input type="text" value={player2.name} onChange={handlePlayer2NameChange} disabled={gameMode === 'PVA'} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md px-3 py-2 disabled:opacity-50" />
            </label>
            <div>
              <span className="text-slate-300">Counter</span>
              <CounterSelector value={player2.counter} onChange={(c) => setPlayer2(p => ({...p, counter: c}))}/>
            </div>
          </div>
        </div>

        <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-center">Choose Your Theme</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {THEMES.map(theme => (
                    <button
                        key={theme.name}
                        onClick={() => setSelectedTheme(theme)}
                        className={`p-2 rounded-lg text-center transition-all duration-200 ${selectedTheme.name === theme.name ? 'ring-4 ring-white/80 scale-105' : 'hover:scale-105 hover:ring-2 hover:ring-white/40'}`}
                    >
                        <div className={`w-full h-12 rounded-md ${theme.bg} shadow-inner`}></div>
                        <span className="block mt-2 text-sm font-medium">{theme.name}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="text-center">
            <button onClick={handleStart} className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-xl font-bold hover:scale-105 transition-transform shadow-lg">
                Start Game
            </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetup;
