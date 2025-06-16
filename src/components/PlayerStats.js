import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import statsService from '../services/statsService';
import gameService from '../services/gameService';

function PlayerStats() {
  const [overallStats, setOverallStats] = useState(null);
  const [factionStats, setFactionStats] = useState([]);
  const [characterStats, setCharacterStats] = useState([]);
  const [cardStats, setCardStats] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setLoading(true);
        const [overallRes, factionRes, characterRes, cardRes, gamesRes] = await Promise.all([
          statsService.getPlayerOverallStats(username),
          statsService.getPlayerFactionStats(username),
          statsService.getPlayerCharacterStats(username),
          statsService.getPlayerCardStats(username),
          gameService.getPlayerHistory(username)
        ]);

        setOverallStats(overallRes.data);
        setFactionStats(factionRes.data.factionStats || []);
        setCharacterStats(characterRes.data.characterStats || []);
        setCardStats(cardRes.data.cardStats || []);
        setRecentGames(gamesRes.data.slice(0, 10) || []); // 최근 10게임만
        
      } catch (err) {
        console.error('Error loading player stats:', err);
        setError('Failed to load player statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, [username]);

  // 승률 기반 티어 계산
  const getTier = (winRate) => {
    if (winRate >= 70) return { name: 'Archmage', level: 4, color: '#c89b3c' };
    if (winRate >= 60) return { name: 'Wizard', level: 3, color: '#0596aa' };
    if (winRate >= 50) return { name: 'Mage', level: 2, color: '#1e90ff' };
    return { name: 'Apprentice', level: 1, color: '#6b7280' };
  };


  // 최고 승률 진영/캐릭터 찾기
  const getBestFaction = () => factionStats.length > 0 ? factionStats[0] : null;
  const getBestCharacter = () => characterStats.length > 0 ? characterStats[0] : null;

  
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
      <div className="loading">Loading player profile...</div>
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

  const tier = overallStats ? getTier(overallStats.winRate) : null;
  const bestFaction = getBestFaction();
  const bestCharacter = getBestCharacter();

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

      <div className="profile-container">
        {/* Player Profile Header */}
        <div className="profile-header">
          <div className="profile-info">
            <div className="player-avatar">
              <div className="avatar-icon">🧙‍♂️</div>
            </div>
            <div className="player-details">
              <h1 className="player-name">{username}</h1>
              <div className="player-subtitle">Last Magician Standing</div>
              <div className="update-info">
                <button className="update-btn">🔄 Update</button>
                <span className="last-update">Last updated: now</span>
              </div>
            </div>
          </div>
          
          {/* Tier Information */}
          {tier && overallStats && (
            <div className="tier-info">
              <div className="tier-badge" style={{ borderColor: tier.color }}>
                <div className="tier-icon" style={{ backgroundColor: tier.color }}>
                  {tier.level === 4 ? '👑' : tier.level === 3 ? '🔮' : tier.level === 2 ? '⚡' : '🎭'}
                </div>
                <div className="tier-details">
                  <div className="tier-name">{tier.name} {tier.level}</div>
                  <div className="tier-score">{overallStats.currentScore} LP</div>
                </div>
              </div>
              <div className="win-rate-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${overallStats.winRate}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="percentage">{Math.round(overallStats.winRate)}%</div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {/* Left Column */}
          <div className="left-column">
            {/* Game Stats Summary */}
            {overallStats && (
              <div className="stats-summary">
                <div className="summary-header">
                  <h3>Game Statistics</h3>
                  <span className="total-games">{overallStats.totalGames} games</span>
                </div>
                <div className="win-loss-display">
                  <div className="win-loss-bar">
                    <div 
                      className="win-bar" 
                      style={{ width: `${overallStats.winRate}%` }}
                    ></div>
                  </div>
                  <div className="win-loss-text">
                    <span className="wins">{overallStats.wins}W</span>
                    <span className="losses">{overallStats.losses}L</span>
                  </div>
                </div>
                <div className="avg-stats">
                  <div className="stat-item">
                    <span className="stat-value">{overallStats.avgRoundsPerGame}</span>
                    <span className="stat-label">Avg Rounds</span>
                  </div>
                </div>
              </div>
            )}

            {/* Best Performance */}
            <div className="best-performance">
              <h3>Best Performance</h3>
              {bestFaction && (
                <div className="best-item">
                  <div className="best-icon">🏛️</div>
                  <div className="best-details">
                    <div className="best-name">{bestFaction.faction}</div>
                    <div className="best-stats">
                      {bestFaction.winRate}% WR ({bestFaction.wins}W {bestFaction.losses}L)
                    </div>
                  </div>
                </div>
              )}
              {bestCharacter && (
                <div className="best-item">
                  <div className="best-icon">⚔️</div>
                  <div className="best-details">
                    <div className="best-name">{bestCharacter.character}</div>
                    <div className="best-stats">
                      {bestCharacter.winRate}% WR ({bestCharacter.wins}W {bestCharacter.losses}L)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Faction Performance */}
            <div className="performance-section">
              <h3>Faction Performance</h3>
              <div className="performance-list">
                {factionStats.slice(0, 5).map((faction, index) => (
                  <div key={faction.faction} className="performance-item">
                    <div className="performance-rank">#{index + 1}</div>
                    <div className="performance-name">{faction.faction}</div>
                    <div className="performance-stats">
                      <span className="performance-wr">{faction.winRate}%</span>
                      <span className="performance-games">({faction.gamesPlayed} games)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Recent Games */}
            <div className="recent-games">
              <div className="section-header">
                <h3>Recent Games</h3>
                <span className="games-count">{recentGames.length} games</span>
              </div>
              <div className="games-list">
                {recentGames.map((game) => {
                  const isWin = game.winner && game.winner.username === username;
                  const opponent = game.player1.username === username ? 
                    game.player2.username : game.player1.username;
                  
                  return (
                    <div key={game.id} className={`game-item ${isWin ? 'win' : 'lose'}`}>
                      <div className="game-result">
                        <div className={`result-badge ${isWin ? 'win' : 'lose'}`}>
                          {isWin ? 'W' : 'L'}
                        </div>
                      </div>
                      <div className="game-info">
                        <div className="game-mode">Ranked Duel</div>
                        <div className="game-time">Game #{game.id}</div>
                      </div>
                      <div className="game-opponent">
                        <div className="opponent-name">vs {opponent}</div>
                        <div className="game-score">
                          {isWin ? `${game.player1Wins || 3} : ${game.player2Wins || 1}` : 
                                  `${game.player2Wins || 3} : ${game.player1Wins || 1}`}
                        </div>
                      </div>
                      <div className="game-actions">
                        <Link 
                          to={`/game/${game.id}`} 
                          className="view-detail-btn"
                        >
                          📊
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Most Used Cards */}
            <div className="most-used-cards">
              <h3>Most Used Cards</h3>
              <div className="cards-grid">
                {cardStats.slice(0, 6).map((card, index) => (
                  <div key={card.cardName} className="card-item">
                    <div className="card-rank">#{index + 1}</div>
                    <div className="card-info">
                      <div className="card-name">{card.cardName}</div>
                      <div className="card-stats">
                        <span className="card-wr">{card.winRate}%</span>
                        <span className="card-usage">({card.timesUsed} uses)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerStats;