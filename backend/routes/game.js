const express = require('express');
const router = express.Router();
const FireworksAIService = require('../services/FireworksAIService');

const fireworksService = new FireworksAIService();

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

    let aiMove = null;
    
    try {
      aiMove = await fireworksService.getAIMove(gameState);
      
      // Validate move
      const isValid = (typeof aiMove === 'number') && aiMove >= 0 && aiMove <= 8 && board[aiMove] === null;
      
      if (!isValid) {
        // If move is invalid, use strategic fallback from FireworksAIService
        aiMove = fireworksService.getStrategicFallbackMove(board);
      }
    } catch (err) {
      console.error('Fireworks error:', err.message || err);
      // Use strategic fallback on error
      aiMove = fireworksService.getStrategicFallbackMove(board);
    }

    // Final safety: if still invalid, pick first available
    if (typeof aiMove !== 'number' || aiMove < 0 || aiMove > 8 || board[aiMove] !== null) {
      const validMoves = board.map((cell, index) => cell === null ? index : -1).filter(i => i !== -1);
      aiMove = validMoves.length > 0 ? validMoves[0] : Math.floor(Math.random() * 9);
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
