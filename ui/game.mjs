import ApiService from './ApiService.mjs';
import UiRenderer from './UiRenderer.mjs';

class GameController {
  constructor(gameId, apiService, socket, uiRenderer) {
    this._apiService = apiService;
    this._socket = socket;
    this._uiRenderer = uiRenderer;
    this.game = null;
    this.gameId = gameId;
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
      // TODO: would be good to make this class URL agnostic
      window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?game_id=${this.gameId}`));
      // TODO: not load, just set from response
      this.loadGame();
      this.listenToGameUpdates();
    } else {
      const data = await result.json();
      this._uiRenderer.printErrorMessage(data.message);
    }
  }

  addOpponentMove({ currentPlayerMoveIndex, fieldCell: { coordinates, symbol }, status}) {
    this.game.currentPlayerMoveIndex = currentPlayerMoveIndex;
    this.game.field = { ...this.game.field, [JSON.stringify(coordinates)]: symbol };
    this.game.status = status;
    this.printUI();  
  }
  setStatusToInProgress() {
    this.game.status = 'in_progress';
    this.printUI();  
  }
  addOpponentPlayer(playerInfo) {
    const { index, ...player } = playerInfo;
    this.game.players[index] = player;
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
    this._socket.on(`${this.gameId}_move`, (moveInfo) => {
      this.addOpponentMove(moveInfo)
    });
    this._socket.on(`${this.gameId}_start`, () => {
      this.setStatusToInProgress()
    });
    this._socket.on(`${this.gameId}_player`, (playerInfo) => {
      this.addOpponentPlayer(playerInfo)
    });
  }
}

export function renderGameUI() {
  window.gameUI = new GameController(
    new URLSearchParams(window.location.search).get('game_id'),
    new ApiService('http://127.0.0.1:3000'),
    io("http://127.0.0.1:3000"),
    new UiRenderer(),
  );
}