import { nanoid } from 'nanoid';
import {
  keys,
  size,
  isEmpty,
  isEqual,
  forEach
} from 'lodash';

class AuthHUB {
  static create() {
    return new AuthHUB();
  }

  constructor() {
    this.subscriptions = {};
  }

  unsubscribe = (eventType, id) => () => {
    delete this.subscriptions[eventType][id];

    if (
      isEqual(size(keys(this.subscriptions[eventType])), 0)
    ) {
      delete this.subscriptions[eventType];
    }
  };

  subscribe = (eventType, callback) => {
    const id = nanoid();

    if (isEmpty(this.subscriptions[eventType])) {
      this.subscriptions[eventType] = {};
    }

    this.subscriptions[eventType][id] = callback;

    return {
      unsubscribe: this.unsubscribe(eventType, id)
    };
  };

  publish = (eventType, arg) => {
    if (!this.subscriptions[eventType]) return;

    forEach(keys(this.subscriptions[eventType]), key =>
      this.subscriptions[eventType][key](arg)
    );
  };
}

const authHUB = AuthHUB.create();

export { authHUB, AuthHUB };

export default authHUB;
