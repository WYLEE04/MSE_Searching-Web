import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gameService from '../services/gameService';
import statsService from '../services/statsService';

function PlayerProfile() {
  const [playerData, setPlayerData] = useState(null);
  const [games, setGames] = useState([]);
  const [gameDetails, setGameDetails] = useState({});
  const [overallStats, setOverallStats] = useState(null);
  const [cardStats, setCardStats] = useState([]);
  const [characterStats, setCharacterStats] = useState([]);
  const [factionStats, setFactionStats] = useState([]);
  const [playerRanking, setPlayerRanking] = useState({ rank: 1, totalPlayers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      fetchPlayerData(username);
    }
  }, [username]);

  const fetchPlayerData = async (playerName) => {
    try {
      setLoading(true);
      setError(null);
      
      const [gamesRes, overallRes, cardRes, characterRes, factionRes] = await Promise.all([
        gameService.getPlayerHistory(playerName),
        statsService.getPlayerOverallStats(playerName),
        statsService.getPlayerCardStats(playerName),
        statsService.getPlayerCharacterStats(playerName),
        statsService.getPlayerFactionStats(playerName)
      ]);

      const gamesData = gamesRes.data || [];
      setGames(gamesData);
      setOverallStats(overallRes.data);
      setCardStats(cardRes.data.cardStats || []);
      setCharacterStats(characterRes.data.characterStats || []);
      setFactionStats(factionRes.data.factionStats || []);
      
      // 각 게임의 상세 정보 가져오기
      const detailsPromises = gamesData.slice(0, 10).map(game => 
        gameService.getGameReplay(game.id).catch(err => ({ data: [] }))
      );
      
      const detailsResults = await Promise.all(detailsPromises);
      const detailsMap = {};
      
      gamesData.slice(0, 10).forEach((game, index) => {
        detailsMap[game.id] = detailsResults[index].data || [];
      });
      
      setGameDetails(detailsMap);
      
      // 플레이어 기본 정보
      if (gamesData.length > 0) {
        const firstGame = gamesData[0];
        const player = firstGame.player1.username === playerName ? firstGame.player1 : firstGame.player2;
        setPlayerData(player);
      }
      
    } catch (err) {
      console.error('Error loading player data:', err);
      setError('Failed to load player data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/profile/${searchInput.trim()}`);
    }
  };

  const getWinRate = () => {
    if (!overallStats || overallStats.totalGames === 0) return 0;
    return Math.round(overallStats.winRate);
  };

  const getRecentGames = () => {
    return games.slice(0, 10);
  };

  const getMostPlayedCharacter = () => {
    return characterStats.length > 0 ? characterStats[0] : null;
  };

  const getMostPlayedFaction = () => {
    return factionStats.length > 0 ? factionStats[0] : null;
  };

  const getGameResult = (game) => {
    if (!game.finished) return 'ongoing';
    return game.winner && game.winner.username === username ? 'win' : 'loss';
  };

  const getPlayerInfo = (game) => {
    return game.player1.username === username ? 
      { player: game.player1, isPlayer1: true } : 
      { player: game.player2, isPlayer1: false };
  };

  const getOpponentInfo = (game) => {
    return game.player1.username === username ? 
      { player: game.player2, isPlayer1: false } : 
      { player: game.player1, isPlayer1: true };
  };

  const getPlayerGameInfo = (game) => {
    const rounds = gameDetails[game.id] || [];
    if (rounds.length === 0) {
      return { faction: 'Unknown', character: 'Unknown', cards: ['No data'] };
    }

    const firstRound = rounds[0];
    const isPlayer1 = game.player1.username === username;
    
    const faction = isPlayer1 ? firstRound.p1Faction : firstRound.p2Faction;
    const character = isPlayer1 ? firstRound.p1Character : firstRound.p2Character;
    
    const allCards = new Set();
    rounds.forEach(round => {
      const cards = isPlayer1 ? round.p1Cards : round.p2Cards;
      cards.forEach(card => allCards.add(card.name));
    });

    return {
      faction: faction || 'Unknown',
      character: character || 'Unknown',
      cards: Array.from(allCards).slice(0, 3)
    };
  };

  const getOpponentGameInfo = (game) => {
    const rounds = gameDetails[game.id] || [];
    if (rounds.length === 0) {
      return { faction: 'Unknown', character: 'Unknown', cards: ['No data'] };
    }

    const firstRound = rounds[0];
    const isOpponentPlayer1 = game.player1.username !== username;
    
    const faction = isOpponentPlayer1 ? firstRound.p1Faction : firstRound.p2Faction;
    const character = isOpponentPlayer1 ? firstRound.p1Character : firstRound.p2Character;
    
    const allCards = new Set();
    rounds.forEach(round => {
      const cards = isOpponentPlayer1 ? round.p1Cards : round.p2Cards;
      cards.forEach(card => allCards.add(card.name));
    });

    return {
      faction: faction || 'Unknown',
      character: character || 'Unknown',
      cards: Array.from(allCards).slice(0, 3)
    };
  };

  const formatFactionName = (faction) => {
    const factionMap = {
      'MAGOS': 'Magos', 'VERTA': 'Verta', 'MONSTER': 'Monster'
    };
    return factionMap[faction] || faction;
  };

  const formatCharacterName = (character) => {
    const characterMap = {
      'KIM': 'Kim', 'HYTTY': 'Hytty', 'SLIME': 'Slime'
    };
    return characterMap[character] || character;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading player profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const winRate = getWinRate();
  const recentGames = getRecentGames();
  const mostPlayedCharacter = getMostPlayedCharacter();
  const mostPlayedFaction = getMostPlayedFaction();

  return (
    <div className="profile-container">
      {/* Left Sidebar */}
      <div className="profile-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/">LMS</Link>
        </div>
        
        {/* Player Info Card */}
        <div className="player-info-card">
          <div className="player-name-large">{username}</div>
          <div className="player-stats-grid">
            <div className="stat-item">
              <div className="stat-label">Score Point</div>
              <div className="stat-value">{overallStats?.currentScore || 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Ranking</div>
              <div className="stat-value">#{playerRanking.rank}</div>
            </div>
          </div>
        </div>

        {/* Most Used Cards */}
        <div className="most-used-cards-sidebar">
          <h3>Most selected Card</h3>
          <div className="card-rank-list">
            {cardStats.slice(0, 4).map((card, index) => (
              <div key={card.cardName} className="card-rank-item">
                <div className="card-rank-number">{index + 1}.</div>
                <div className="card-info">
                  <div className="card-name">{card.cardName}</div>
                  <div className="card-usage">{card.timesUsed}회 • {card.winRate}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        {/* Search Header */}
        <div className="search-header">
          <form onSubmit={handleSearch} className="player-search-form">
            <input
              type="text"
              placeholder="Player Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="player-search-input"
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
          <Link to="/rankings" className="ranking-button">Ranking</Link>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview-section">
          {/* Win Rate Chart */}
          <div className="winrate-display">
            <div className="winrate-chart">
              <svg viewBox="0 0 120 120" className="winrate-pie">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                <circle
                  cx="60" cy="60" r="45" fill="none" stroke="#3b82f6" strokeWidth="8"
                  strokeDasharray={`${(winRate / 100) * 283} 283`}
                  strokeDashoffset="70.75" 
                  className="win-arc"
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="65" textAnchor="middle" className="winrate-percentage">
                  {winRate}%
                </text>
              </svg>
            </div>
            <div className="winrate-text">
              <div className="recent-record-title">Recent Games</div>
              <div className="win-loss-text">
                {overallStats?.wins || 0}승 {overallStats?.losses || 0}패
              </div>
            </div>
          </div>

          {/* Most Played Info */}
          <div className="most-played-info">
            {mostPlayedFaction && (
              <div className="most-played-item">
                <div className="played-icon">🏛️</div>
                <div className="played-details">
                  <div className="played-name">{mostPlayedFaction.faction}</div>
                  <div className="played-rate">{mostPlayedFaction.winRate}% 승률</div>
                </div>
              </div>
            )}
            {mostPlayedCharacter && (
              <div className="most-played-item">
                <div className="played-icon">⚔️</div>
                <div className="played-details">
                  <div className="played-name">{mostPlayedCharacter.character}</div>
                  <div className="played-rate">{mostPlayedCharacter.winRate}% WinRate</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Match History */}
        <div className="match-history-section">
          <h3>전적</h3>
          <div className="match-list">
            {recentGames.map((game) => {
              const result = getGameResult(game);
              const playerInfo = getPlayerInfo(game);
              const opponentInfo = getOpponentInfo(game);
              const playerGameInfo = getPlayerGameInfo(game);
              const opponentGameInfo = getOpponentGameInfo(game);
              
              return (
                <div 
                  key={game.id} 
                  className={`match-record ${result}`}
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  {/* Left: Player Info */}
                  <div className="match-player-side">
                    <div className="match-result-indicator">
                      {result === 'win' ? 'W' : result === 'loss' ? 'L' : 'P'}
                    </div>
                    <div className="player-match-details">
                      <div className="player-match-name">{playerInfo.player.username}</div>
                      <div className="match-faction-character">
                        {formatFactionName(playerGameInfo.faction)} • {formatCharacterName(playerGameInfo.character)}
                      </div>
                      <div className="match-cards">
                        {playerGameInfo.cards.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Center: VS */}
                  <div className="match-vs-divider">VS</div>

                  {/* Right: Opponent Info */}
                  <div className="match-opponent-side">
                    <div className="opponent-match-details">
                      <div className="opponent-match-name">{opponentInfo.player.username}</div>
                      <div className="match-faction-character">
                        {formatFactionName(opponentGameInfo.faction)} • {formatCharacterName(opponentGameInfo.character)}
                      </div>
                      <div className="match-cards">
                        {opponentGameInfo.cards.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="match-final-score">
                    {result === 'win' ? 
                      `${playerInfo.isPlayer1 ? game.player1Wins  : game.player2Wins} : ${playerInfo.isPlayer1 ? game.player2Wins  : game.player1Wins}` : 
                     result === 'loss' ? 
                      `${playerInfo.isPlayer1 ? game.player1Wins : game.player2Wins} : ${playerInfo.isPlayer1 ? game.player2Wins  : game.player1Wins}` : 
                     'In Progress'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfile;
