import React from 'react';
import './ResultModal.css';
import playerIcon from './assets/player.svg';
import aiIcon from './assets/ai.svg';

const ResultModal = ({ isOpen, winner, onPlayAgain }) => {
  if (!isOpen) return null;

  const isWin = winner === 'X';
  const isDraw = winner === 'Draw';

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {!isDraw && (
          <>
            <div className={isWin ? 'win' : 'lose'}>
              <img 
                src={isWin ? playerIcon : aiIcon} 
                alt={isWin ? 'Victory' : 'Defeat'} 
                className="result-icon"
              />
              <h2 className="modal-title">
                {isWin ? 'You Win!' : 'You Lose!'}
              </h2>
            </div>
            {isWin && (
              <>
                <div className="confetti c1"></div>
                <div className="confetti c2"></div>
                <div className="confetti c3"></div>
                <div className="confetti c4"></div>
                <div className="confetti c5"></div>
              </>
            )}
          </>
        )}
        {isDraw && (
          <div>
            <h2 className="modal-title">Draw!</h2>
            <p className="modal-message">Great game! Both players played well.</p>
          </div>
        )}
        <button onClick={onPlayAgain} className="play-again-btn">Play Again</button>
      </div>
    </div>
  );
};

export default ResultModal;