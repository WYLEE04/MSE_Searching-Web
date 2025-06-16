import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function PlayerSearch() {
  const [username, setUsername] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 최근 검색어 불러오기
  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(savedSearches.slice(0, 5)); // 최대 5개만
  }, []);

  // 검색어 저장 함수
  const saveSearch = (searchTerm) => {
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    // 중복 제거
    const filteredSearches = savedSearches.filter(search => search !== searchTerm);
    
    // 맨 앞에 새 검색어 추가
    const newSearches = [searchTerm, ...filteredSearches].slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    setRecentSearches(newSearches);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (username.trim()) {
      saveSearch(username.trim());
      // 새로운 프로필 페이지로 이동
      navigate(`/profile/${username.trim()}`);
    }
  };

  const searchRecent = (searchTerm) => {
    setUsername(searchTerm);
    // 새로운 프로필 페이지로 이동
    navigate(`/profile/${searchTerm}`);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };


  
  return (
    <div className="app-container">
      {/* Header Navigation */}
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">LMS</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/rankings" className="nav-link">🏆 Rankings</Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="main-container">
        {/* Logo Section */}
        <div className="logo-section">
          <h1 className="main-logo">Last Magician Standing</h1>
          <p className="main-subtitle">The Ultimate Magic Duel</p>
          <p className="main-description">
            Become the greatest wizard in 1vs1 magic battles. 
            Check match history, climb the rankings, and prove your magical prowess.
          </p>
        </div>


        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Enter player name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit" className="search-button">
              🔍 Search
            </button>
          </form>
          


          {/* Recent Searches - 검색 기록이 있을 때만 표시 */}
          {recentSearches.length > 0 && (
            <div className="recent-searches">
              <div className="recent-searches-header">
                <span className="recent-searches-title">Recent Searches:</span>
                <button 
                  className="clear-searches-btn"
                  onClick={clearRecentSearches}
                  type="button"
                >
                  Clear
                </button>
              </div>
              <div className="search-suggestions">
                {recentSearches.map((search, index) => (
                  <span 
                    key={index}
                    className="suggestion-tag recent-tag" 
                    onClick={() => searchRecent(search)}
                  >
                    {search}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Match History</h3>
            <p className="feature-description">
              View detailed game records and 
              round-by-round card usage statistics
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3 className="feature-title">Ranking System</h3>
            <p className="feature-description">
              Compare your skills with top wizards
              through score-based rankings
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚔️</div>
            <h3 className="feature-title">Game Replay</h3>
            <p className="feature-description">
              Analyze detailed round information and
              card combinations to improve strategy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerSearch;