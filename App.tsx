
import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard, Player, Theme, GameMode, GamePhase, PlayerId, CellState, Difficulty } from './types';
import { THEMES } from './constants';
import { createEmptyBoard, checkWin, ROWS, COLS } from './gameLogic';
import Board from './components/Board';
import PlayerSetup from './components/PlayerSetup';
import { getAIMove } from './services/geminiService';
import WinnerModal from './components/WinnerModal';
import GameControls from './components/GameControls';

const App: React.FC = () => {
    const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
    const [board, setBoard] = useState<GameBoard>(createEmptyBoard());
    const [players, setPlayers] = useState<[Player, Player]>([
        { name: 'Player 1', counter: '🔴' },
        { name: 'Player 2', counter: '🟡' },
    ]);
    const [gameMode, setGameMode] = useState<GameMode>('PVP');
    const [currentPlayerId, setCurrentPlayerId] = useState<PlayerId>(1);
    const [winner, setWinner] = useState<Player | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[0]);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

    const handleColumnClick = useCallback((colIndex: number) => {
        if (winner || isDraw) return;

        const newBoard = board.map(row => [...row]) as GameBoard;
        let rowPlaced = -1;

        for (let r = ROWS - 1; r >= 0; r--) {
            if (newBoard[r][colIndex] === 0) {
                newBoard[r][colIndex] = currentPlayerId;
                rowPlaced = r;
                break;
            }
        }

        if (rowPlaced === -1) return; // Column is full

        setBoard(newBoard);
        
        if (checkWin(newBoard, currentPlayerId)) {
            setWinner(players[currentPlayerId - 1]);
            setGamePhase('gameOver');
        } else if (newBoard.flat().every(cell => cell !== 0)) {
            setIsDraw(true);
            setGamePhase('gameOver');
        } else {
            setCurrentPlayerId(prev => (prev === 1 ? 2 : 1));
        }
    }, [board, currentPlayerId, players, winner, isDraw]);

    const triggerAIMove = useCallback(async (currentBoard: GameBoard) => {
        setIsLoadingAI(true);
        const startTime = Date.now();

        // Wrapper to add a timeout to the getAIMove promise
        const getMoveWithTimeout = () => {
            return new Promise<number>((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('AI move timed out after 3 seconds'));
                }, 3000); // 3-second timeout

                getAIMove(currentBoard, players[1], players[0], difficulty)
                    .then(move => {
                        clearTimeout(timeoutId);
                        resolve(move);
                    })
                    .catch(err => {
                        clearTimeout(timeoutId);
                        reject(err);
                    });
            });
        };

        let aiMoveCol: number;

        try {
            aiMoveCol = await getMoveWithTimeout();
        } catch (error) {
            console.error("AI move failed or timed out:", error);
            // Fallback to a random valid move
            const validCols = Array.from({length: COLS}, (_, i) => i).filter(c => currentBoard[0][c] === 0);
            if (validCols.length > 0) {
                aiMoveCol = validCols[Math.floor(Math.random() * validCols.length)];
            } else {
                setIsLoadingAI(false); // No moves possible
                return;
            }
        }

        const endTime = Date.now();
        const duration = endTime - startTime;
        const minDelay = 1000;

        // Ensure the turn takes at least 1 second
        if (duration < minDelay) {
            await new Promise(resolve => setTimeout(resolve, minDelay - duration));
        }

        // Final check for column validity before dispatching the move
        if (aiMoveCol >= 0 && aiMoveCol < COLS && currentBoard[0][aiMoveCol] === 0) {
            handleColumnClick(aiMoveCol);
        } else {
            console.warn(`AI returned an invalid column (${aiMoveCol}). Making a random move instead.`);
            // Fallback to a random valid move if AI's choice is invalid
            const validCols = Array.from({length: COLS}, (_, i) => i).filter(c => currentBoard[0][c] === 0);
            if (validCols.length > 0) {
                 handleColumnClick(validCols[Math.floor(Math.random() * validCols.length)]);
            }
        }
        
        setIsLoadingAI(false);
    }, [handleColumnClick, players, difficulty]);


    useEffect(() => {
        if (gameMode === 'PVA' && currentPlayerId === 2 && !winner && !isDraw && gamePhase === 'playing') {
            triggerAIMove(board);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPlayerId, gameMode, winner, isDraw, board, gamePhase, triggerAIMove]);

    const handleStartGame = (newPlayers: [Player, Player], newGameMode: GameMode, newDifficulty: Difficulty, newTheme: Theme) => {
        setPlayers(newPlayers);
        setGameMode(newGameMode);
        setDifficulty(newDifficulty);
        setActiveTheme(newTheme);
        resetGame(false);
        setGamePhase('playing');
    };
    
    const resetGame = (backToSetup: boolean) => {
        setBoard(createEmptyBoard());
        setCurrentPlayerId(1);
        setWinner(null);
        setIsDraw(false);
        if (backToSetup) {
            setGamePhase('setup');
        } else {
            setGamePhase('playing');
        }
    };

    if (gamePhase === 'setup') {
        return <PlayerSetup onStartGame={handleStartGame} />;
    }

    const currentPlayer = players[currentPlayerId - 1];

    return (
        <main className={`relative min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 text-white ${activeTheme.bg}`}>
            <style>{`
                @keyframes drop {
                    0% { transform: translateY(-200px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-drop { animation: drop 0.8s ease-out forwards; }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }

                /* Fireworks Animations */
                @keyframes light-up-reveal {
                    from { opacity: 0; transform: translateY(20px) scale(0.8); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes blink {
                    0%, 100% { filter: brightness(1.1); }
                    50% { filter: brightness(0.9); }
                }
                .animate-light-up {
                    display: inline-block;
                    opacity: 0;
                    animation: light-up-reveal 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards, blink 2s ease-in-out infinite;
                }

                @keyframes firework-burst {
                    0% {
                        opacity: 1;
                        transform: scale(0.1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(1.2);
                    }
                }
                .firework {
                    position: absolute;
                    width: 250px;
                    height: 250px;
                    opacity: 0;
                    animation: firework-burst 1.2s ease-out forwards;
                    background-image: radial-gradient(circle, var(--firework-color) 3px, transparent 3px);
                    background-size: 20px 20px;
                    border-radius: 50%;
                    filter: drop-shadow(0 0 15px var(--firework-color));
                }
            `}</style>

            <GameControls 
                onRestart={() => resetGame(false)} 
                onNewGame={() => resetGame(true)}
                onThemeChange={setActiveTheme}
                activeTheme={activeTheme}
            />
            
            <div className="text-center mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">4 in a Row</h1>
                <div className={`mt-2 p-2 px-4 rounded-lg transition-all duration-300 ${isLoadingAI && currentPlayerId === 2 ? 'bg-cyan-500/80 animate-pulse' : 'bg-black/30'}`}>
                    <p className="text-lg sm:text-xl font-semibold">
                        {isLoadingAI && currentPlayerId === 2 
                            ? `${currentPlayer.name} is thinking...` 
                            : `Turn: ${currentPlayer.name} ${currentPlayer.counter}`}
                    </p>
                </div>
            </div>
            
            <div className="w-full max-w-xl lg:max-w-2xl">
                <Board 
                    board={board} 
                    players={players} 
                    theme={activeTheme}
                    onColumnClick={handleColumnClick}
                    disabled={isLoadingAI || !!winner || isDraw}
                />
            </div>

            <WinnerModal 
                winner={winner} 
                isDraw={isDraw}
                onRestart={() => resetGame(false)}
                onNewGame={() => resetGame(true)}
            />
        </main>
    );
};

export default App;