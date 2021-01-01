import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const container = document.createElement('div');
  container.className = 'hakeshonassybot-container';
  body.append(container);

  ReactDOM.render(<App />, container);
});
