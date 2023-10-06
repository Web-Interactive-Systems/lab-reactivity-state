import { render, createElement } from './mini';
import { reactive } from './vini';

const initialState = {
  counter: 0,
  random: Math.random(),
};

const state = reactive(initialState);

/**
 Todo 1
 
 The reactive function should create a `reactive` js object
 that updates the DOM when the state changes.

 Currently, the reactive function is not working properly.
 Check the `vini.js` and follow the Todos inside it to make it work.
 
 */

/** @jsx createElement */
function App() {
  console.log(' render App state');

  return (
    <div>
      <button
        onClick={() => {
          state.value.counter += 1;
        }}>
        Increment: {state.value.counter}
      </button>{' '}
      <button
        onClick={() => {
          state.value.random = Math.random();
        }}>
        Randomize: {state.value.random}
      </button>
    </div>
  );
}
