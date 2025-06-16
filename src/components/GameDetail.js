import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import gameService from '../services/gameService';

function GameDetail() {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { gameId } = useParams();

  useEffect(() => {
    gameService.getGameReplay(gameId)
      .then(response => {
        setRounds(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load game details:", err);
        setError("Failed to load game details.");
        setLoading(false);
      });
  }, [gameId]);

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
  
  if (rounds.length === 0) return (
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
        <div className="no-data">No round information available.</div>
      </div>
    </div>
  );

  // Faction and Character name mapping functions
  const getFactionName = (faction) => {
    const factionMap = {
      'MAGOS': 'Magos',
      'VERTA': 'Verta',
      'MONSTER': 'Monster'
    };
    return factionMap[faction] || faction;
  };

  const getCharacterName = (character) => {
    const characterMap = {
      'KIM': 'Kim',
      'HYTTY': 'Hytty',
      'SLIME': 'Slime'
    };
    return characterMap[character] || character;
  };

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
          <h1>🎮 Game #{gameId} Details</h1>
          <p>Players: {rounds[0].game.player1.username} vs {rounds[0].game.player2.username}</p>
        </div>
        
        <div className="game-details">
          <div className="rounds">
            {rounds.map((round, index) => (
              <div key={round.id} className="round-card">
                <h3>Round {round.roundNo}</h3>
                <div className="round-winner">
                  Winner: <strong>{round.roundWinner.username}</strong>
                </div>
                
                <div className="players-info">
                  <div className="player">
                    <h4>{round.game.player1.username}</h4>
                    <p>Faction: {getFactionName(round.p1Faction)}</p>
                    <p>Character: {getCharacterName(round.p1Character)}</p>
                    <h5>Cards Used:</h5>
                    <ul>
                      {round.p1Cards.map(card => (
                        <li key={card.id}>{card.name}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="player">
                    <h4>{round.game.player2.username}</h4>
                    <p>Faction: {getFactionName(round.p2Faction)}</p>
                    <p>Character: {getCharacterName(round.p2Character)}</p>
                    <h5>Cards Used:</h5>
                    <ul>
                      {round.p2Cards.map(card => (
                        <li key={card.id}>{card.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="back-button">
          <Link to={`/history/${rounds[0].game.player1.username}`} className="btn">🔙 Back to History</Link>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;