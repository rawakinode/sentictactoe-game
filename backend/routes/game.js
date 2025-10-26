const express = require('express');
const router = express.Router();
const FireworksAIService = require('../services/FireworksAIService');
const MinimaxAIService = require('../services/MinimaxAIService');

const fireworksService = new FireworksAIService();
const minimaxService = new MinimaxAIService();

router.post('/ai-move', async (req, res) => {
  try {
    const { board, currentPlayer, moveHistory } = req.body;

    if (!Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({ error: 'Board harus array dengan 9 elemen' });
    }

    const gameState = {
      board,
      currentPlayer: currentPlayer || 'O',
      moveHistory: moveHistory || []
    };

    // Decide strategy: try Fireworks if enabled and key present, else use Minimax
    const useFireworks = (process.env.USE_FIREWORKS === 'true') && !!process.env.FIREWORKS_API_KEY;
    let aiMove = null;

    if (useFireworks) {
      try {
        const fwMove = await fireworksService.getAIMove(gameState);

        // validate move
        const validMoves = board.map((cell, index) => cell === null ? index : -1).filter(i => i !== -1);
        const minimaxBest = minimaxService.getBestMove(gameState, 'O');

        const isValid = (typeof fwMove === 'number') && fwMove >= 0 && fwMove <= 8 && board[fwMove] === null;

        if (!isValid) {
          aiMove = minimaxBest.move;
        } else {
          // evaluate fwMove by simulating and using minimax score — prefer minimax if fw move is worse
          const boardAfterFW = board.slice();
          boardAfterFW[fwMove] = 'O';
          const fwScore = minimaxService.minimax(boardAfterFW, 'X', 'O').score;
          const bestScore = minimaxBest.score;

          // If fireworks chooses a move with lower minimax score than the best, pick minimax's move
          if (fwScore < bestScore) {
            aiMove = minimaxBest.move;
          } else {
            aiMove = fwMove;
          }
        }
      } catch (err) {
        console.error('Fireworks failed, falling back to Minimax:', err.message || err);
        aiMove = minimaxService.getBestMove(gameState, 'O').move;
      }
    } else {
      // Fireworks disabled or no key -> use minimax for perfect play
      aiMove = minimaxService.getBestMove(gameState, 'O').move;
    }

    // Final safety: if still invalid, pick first available
    if (typeof aiMove !== 'number' || aiMove < 0 || aiMove > 8 || board[aiMove] !== null) {
      const validMoves = board.map((cell, index) => cell === null ? index : -1).filter(i => i !== -1);
      aiMove = validMoves.length > 0 ? validMoves[0] : minimaxService.getRandomMove(board);
    }

    res.json({ move: aiMove, player: 'O', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error processing AI move:', error);
    res.status(500).json({ error: 'Internal server error', fallback: true });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Senti TicTacToe AI' });
});

module.exports = router;
