const axios = require('axios');

class FireworksAIService {
  constructor() {
    this.apiKey = process.env.FIREWORKS_API_KEY || '';
    this.baseURL = 'https://api.fireworks.ai/inference/v1';
    this.model = process.env.FIREWORKS_MODEL || 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new';
    this.moveCache = new Map();
  }

  async getAIMove(gameState) {
    try {
      // Check cache first
      const cacheKey = this.createCacheKey(gameState.board);
      if (this.moveCache.has(cacheKey)) {
        console.log('Cache hit for board state');
        return this.moveCache.get(cacheKey);
      }

      // Check for immediate winning move
      const winningMove = this.findWinningMoves(gameState.board, 'O')[0];
      if (winningMove !== undefined) {
        console.log('Found winning move:', winningMove);
        this.moveCache.set(cacheKey, winningMove);
        return winningMove;
      }

      // Check for immediate blocking move
      const blockingMove = this.findWinningMoves(gameState.board, 'X')[0];
      if (blockingMove !== undefined) {
        console.log('Found blocking move:', blockingMove);
        this.moveCache.set(cacheKey, blockingMove);
        return blockingMove;
      }

      const prompt = this.createGamePrompt(gameState);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: [{ 
          role: 'system',
          content: 'You are a Tic-Tac-Toe AI grandmaster focused on optimal play. Analyze positions deeply and choose the best strategic move.'
        }, {
          role: 'user',
          content: prompt
        }],
        max_tokens: 50,
        temperature: 0.2,  // Slightly increased for strategic variety while maintaining strength
        top_p: 0.9,       // High value for focused but not completely deterministic responses
        frequency_penalty: 0.5  // Encourage diverse play in similar positions
      }, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const content = response.data?.choices?.[0]?.message?.content || response.data?.message || '';
      const move = this.parseAIResponse(String(content));

      // Validate and cache the move if it's legal
      if (this.isValidMove(move, gameState.board)) {
        this.moveCache.set(cacheKey, move);
        return move;
      }

      // If move is invalid, use strategic fallback
      const fallbackMove = this.getStrategicFallbackMove(gameState.board);
      this.moveCache.set(cacheKey, fallbackMove);
      return fallbackMove;

    } catch (error) {
      console.error('Fireworks AI Error:', error.response?.data || error.message || error);
      // Use strategic fallback on error
      const fallbackMove = this.getStrategicFallbackMove(gameState.board);
      return fallbackMove;
    }
  }

  createCacheKey(board) {
    return board.map(cell => cell === null ? '-' : cell).join('');
  }

  isValidMove(move, board) {
    return typeof move === 'number' && 
           move >= 0 && 
           move <= 8 && 
           board[move] === null;
  }

  getStrategicFallbackMove(board) {
    // Priority order: center, corners, edges
    const center = 4;
    const corners = [0, 2, 6, 8];
    const edges = [1, 3, 5, 7];

    // Try center first
    if (board[center] === null) return center;

    // Try corners
    const availableCorners = corners.filter(pos => board[pos] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Try edges
    const availableEdges = edges.filter(pos => board[pos] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    // If somehow nothing else works, find first empty space
    return board.findIndex(cell => cell === null);
  }

  createGamePrompt(gameState) {
    const { board, currentPlayer, moveHistory } = gameState;
    const availableMoves = board.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null);
    const moveCount = board.filter(cell => cell !== null).length;
    const corners = [0, 2, 6, 8];
    const center = 4;
    const edges = [1, 3, 5, 7];
    
    // Analyze current board state
    const boardAnalysis = this.analyzeBoardState(board);
    
    return `You are a Tic-Tac-Toe grandmaster AI. Analyze the current position and choose the optimal move.

    GAME STATE:
    ${this.formatBoard(board)}

    POSITION ANALYSIS:
    - Current Player: ${currentPlayer}
    - Move Number: ${moveCount + 1}
    - Available Moves: ${availableMoves.join(', ')}
    - Corner Spaces Available: ${corners.filter(c => board[c] === null).join(', ')}
    - Center Available: ${board[center] === null ? 'Yes' : 'No'}
    - Edge Spaces Available: ${edges.filter(e => board[e] === null).join(', ')}
    ${boardAnalysis}

    MOVE HISTORY:
    ${moveHistory.map((m, i) => `${i + 1}. Player ${m.player} → Position ${m.position}`).join('\n')}

    STRATEGIC CONSIDERATIONS:
    1. Control the center and corners when possible
    2. Block opponent's winning moves
    3. Create fork opportunities
    4. Prevent opponent's forks
    5. Look for winning lines

    RESPONSE FORMAT:
    Respond ONLY with "MOVE:X" where X is the chosen position (0-8). Example: "MOVE:4" for center.`;
  }

  analyzeBoardState(board) {
    let analysis = [];
    
    // Check for winning opportunities
    const winningMoves = this.findWinningMoves(board, 'O');
    if (winningMoves.length > 0) {
      analysis.push(`- Winning moves available: ${winningMoves.join(', ')}`);
    }

    // Check for blocking needs
    const blockingMoves = this.findWinningMoves(board, 'X');
    if (blockingMoves.length > 0) {
      analysis.push(`- Must block positions: ${blockingMoves.join(', ')}`);
    }

    // Check for fork opportunities
    const forkMoves = this.findForkMoves(board, 'O');
    if (forkMoves.length > 0) {
      analysis.push(`- Fork opportunities: ${forkMoves.join(', ')}`);
    }

    // Check for opponent's fork threats
    const opponentForks = this.findForkMoves(board, 'X');
    if (opponentForks.length > 0) {
      analysis.push(`- Prevent opponent forks: ${opponentForks.join(', ')}`);
    }

    return analysis.length > 0 ? analysis.join('\n') : '- No immediate threats or opportunities';
  }

  findWinningMoves(board, player) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    const winningMoves = [];
    for (const line of lines) {
      const [a, b, c] = line;
      const cells = [board[a], board[b], board[c]];
      const playerCount = cells.filter(cell => cell === player).length;
      const nullCount = cells.filter(cell => cell === null).length;

      if (playerCount === 2 && nullCount === 1) {
        const moveIndex = line[cells.findIndex(cell => cell === null)];
        winningMoves.push(moveIndex);
      }
    }
    return [...new Set(winningMoves)];
  }

  findForkMoves(board, player) {
    const forkMoves = [];
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      
      // Try move
      const testBoard = [...board];
      testBoard[i] = player;
      
      // Count potential winning lines after this move
      const winningLines = this.countPotentialWinningLines(testBoard, player);
      if (winningLines >= 2) {
        forkMoves.push(i);
      }
    }
    return forkMoves;
  }

  countPotentialWinningLines(board, player) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    return lines.filter(line => {
      const [a, b, c] = line;
      const cells = [board[a], board[b], board[c]];
      const playerCells = cells.filter(cell => cell === player).length;
      const emptyCells = cells.filter(cell => cell === null).length;
      return playerCells === 2 && emptyCells === 1;
    }).length;
  }

  formatBoard(board) {
    let formatted = '';
    for (let i = 0; i < 9; i += 3) {
      formatted += `${board[i] ?? i} | ${board[i+1] ?? i+1} | ${board[i+2] ?? i+2}\n`;
      if (i < 6) formatted += '---------\n';
    }
    return formatted;
  }

  parseAIResponse(response) {
    const moveMatch = response.match(/MOVE:\s*(\d)/i);
    if (moveMatch) {
      return parseInt(moveMatch[1], 10);
    }
    // Fallback: find a single digit 0-8
    const numberMatch = response.match(/\b[0-8]\b/);
    if (numberMatch) return parseInt(numberMatch[0], 10);
    return this.getRandomMove();
  }

  getRandomMove() {
    return Math.floor(Math.random() * 9);
  }
}

module.exports = FireworksAIService;
