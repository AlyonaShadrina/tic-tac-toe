import Cookies from '../js.cookie.min.mjs';

class ApiService {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }
  
  async loadGame(gameId) {
    return fetch(`${this.baseUrl}/api/games/${gameId}`, {
      headers: {
        Authorization: Cookies.get('goauth'),
      }
    });
  }

  async makeMove(gameId, coordinates) {
    return fetch(`${this.baseUrl}/api/games/${gameId}/move`, {
      method: 'POST',
      body: JSON.stringify({ coordinates }),
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookies.get('goauth'),
      }
    });
  }

  async addPlayer(gameId, symbol) {
    return fetch(`${this.baseUrl}/api/games/${gameId}/players`, {
      method: 'POST',
      body: JSON.stringify({ symbol }),
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookies.get('goauth'),
      }
    });
  }

  async startGame(gameId) {
    return fetch(`${this.baseUrl}/api/games/${gameId}/start`, {
      method: 'POST',
      headers: {
        Authorization: Cookies.get('goauth'),
      }
    });
  }

  async createGame() {
    return fetch(`${this.baseUrl}/api/games`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookies.get('goauth'),
      }
    });
  }
}

export default ApiService;
