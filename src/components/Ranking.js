import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gameService from '../services/gameService';

function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    gameService.getRankings()
      .then(response => {
        setRankings(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading rankings:", err);
        setError("Failed to load rankings.");
        setLoading(false);
      });
  }, []);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return "";
    }
  };

  const getRankClass = (rank) => {
    switch(rank) {
      case 1: return "rank-gold";
      case 2: return "rank-silver";
      case 3: return "rank-bronze";
      default: return "";
    }
  };

  if (loading) return (
    <div className="app-container">
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">LMS</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/rankings" className="nav-link active">🏆 Rankings</Link>
          </div>
        </div>
      </nav>
      <div className="loading">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="app-container">
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">LMS</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/rankings" className="nav-link active">🏆 Rankings</Link>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="error">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Header Navigation */}
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">LMS</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/rankings" className="nav-link active">🏆 Rankings</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>🏆 Player Rankings</h1>
          <p>Check out the top wizards</p>
        </div>
        
        {rankings.length === 0 ? (
          <div className="no-data">No ranking data available.</div>
        ) : (
          <div className="ranking-list">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>View History</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((player, index) => {
                  const rank = index + 1;
                  return (
                    <tr key={player.id} className={getRankClass(rank)}>
                      <td className="rank-cell">
                        <span className="rank-number">{rank}</span>
                        <span className="rank-icon">{getRankIcon(rank)}</span>
                      </td>
                      <td className="player-name">
                        <strong>{player.username}</strong>
                      </td>
                      <td className="score">
                        <span className="score-value">{player.score}</span>
                      </td>
                      <td>
                        <Link 
                          to={`/history/${player.username}`} 
                          className="btn-detail"
                        >
                          View History
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="back-button">
          <Link to="/" className="btn">🏠 Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Rankings;