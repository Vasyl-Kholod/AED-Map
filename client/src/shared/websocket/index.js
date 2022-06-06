import io from 'socket.io-client';

import { signOut } from 'shared/store/user/actions';
import store from '../store';

const socket = io('http://localhost:3000', {
  autoConnect: false
});

const socketAuthOpen = () => {
  const authorization = JSON.parse(
    localStorage.getItem('authorization')
  );
  const token = authorization && authorization.slice(7);

  socket.connect();

  socket.emit('authorization', token);
};

const socketAuthClose = () => {
  socket.disconnect();
};

socket.on('disconnect', () => {
  store.dispatch(signOut());
});

export { socketAuthOpen, socketAuthClose };
