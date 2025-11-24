import { GoogleGenAI, Type } from "@google/genai";
import { GameBoard, Player, Difficulty, PlayerId } from '../types';
import { checkWin, ROWS, COLS } from "../gameLogic";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getRandomValidColumn = (board: GameBoard): number => {
    const validColumns = [];
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === 0) {
        validColumns.push(c);
      }
    }
    if (validColumns.length > 0) {
      return validColumns[Math.floor(Math.random() * validColumns.length)];
    }
    return 0; // Fallback, should not happen in a normal game
}

/**
 * Checks for immediate winning or blocking moves.
 * @returns The column for the critical move, or null if none is found.
 */
const findCriticalMove = (board: GameBoard): number | null => {
    const wouldWin = (player: PlayerId): number | null => {
        for (let c = 0; c < COLS; c++) {
            if (board[0][c] === 0) { // If column is playable
                const tempBoard = board.map(r => [...r]) as GameBoard;
                for (let r = ROWS - 1; r >= 0; r--) {
                    if (tempBoard[r][c] === 0) {
                        tempBoard[r][c] = player;
                        if (checkWin(tempBoard, player)) {
                            return c;
                        }
                        break;
                    }
                }
            }
        }
        return null;
    }

    // 1. Can AI win?
    const winningMove = wouldWin(2);
    if (winningMove !== null) return winningMove;

    // 2. Can player win? (Block them)
    const blockingMove = wouldWin(1);
    if (blockingMove !== null) return blockingMove;

    return null;
}


export const getAIMove = async (board: GameBoard, aiPlayer: Player, humanPlayer: Player, difficulty: Difficulty): Promise<number> => {
  const boardString = board.map(row => 
    row.map(cell => {
      if (cell === 1) return 1; // Human
      if (cell === 2) return 2; // AI
      return 0; // Empty
    }).join(',')
  ).join('\n');

  // For Medium and Hard, first check for critical moves locally for instant response.
  if (difficulty === 'Medium' || difficulty === 'Hard') {
    const criticalMove = findCriticalMove(board);
    if (criticalMove !== null) {
        return criticalMove;
    }
  }

  let prompt = '';
  let model = 'gemini-2.5-flash';
  let temperature = 0.9;
  let config: any = {}; // Use 'any' for flexible config object

  switch (difficulty) {
    case 'Easy':
      if (Math.random() < 0.5) {
        return getRandomValidColumn(board);
      }
      prompt = `
        You are playing 4 in a Row. You are playing just for fun.
        The board is 6 rows and 7 columns. 0 is empty, 1 is the other player, and 2 is you.
        Here is the board:
        ${boardString}
        It's your turn! Pick any column to drop your piece in (from 0 to 6) that is not full.
        Respond with ONLY a JSON object with your choice, like this: {"column": <number>}.
      `;
      temperature = 1.0;
      config.thinkingConfig = { thinkingBudget: 0 };
      break;
    
    case 'Medium':
      prompt = `
        You are playing 4 in a Row. Your goal is to win, but you should play quickly.
        The board is 6x7. 0 is empty, 1 is the opponent, 2 is you.
        You have already checked for any immediate win or lose moves.
        Board state:
        ${boardString}
        It's your turn. Pick a valid, non-full column (0-6) that seems like a good move.
        Respond with ONLY a JSON object: {"column": <number>}.
      `;
      temperature = 0.9;
      config.thinkingConfig = { thinkingBudget: 0 };
      break;

    case 'Hard':
      model = 'gemini-2.5-flash';
      temperature = 0.5;
      prompt = `
        You are an expert 4 in a Row AI. Your goal is to win quickly and efficiently.
        The board is 6 rows by 7 columns. 0 is empty, 1 is the human, and 2 is you (AI). Top row is 0.
        Current board:
        ${boardString}
        
        You've already checked for immediate win/loss moves. They don't exist.
        Now, make a strategic move to set up a future win. Center columns (2, 3, 4) are generally strong.
        Choose the best column (0-6). The column must not be full.

        Respond with ONLY a JSON object with your column choice: {"column": <number>}.
      `;
      // Forcing a fast response by disabling thinking budget.
      config.thinkingConfig = { thinkingBudget: 0 };
      break;
  }


  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            column: { type: Type.INTEGER }
          }
        },
        temperature: temperature,
        ...config,
      },
    });
    
    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    
    if (typeof result.column === 'number' && result.column >= 0 && result.column < COLS) {
      if (board[0][result.column] === 0) {
        return result.column;
      }
    }
    throw new Error("Invalid column from AI");
  } catch (error) {
    console.error(`Error getting AI move for difficulty ${difficulty}:`, error);
    return getRandomValidColumn(board);
  }
};