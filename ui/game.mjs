import Cookies from './js.cookie.min.mjs'
class UI {
  constructor(gameId) {
    this.game = null;
    this.gameId = gameId;
  }

  async loadGame() {
    if (this.gameId) {
      const result = await fetch(`http://127.0.0.1:3000/api/games/${this.gameId}`, {
        headers: {
          Authorization: Cookies.get('goauth'),
        }
      });
      this.game = await result.json();
      this.printUI();
    }
  }

  async makeMove(coordinates) {
    if (this.gameId) {
      const result = await fetch(`http://127.0.0.1:3000/api/games/${this.gameId}/move`, {
        method: 'POST',
        body: JSON.stringify({ coordinates }),
        headers: {
          "Content-Type": "application/json",
          Authorization: Cookies.get('goauth'),
        }
      });
      if (result.ok) {
        this.loadGame();
      }
    }
  }

  async addPlayer(symbol) {
    if (this.gameId) {
      const result = await fetch(`http://127.0.0.1:3000/api/games/${this.gameId}/players`, {
        method: 'POST',
        body: JSON.stringify({ symbol }),
        headers: {
          "Content-Type": "application/json",
          Authorization: Cookies.get('goauth'),
        }
      });
      if (result.ok) {
        this.loadGame();
      }
    }
  }

  async startGame() {
    if (this.gameId) {
      const result = await fetch(`http://127.0.0.1:3000/api/games/${this.gameId}/start`, {
        method: 'POST',
        headers: {
          Authorization: Cookies.get('goauth'),
        }
      });
      if (result.ok) {
        this.loadGame();
      }
    }
  }

  async createGame(players) {
    const result = await fetch(`http://127.0.0.1:3000/api/games`, {
      method: 'POST',
      body: JSON.stringify(players),
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookies.get('goauth'),
      }
    });
    if (result.ok) {
      this.gameId = (await result.json()).id;
      this.loadGame();
    }
  }

  printUI() {
    this.printField();
    this.printStatus();
  }

  printStatus() {
    console.log('game status: ', this.game?.status);
  }

  printField() {
    if (!this.game) {
      console.log('No game');
    }
    // const cells = (this.game as GameDBEntity).field;
    const cells = Object.keys(this.game.field).reduce((acc, curr) => {
      acc[curr] = (this.game).field[curr] || '.'
      return acc
    }, {})
    console.log(`
    ${cells['[-1,1]']}|${cells['[0,1]']}|${cells['[1,1]']}
    ${cells['[-1,0]']}|${cells['[0,0]']}|${cells['[1,0]']}
    ${cells['[-1,-1]']}|${cells['[0,-1]']}|${cells['[1,-1]']}
    `);
  }
}

export function renderGameUI(gameId) {
  window.gameUI = new UI(gameId);
}