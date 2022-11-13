import { parseJwt } from './auth.mjs';
import Cookies from './js.cookie.min.mjs';

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

export default UiRenderer;
