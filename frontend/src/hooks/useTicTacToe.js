import { useState, useEffect } from 'react';

const useTicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('tictactoeStats');
    return savedStats ? JSON.parse(savedStats) : {
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      winRate: '0%'
    };
  });

  useEffect(() => {
    const savedGame = localStorage.getItem('sentiTicTacToe');
    if (savedGame) {
      try {
        const { board: savedBoard, currentPlayer: savedPlayer, moveHistory: savedHistory } = JSON.parse(savedGame);
        setBoard(savedBoard);
        setCurrentPlayer(savedPlayer);
        setMoveHistory(savedHistory);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const gameState = { board, currentPlayer, moveHistory };
    localStorage.setItem('sentiTicTacToe', JSON.stringify(gameState));
  }, [board, currentPlayer, moveHistory]);

  // Update stats when game ends
  useEffect(() => {
    if (winner) {
      const newStats = { ...stats };
      newStats.totalGames++;
      
      if (winner === 'X') {
        newStats.wins++;
      } else if (winner === 'O') {
        newStats.losses++;
      } else if (winner === 'Draw') {
        newStats.draws++;
      }
      
      newStats.winRate = ((newStats.wins / newStats.totalGames) * 100).toFixed(1) + '%';
      
      setStats(newStats);
      localStorage.setItem('tictactoeStats', JSON.stringify(newStats));
    }
  }, [winner]);

  const checkWinner = (boardState) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let [a, b, c] of lines) {
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    return boardState.includes(null) ? null : 'Draw';
  };

  const makeMove = async (index) => {
    if (board[index] || winner || isLoading || currentPlayer === 'O') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    const newMoveHistory = [...moveHistory, { player: currentPlayer, position: index }];

    setBoard(newBoard);
    setMoveHistory(newMoveHistory);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    setCurrentPlayer('O');
    setIsLoading(true);

    try {
      const aiResponse = await fetch('http://localhost:3001/api/ai-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: newBoard, currentPlayer: 'O', moveHistory: newMoveHistory })
      });

      const aiData = await aiResponse.json();

      if (aiData.move !== undefined) {
        const finalBoard = [...newBoard];
        finalBoard[aiData.move] = 'O';

        setBoard(finalBoard);
        setMoveHistory([...newMoveHistory, { player: 'O', position: aiData.move }]);

        const aiWinner = checkWinner(finalBoard);
        if (aiWinner) {
          setWinner(aiWinner);
        } else {
          setCurrentPlayer('X');
        }
      }
    } catch (error) {
      console.error('Error getting AI move:', error);
      const emptyIndices = newBoard.map((cell, idx) => cell === null ? idx : -1).filter(idx => idx !== -1);
      if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const finalBoard = [...newBoard];
        finalBoard[randomIndex] = 'O';

        setBoard(finalBoard);
        setMoveHistory([...newMoveHistory, { player: 'O', position: randomIndex }]);

        const aiWinner = checkWinner(finalBoard);
        setCurrentPlayer('X');
        if (aiWinner) setWinner(aiWinner);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setMoveHistory([]);
    localStorage.removeItem('sentiTicTacToe');
  };

  const resetStats = () => {
    const newStats = {
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      winRate: '0%'
    };
    setStats(newStats);
    localStorage.setItem('tictactoeStats', JSON.stringify(newStats));
  };

  return { 
    board, 
    currentPlayer, 
    winner, 
    isLoading, 
    moveHistory, 
    makeMove, 
    resetGame,
    stats,
    resetStats 
  };
};

export default useTicTacToe;
