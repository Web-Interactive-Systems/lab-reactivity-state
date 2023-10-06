import { useEffect, useState, render, createElement } from './mini';

/**
 Todo

 Explain how use stateState is implemented.

 ....
 */

/**
 Todo

 Explain the difference between stateState and reactive.

 ....
 */

/** @jsx createElement */
function App() {
  const [double, setDouble] = useState(1);
  const [triple, setTriple] = useState(3);

  console.log(' render App state');

  return (
    <div>
      <button onClick={() => setDouble(double * 2)}>Double: {double}</button>{' '}
      <button onClick={() => setTriple(triple * 3)}>Triple: {triple}</button>{' '}
    </div>
  );
}
