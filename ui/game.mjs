import Cookies from './js.cookie.min.mjs';
import { parseJwt } from './auth.mjs';

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

// TODO: split to 2 different renderers: html and console
class UiRenderer {
  _printStatus(game) {
    console.log('game status: ', game?.status);
    if (game?.status === 'finished') {
      const statusElement = document.getElementById('status');
      statusElement.innerText = `Game over`;
    }
  }

  _printField(game, { onCellClick }) {
    if (!game) {
      console.log('No game');
      return
    }
    const cells = Object.keys(game.field).reduce((acc, curr) => {
      acc[curr] = (game).field[curr] || '.'
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
      onCellClick(JSON.parse(coordinates))
    }

    coordinatedArray.forEach(coordinates => {
      const cell = document.createElement('div');
      cell.textContent = cells[coordinates];
      if (game?.status === 'in_progress') {
        cell.addEventListener('click', cellClickListener(coordinates));
        cell.style.cursor = 'pointer';
      }
      fragment.appendChild(cell);
    })

    gameElement.appendChild(fragment);
  }

  _printSymbolInput(game, { onAddPlayerClick }) {
    const symbolElement = document.getElementById('symbol');
    symbolElement.innerText = '';
    
    // TODO: this logic should be somewhere else
    const checkGameHasUser = () => {
      return game.players.find(player => player.userId === parseJwt(Cookies.get('goauth')).sub)
    }

    if (game?.status === 'created') {
      const player = checkGameHasUser();
      if (player) {
        symbolElement.innerText = `Your symbol is ${player.symbol}`;
      } else {
        const fragment = document.createDocumentFragment();
        const input = document.createElement('input');
        const button = document.createElement('button');
        button.innerText = 'Set you symbol';

        button.addEventListener('click', () => {
          onAddPlayerClick(input.value);
        });

        fragment.appendChild(input);
        fragment.appendChild(button);
        symbolElement.append(fragment)
      }
    }
  }

  _printStartGameButton(game, { onStartGameClick }) {
    const startGameElement = document.getElementById('startGame');
    startGameElement.innerText = '';

    if (game?.status === 'created') {
      const button = document.createElement('button');
      button.innerText = 'Start game';
      button.addEventListener('click', onStartGameClick);

      startGameElement.append(button)
    }
  }

  _printCreateGameButton(game, { onCreateGameClick }) {
    const createGameElement = document.getElementById('createGame');
    createGameElement.innerText = '';

    if (!game) {
      const button = document.createElement('button');
      button.innerText = 'Create game';
      button.addEventListener('click', onCreateGameClick);

      createGameElement.append(button)
    }
  }

  printErrorMessage(text) {
    const errorElement = document.getElementById('error');
    errorElement.innerText = text;
    setTimeout(() => {
      this._clearErrorMessage();
    }, 5000)
  }

  _clearErrorMessage() {
    const errorElement = document.getElementById('error');
    errorElement.innerText = '';
  }

  renderUI(game, { onCreateGameClick, onAddPlayerClick, onStartGameClick, onCellClick }) {
    this._printCreateGameButton(game, { onCreateGameClick });
    this._printSymbolInput(game, { onAddPlayerClick });
    this._printStartGameButton(game, { onStartGameClick });
    this._printField(game, { onCellClick });
    this._printStatus(game);
    this._clearErrorMessage();
  }
}

class GameController {
  constructor(apiService, uiRenderer) {
    this._apiService = apiService;
    this._uiRenderer = uiRenderer;
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
        const result = await this._apiService.loadGame(this.gameId);
        if (result.ok) {
          this.game = await result.json();
        } else {
          const data = await result.json();
          this._uiRenderer.printErrorMessage(data.message);
        }
      } catch (e) {
        this.gameId = null;
      }
      this.printUI();
    }
  }

  async makeMove(coordinates) {
    if (this.gameId) {
      const result = await await this._apiService.makeMove(this.gameId, coordinates);
      if (!result.ok) {
        const data = await result.json();
        this._uiRenderer.printErrorMessage(data.message);
      }
    }
  }

  async addPlayer(symbol) {
    if (this.gameId) {
      const result = await this._apiService.addPlayer(this.gameId, symbol);
      if (!result.ok) {
        const data = await result.json();
        this._uiRenderer.printErrorMessage(data.message);
      }
    }
  }

  async startGame() {
    if (this.gameId) {
      const result = await this._apiService.startGame(this.gameId);
      if (!result.ok) {
        const data = await result.json();
        this._uiRenderer.printErrorMessage(data.message);
      }
    }
  }

  async createGame() {
    const result = await this._apiService.createGame();
    if (result.ok) {
      this.gameId = (await result.json()).id;
      window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?game_id=${this.gameId}`));
      // TODO: not load, just set from response
      this.loadGame();
      this.listenToGameUpdates();
    } else {
      const data = await result.json();
      this._uiRenderer.printErrorMessage(data.message);
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
    this._uiRenderer.renderUI(this.game, { 
      onCreateGameClick: this.createGame.bind(this),
      onAddPlayerClick: this.addPlayer.bind(this),
      onStartGameClick: this.startGame.bind(this),
      onCellClick: this.makeMove.bind(this),
    })
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

export function renderGameUI() {
  window.gameUI = new GameController(
    new ApiService('http://127.0.0.1:3000'),
    new UiRenderer(),
  );
}