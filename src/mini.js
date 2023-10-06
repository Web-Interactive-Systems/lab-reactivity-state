// helpers functions
const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);
const doWork = () => {
  currentHook = 0;
  render();
};

// global vars
let hooks = [];
let currentHook = 0;

let _Component = null;
let _root = null;

export function reconcile(Component, root) {
  const type = Component.type;

  if (Array.isArray(Component)) {
    return Component.map((child) => reconcile(child, root));
  }

  const Comp = typeof type === 'string' ? Component : type();

  if (Comp.props && Comp.props.children) {
    Comp.props.children.forEach((child, idChild) => {
      if (child.type !== 'string') {
        // recursive call for children
        Comp.props.children[idChild] = reconcile(
          Comp.props.children[idChild],
          root,
        );
      }
    });
  }

  return Comp;
}

export function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // Change in properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // Event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

export function render(Component = _Component, root = _root) {
  // Clean up the root
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  const Comp = reconcile(Component, root);

  // keep some global refs
  _Component = Component;
  _root = root;

  // create dom
  const dom = createDom(Comp);

  // append dom to the root
  root.appendChild(dom);
}

export function useState(initialValue) {
  hooks[currentHook] = hooks[currentHook] || initialValue;

  const setStateHookIndex = currentHook;
  const setState = (newState) => {
    hooks[setStateHookIndex] = newState;

    // do some work when the state changes
    // here we re-render
    doWork();
  };

  return [hooks[currentHook++], setState];
}

export function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = hooks[currentHook];
  const hasChangedDeps = !deps || !depArray.every((el, i) => el === deps[i]);
  if (hasNoDeps || hasChangedDeps) {
    callback();
    hooks[currentHook] = depArray;
  }
  currentHook++;
}

export function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child),
      ),
    },
  };
}

export function createDom(treeFiber) {
  const dom =
    treeFiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(treeFiber.type);

  const props = treeFiber.props || {};

  updateDom(dom, {}, props);

  if (props.children) {
    props.children.forEach((child) => {
      // recursion
      if (Array.isArray(child)) {
        child.forEach((x) => {
          dom.appendChild(createDom(x));
        });
      } else {
        dom.appendChild(createDom(child));
      }
    });
  }

  return dom;
}
