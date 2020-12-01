import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
  <div>
     <b>Hello world!</b>
  </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.querySelector('body'));
});
