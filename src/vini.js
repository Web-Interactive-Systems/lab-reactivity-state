import { render } from './mini';

export const reactive = (initialState) => {
  // Todo1: learn more about
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  const subscribers = new Map();

  function subscribeKey(key, callback) {
    if (!subscribers.has(key)) {
      subscribers.set(key, []);
    }

    subscribers.get(key).push(callback);
  }

  function notify(key, value) {
    if (subscribers.has(key)) {
      subscribers.get(key).forEach(() => {
        // Todo5: a function call is missing here
      });
    }

    // Todo4: a function call is missing here
    // ?
  }

  //  Todo2: learn more about
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
  const value = new Proxy(initialState, {
    set(target, key, value) {
      target[key] = value;
      // there is a change

      // Todo3: a function call is missing here
      return true;
    },
    get(target, key) {
      // observe(key, (value) => {
      //   // noop
      // });
      return target[key];
    },
  });

  return {
    subscribeKey,
    value,
  };
};
