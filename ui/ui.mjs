import Cookies from './js.cookie.min.mjs'
import { renderAuthButton } from './auth.mjs';
import { renderGameUI } from './game/index.mjs';

export function renderUI() {
  if (!Cookies.get('goauth')) {
    renderAuthButton();
  } else {
    renderGameUI();
  }
}