import React from 'react';
import './Stats.css';

const Stats = ({ stats, onReset }) => {
  return (
    <div className="stats-container">
      <div className="stat-box">
        <div className="stat-value">{stats.wins}</div>
        <div className="stat-label">Wins</div>
      </div>
      <div className="stat-box">
        <div className="stat-value">{stats.losses}</div>
        <div className="stat-label">Losses</div>
      </div>
      <div className="stat-box">
        <div className="stat-value">{stats.draws}</div>
        <div className="stat-label">Draws</div>
      </div>
      <div className="stat-box">
        <div className="stat-value win-rate">{stats.winRate}</div>
        <div className="stat-label">Win Rate</div>
      </div>
      <button className="reset-stats-button" onClick={onReset}>
        🔄
      </button>
    </div>
  );
};

export default Stats;