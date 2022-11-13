import ApiService from './ApiService.mjs';
import UiRenderer from './UiRenderer.mjs';
import GameController from './GameController.mjs';

export function renderGameUI() {
  console.log('called');
  window.gameUI = new GameController(
    new URLSearchParams(window.location.search).get('game_id'),
    new ApiService('http://127.0.0.1:3000'),
    io("http://127.0.0.1:3000"),
    new UiRenderer(),
  );
}