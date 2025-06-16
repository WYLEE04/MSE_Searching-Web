import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import gameService from '../services/gameService';

function GameHistory() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    gameService.getPlayerHistory(username)
      .then(response => {
        setGames(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading game history:", err);
        setError("Failed to load game history.");
        setLoading(false);
      });
  }, [username]);

  if (loading) return (
    <div className="app-container">
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">LMS</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/rankings" className="nav-link">🏆 Rankings</Link>
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
            <Link to="/rankings" className="nav-link">🏆 Rankings</Link>
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
            <Link to="/rankings" className="nav-link">🏆 Rankings</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>⚔️ {username}'s Match History</h1>
          <p>Check out the wizard's journey</p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to={`/stats/${username}`} className="btn stats-btn">📊 View Statistics</Link>
        </div>
        
        {games.length === 0 ? (
          <div className="no-data">No match history available.</div>
        ) : (
          <div className="game-list">
            <table>
              <thead>
                <tr>
                  <th>Game ID</th>
                  <th>Opponent</th>
                  <th>Result</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {games.map(game => (
                  <tr key={game.id}>
                    <td>#{game.id}</td>
                    <td>
                      <strong>
                        {game.player1.username === username 
                          ? game.player2.username 
                          : game.player1.username}
                      </strong>
                    </td>
                    <td>
                      {game.finished ? (
                        game.winner && game.winner.username === username ? 
                          <span className="win">✅ Victory</span> : 
                          <span className="lose">❌ Defeat</span>
                      ) : (
                        <span className="ongoing">⏳ In Progress</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/game/${game.id}`} className="btn-detail">
                        📊 View Details
                      </Link>
                    </td>
                  </tr>
                ))}
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

export default GameHistory;