import Cookies from './js.cookie.min.mjs';
import { parseJwt } from './auth.mjs';

class UI {
  constructor() {
    this.game = null;
    this.gameId = new URLSearchParams(window.location.search).get('game_id');
    if (this.gameId) {
      this.loadGame();
      this.listenToGameUpdates();
    } else {
      this.printUI();
    }
  }

  async loadGame() {
    if (this.gameId) {
      try {
        const result = await fetch(`http://127.0.0.1:3000/api/games/${this.gameId}`, {
          headers: {
            Authorization: Cookies.get('goauth'),
          }
        });
        if (result.ok) {
          this.game = await result.json();
        } else {
          const data = await result.json();
          this.printErrorMessage(data.message);
        }
      } catch (e) {
        this.gameId = null;
      }
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
      if (!result.ok) {
        const data = await result.json();
        this.printErrorMessage(data.message);
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
      if (!result.ok) {
        const data = await result.json();
        this.printErrorMessage(data.message);
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
      if (!result.ok) {
        const data = await result.json();
        this.printErrorMessage(data.message);
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
      window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?game_id=${this.gameId}`));
      // TODO: not load, just set from response
      this.loadGame();
      this.listenToGameUpdates();
    } else {
      const data = await result.json();
      this.printErrorMessage(data.message);
    }
  }

  addOpponentMove({ currentPlayerMoveIndex, fieldCell: {coordinates, symbol}, status}) {
    this.game.currentPlayerMoveIndex = currentPlayerMoveIndex;
    this.game.field = { ...this.game.field, [JSON.stringify(coordinates)]: symbol };
    this.game.status = status;
    console.log('addOpponentMove', this.game);
    this.printUI();  
  }
  setStatusToInProgress() {
    this.game.status = 'in_progress';
    console.log('setStatusToInProgress', this.game);
    this.printUI();  
  }
  addOpponentPlayer(playerInfo) {
    const { index, ...player } = playerInfo;
    this.game.players[index] = player;
    console.log('addOpponentPlayer', this.game);
    this.printUI();  
  }

  printUI() {
    this.printCreateGameButton();
    this.printSymbolInput();
    this.printStartGameButton();
    this.printField();
    this.printStatus();
    this.clearErrorMessage();
  }

  printStatus() {
    console.log('game status: ', this.game?.status);
    if (this.game?.status === 'finished') {
      const statusElement = document.getElementById('status');
      statusElement.innerText = `Game over`;
    }
  }

  printField() {
    if (!this.game) {
      console.log('No game');
      return
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

    const gameElement = document.getElementById('game');
    gameElement.innerText = '';

    const coordinatedArray = [
      '[-1,1]', '[0,1]', '[1,1]',
      '[-1,0]', '[0,0]', '[1,0]',
      '[-1,-1]', '[0,-1]', '[1,-1]',
    ];

    const fragment = document.createDocumentFragment();

    const cellClickListener = (coordinates) => () => {
      this.makeMove(JSON.parse(coordinates))
    }

    coordinatedArray.forEach(coordinates => {
      const cell = document.createElement('div');
      cell.textContent = cells[coordinates];
      if (this.game?.status === 'in_progress') {
        cell.addEventListener('click', cellClickListener(coordinates));
        cell.style.cursor = 'pointer';
      }
      fragment.appendChild(cell);
    })

    gameElement.appendChild(fragment);
  }

  printSymbolInput() {
    const symbolElement = document.getElementById('symbol');
    symbolElement.innerText = '';
    
    const checkGameHasUser = () => {
      return this.game.players.find(player => player.userId === parseJwt(Cookies.get('goauth')).sub)
    }

    if (this.game?.status === 'created') {
      const player = checkGameHasUser();
      if (player) {
        symbolElement.innerText = `Your symbol is ${player.symbol}`;
      } else {
        const fragment = document.createDocumentFragment();
        const input = document.createElement('input');
        const button = document.createElement('button');
        button.innerText = 'Set you symbol';

        button.addEventListener('click', () => {
          this.addPlayer(input.value);
        });

        fragment.appendChild(input);
        fragment.appendChild(button);
        symbolElement.append(fragment)
      }
    }
  }

  printStartGameButton() {
    const startGameElement = document.getElementById('startGame');
    startGameElement.innerText = '';

    if (this.game?.status === 'created') {
      const button = document.createElement('button');
      button.innerText = 'Start game';
      button.addEventListener('click', () => {
        this.startGame();
      });

      startGameElement.append(button)
    }
  }
  printCreateGameButton() {
    const createGameElement = document.getElementById('createGame');
    createGameElement.innerText = '';

    if (!this.game) {
      const button = document.createElement('button');
      button.innerText = 'Create game';
      button.addEventListener('click', () => {
        this.createGame();
      });

      createGameElement.append(button)
    }
  }
  printErrorMessage(text) {
    const errorElement = document.getElementById('error');
    errorElement.innerText = text;
    setTimeout(() => {
      errorElement.innerText = '';
    }, 5000)
  }
  clearErrorMessage() {
    const errorElement = document.getElementById('error');
    errorElement.innerText = '';
  }

  listenToGameUpdates() {
    const socket = io("http://127.0.0.1:3000");
    socket.on(`${this.gameId}_move`, (moveInfo) => {
      this.addOpponentMove(moveInfo)
    });
    socket.on(`${this.gameId}_start`, () => {
      this.setStatusToInProgress()
    });
    socket.on(`${this.gameId}_player`, (playerInfo) => {
      this.addOpponentPlayer(playerInfo)
    });
  }
}

export function renderGameUI(gameId) {
  window.gameUI = new UI(gameId);
}