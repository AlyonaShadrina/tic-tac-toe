import Cookies from './js.cookie.min.mjs'
import { renderUI } from './ui.mjs';

export function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
  const tokenDecoded = parseJwt(response.credential)
  Cookies.set('goauth', response.credential, {
    // secure: true, // for production
    sameSite: 'strict',
    expires: new Date(tokenDecoded.exp * 1000)
  });
  document.getElementById('buttonDiv').innerText = '';
  renderUI();
}
export function renderAuthButton() {
    google.accounts.id.initialize({
      client_id: "974864110959-kcg7q2lif9a86oqv0sbb3muo4k7kfhq8.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }  // customization attributes
    );
    // google.accounts.id.prompt(); // also display the One Tap dialog
}