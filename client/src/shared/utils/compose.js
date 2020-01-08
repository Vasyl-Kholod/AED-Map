import {
  size,
  first,
  reduce,
  isEqual,
  isEmpty
} from 'lodash';

const compose = (...funcs) => {
  if (isEmpty(funcs)) {
    // infer the argument type so it is usable in inference down the line
    return arg => arg;
  }

  if (isEqual(size(funcs), 1)) {
    return first(funcs);
  }

  return reduce(funcs, (a, b) => (...args) =>
    a(b(...args))
  );
};

export default compose;
