import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerSearch from './components/PlayerSearch';
import GameHistory from './components/GameHistory';
import GameDetail from './components/GameDetail';
import Rankings from './components/Ranking';
import PlayerProfile from './components/PlayerProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<PlayerSearch />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/profile/:username" element={<PlayerProfile />} />
            <Route path="/history/:username" element={<GameHistory />} />
            <Route path="/game/:gameId" element={<GameDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;