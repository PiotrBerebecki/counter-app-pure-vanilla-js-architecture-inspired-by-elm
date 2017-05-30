// ************************************************************
// Store helper - inspired by redux
// https://github.com/reactjs/redux/blob/master/src/createStore.js
// ************************************************************
function createStore(reducer, preloadedState) {
  let currentState = preloadedState;
  let listeners = [];

  function getState() {
    return currentState;
  }

  function dispatch(action) {
    currentState = reducer(currentState, action);
    listeners.forEach(listener => listener());
  }

  function subscribe(listener) {
    listeners.push(listener);
  }

  dispatch({ type: 'InitialiseStateTree' });

  return {
    getState,
    dispatch,
    subscribe,
  };
}

// ************************************************************
// Reducer
// ************************************************************
function clickCounterApp(state = 0, action) {
  switch (action.type) {
    case 'INCREASE':
      return state + 1;
    case 'DECREASE':
      return state - 1;
    case 'RESET':
      return 0;
    default:
      return state;
  }
}

// ************************************************************
// Actions
// ************************************************************
function increaseCount() {
  return {
    type: 'INCREASE',
  };
}

function decreaseCount() {
  return {
    type: 'DECREASE',
  };
}

function resetCount() {
  return {
    type: 'RESET',
  };
}

// ************************************************************
// DOM helpers
// ************************************************************
function div(divText) {
  const div = document.createElement('div');
  if (divText !== undefined) {
    const txt = document.createTextNode(divText);
    div.appendChild(txt);
  }
  return div;
}

function button(buttonText, clickHandler, actionGenerator) {
  const button = document.createElement('button');
  const txt = document.createTextNode(buttonText);
  button.appendChild(txt);
  button.addEventListener('click', e => clickHandler(actionGenerator()));
  return button;
}

function removeChildrenNodes(parentNode) {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }
}

function render(component, root) {
  removeChildrenNodes(root);
  root.appendChild(component);
}

// ************************************************************
// App component
// ************************************************************
function app(store) {
  function handleClick(action) {
    store.dispatch(action);
  }

  const appContainer = document.createElement('div');
  [
    div(store.getState()),
    button('+', handleClick, increaseCount),
    button('-', handleClick, decreaseCount),
    button('Reset', handleClick, resetCount),
  ].forEach(el => {
    appContainer.appendChild(el);
  });

  return appContainer;
}

// ************************************************************
// Initialise the store and the app
// ************************************************************
const store = createStore(clickCounterApp);

function renderApp() {
  render(app(store), document.getElementById('root'));
}
renderApp();

store.subscribe(renderApp);
