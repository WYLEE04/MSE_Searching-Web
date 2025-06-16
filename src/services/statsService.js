import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// 실제 서버 API 호출 함수들
const getPlayerOverallStats = (username) => {
  return axios.get(`${API_URL}/stats/${username}/overall`);
};

const getPlayerCardStats = (username) => {
  return axios.get(`${API_URL}/stats/${username}/cards`);
};

const getPlayerCharacterStats = (username) => {
  return axios.get(`${API_URL}/stats/${username}/characters`);
};

const getPlayerFactionStats = (username) => {
  return axios.get(`${API_URL}/stats/${username}/factions`);
};

const handleApiError = (error, fallbackData = null) => {
  console.error('API Error:', error);
  
  if (error.response) {
    console.error('Error status:', error.response.status);
    console.error('Error data:', error.response.data);
  } else if (error.request) {
    console.error('No response received from server');
  } else {
    console.error('Error setting up request:', error.message);
  }
  
  if (fallbackData !== null) {
    return { data: fallbackData };
  }
  throw error;
};

const getPlayerOverallStatsWithFallback = async (username) => {
  try {
    return await getPlayerOverallStats(username);
  } catch (error) {
    return handleApiError(error, {
      username,
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalRounds: 0,
      avgRoundsPerGame: 0,
      currentScore: 0
    });
  }
};

const getPlayerCardStatsWithFallback = async (username) => {
  try {
    return await getPlayerCardStats(username);
  } catch (error) {
    return handleApiError(error, {
      username,
      cardStats: []
    });
  }
};

const getPlayerCharacterStatsWithFallback = async (username) => {
  try {
    return await getPlayerCharacterStats(username);
  } catch (error) {
    return handleApiError(error, {
      username,
      characterStats: []
    });
  }
};

const getPlayerFactionStatsWithFallback = async (username) => {
  try {
    return await getPlayerFactionStats(username);
  } catch (error) {
    return handleApiError(error, {
      username,
      factionStats: []
    });
  }
};

const statsService = {
  getPlayerOverallStats,
  getPlayerCardStats,
  getPlayerCharacterStats,
  getPlayerFactionStats,
  
  getPlayerOverallStatsWithFallback,
  getPlayerCardStatsWithFallback,
  getPlayerCharacterStatsWithFallback,
  getPlayerFactionStatsWithFallback,
  
};

export default statsService;