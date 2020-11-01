import socketio from 'socket.io-client';

const socket = socketio('http://localhost:3333', {
  withCredentials:false,
  autoConnect:false,
});

function keepOnTrack(keepOnTrackFunction) {
  socket.on('currentTrack', keepOnTrackFunction)
}

function connect(){
  socket.connect();
}

function disconnect(){
  if (socket.connected)
    socket.disconnect();
}

export {
  connect,
  disconnect,
  keepOnTrack
}
