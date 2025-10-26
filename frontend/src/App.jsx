import React from 'react';
import useTicTacToe from './hooks/useTicTacToe';
import playerIcon from './assets/player.svg';
import aiIcon from './assets/ai.svg';
import ResultModal from './ResultModal';
import Stats from './Stats';

function App() {
  const { board, currentPlayer, winner, isLoading, makeMove, resetGame, stats, resetStats } = useTicTacToe();

  const renderCell = (index) => (
    <button
      className={`cell ${board[index] ? `cell-${board[index].toLowerCase()}` : ''} ${
        isLoading ? 'cell-disabled' : ''
      }`}
      onClick={() => makeMove(index)}
      disabled={board[index] !== null || winner !== null || isLoading || currentPlayer === 'O'}
    >
      {board[index] && (
        <img
          src={board[index] === 'X' ? playerIcon : aiIcon}
          alt={board[index]}
          className={`cell-icon ${board[index] === 'X' ? 'player-icon' : 'ai-icon'}`}
        />
      )}
    </button>
  );

  const getStatusMessage = () => {
    if (winner === 'Draw') return 'Game Draw!';
    if (winner) return (
      <span className="winner-message">
        Winner: <img src={winner === 'X' ? playerIcon : aiIcon} alt={winner} className="status-icon" />
      </span>
    );
    if (isLoading) return 'AI is thinking...';
    return (
      <span className="turn-message">
        Turn: <img src={currentPlayer === 'X' ? playerIcon : aiIcon} alt={currentPlayer} className="status-icon" />
      </span>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎮 Senti TicTacToe</h1>
        <div className="player-info">
          <div className="player">
            <img src={playerIcon} alt="Player" className="player-avatar" />
            <span>You</span>
          </div>
          <div className="vs">VS</div>
          <div className="player">
            <img src={aiIcon} alt="AI" className="ai-avatar" />
            <span>AI</span>
          </div>
        </div>
        <Stats stats={stats} onReset={resetStats} />
      </header>

      <main className="game-container">
        <div className="game-status">
          <h2>{getStatusMessage()}</h2>
        </div>

        <div className="game-board">
          <div className="board-row">
            {renderCell(0)}
            {renderCell(1)}
            {renderCell(2)}
          </div>
          <div className="board-row">
            {renderCell(3)}
            {renderCell(4)}
            {renderCell(5)}
          </div>
          <div className="board-row">
            {renderCell(6)}
            {renderCell(7)}
            {renderCell(8)}
          </div>
        </div>
      </main>

      <div className="game-controls">
        <button className="reset-button" onClick={resetGame}>
          🔄 Play Again
        </button>
      </div>

      <ResultModal 
        isOpen={winner !== null} 
        winner={winner} 
        onClose={resetGame}
      />

      <footer className="app-footer">
        Created by <a href="https://x.com/rawakinode" target="_blank" rel="noopener noreferrer">Rawakinode</a> | <a href="https://github.com/rawakinode/sentictactoe-game" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </div>
  )
}

export default App
