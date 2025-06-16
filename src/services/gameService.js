import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// 실제 서버 API 호출
const getPlayerHistory = (username) => {
  return axios.get(`${API_URL}/history/${username}`);
};

const getGameReplay = (gameId) => {
  return axios.get(`${API_URL}/replay/${gameId}`);
};

const getRankings = () => {
  return axios.get(`${API_URL}/users/rankings`);
};

// 게임 생성
const createGame = (player1, player2) => {
  return axios.post(`${API_URL}/game`, {
    player1,
    player2
  });
};

// 라운드 추가
const addRound = (gameData) => {
  return axios.post(`${API_URL}/round`, gameData);
};

// 게임 종료
const finishGame = (gameId, winnerUsername) => {
  return axios.post(`${API_URL}/finish`, {
    gameId,
    winnerUsername
  });
};

// 카드 관련 API
const getAllCards = () => {
  return axios.get(`${API_URL}/card`);
};

const createCard = (name) => {
  return axios.post(`${API_URL}/card`, { name });
};

const gameService = {
  getPlayerHistory,
  getGameReplay,
  getRankings,
  getAllCards,
  
  createGame,
  addRound,
  finishGame,
  createCard
};

export default gameService;