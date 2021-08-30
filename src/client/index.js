import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const container = document.createElement('div');
  const script = document.createElement('script');

  script.src = 'https://telegram.org/js/telegram-widget.js?15';
  script.setAttribute('data-telegram-login', 'HakeTestAdv_bot');
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-auth-url', 'https://4eea-93-92-200-193.ngrok.io');
  script.async = true;

  container.className = 'hakeshonassybot-container';
  document.body.appendChild(script);
  //body.append(container, script);
  body.append(container);

  ReactDOM.render(<App />, container);
});
