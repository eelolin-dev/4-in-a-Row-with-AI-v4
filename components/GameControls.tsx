
import React, { useState } from 'react';
import { THEMES } from '../constants';
import { Theme } from '../types';

interface GameControlsProps {
  onRestart: () => void;
  onNewGame: () => void;
  onThemeChange: (theme: Theme) => void;
  activeTheme: Theme;
}

const GameControls: React.FC<GameControlsProps> = ({ onRestart, onNewGame, onThemeChange, activeTheme }) => {
  const [showThemes, setShowThemes] = useState(false);
  
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-20">
      <div className="relative">
        <button
          onClick={() => setShowThemes(!showThemes)}
          className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg font-semibold hover:bg-white/30 transition-colors"
        >
          Theme
        </button>
        {showThemes && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-lg rounded-lg shadow-2xl p-2 animate-fade-in">
            {THEMES.map(theme => (
              <button
                key={theme.name}
                onClick={() => {
                  onThemeChange(theme);
                  setShowThemes(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeTheme.name === theme.name ? 'bg-purple-600' : 'hover:bg-white/10'}`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg font-semibold hover:bg-white/30 transition-colors"
      >
        Restart
      </button>
      <button
        onClick={onNewGame}
        className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg font-semibold hover:bg-white/30 transition-colors"
      >
        New Game
      </button>
    </div>
  );
};

export default GameControls;
