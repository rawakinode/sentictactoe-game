class MinimaxAIService {
  constructor() {
    this.lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
  }

  getBestMove(gameState, aiPlayer = 'O') {
    const board = gameState.board.slice();
    const human = aiPlayer === 'O' ? 'X' : 'O';

    const available = board.map((c,i) => c === null ? i : -1).filter(i => i !== -1);
    if (available.length === 0) return { move: this.getRandomMove(board), score: 0 };

    const best = this.minimax(board, aiPlayer, aiPlayer);
    return { move: best.index, score: best.score };
  }

  minimax(board, player, aiPlayer) {
    const winner = this.checkWinner(board);
    if (winner === aiPlayer) return { score: 1 };
    if (winner && winner !== 'Draw') return { score: -1 };
    if (winner === 'Draw') return { score: 0 };

    const avail = board.map((c,i) => c === null ? i : -1).filter(i => i !== -1);
    const moves = [];

    for (let i of avail) {
      const newBoard = board.slice();
      newBoard[i] = player;

      const result = this.minimax(newBoard, player === 'X' ? 'O' : 'X', aiPlayer);
      moves.push({ index: i, score: result.score });
    }

    let bestMove = null;
    if (player === aiPlayer) {
      // maximize
      let bestScore = -Infinity;
      for (const m of moves) if (m.score > bestScore) { bestScore = m.score; bestMove = m; }
    } else {
      // minimize
      let bestScore = Infinity;
      for (const m of moves) if (m.score < bestScore) { bestScore = m.score; bestMove = m; }
    }

    return bestMove || { index: avail[0], score: 0 };
  }

  checkWinner(board) {
    for (const [a,b,c] of this.lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.includes(null) ? null : 'Draw';
  }

  getRandomMove(board) {
    const empty = board.map((c,i) => c === null ? i : -1).filter(i => i !== -1);
    return empty.length ? empty[Math.floor(Math.random()*empty.length)] : 0;
  }
}

module.exports = MinimaxAIService;
