import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import customParser from "socket.io-msgpack-parser";
import { decodeMessage, encodeMessage } from './utils/coder.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  },
  parser: customParser
});

const users = {};
const gameRooms = {};

io.on('connection', (socket) => {

  
  socket.on('login', (username) => {
    users[socket.id] = username;
    io.emit('users',  encodeMessage({users}) );
    io.to(socket.id).emit('userId',  encodeMessage({id: socket.id}) );
  });
  
  socket.on('getUsers', () => {
    io.emit('users',  encodeMessage({users}) );
  });

  socket.on('getGames', () => {
    io.emit('games',  encodeMessage({gameRooms}) );
  });

  socket.on('joinGameRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('disconnect', () => {
    delete users[socket.id]; 
    io.emit('users', encodeMessage({users}) );

    Object.keys(gameRooms).forEach((roomId) => {
      const room = gameRooms[roomId];
      if (room.player1 === socket.id || room.player2 === socket.id) {
        // If the disconnected player is in a game room, delete the room
        delete gameRooms[roomId];
      }
    });

  });

  socket.on('confirmGame', (data) => {
    const { player, word } = decodeMessage(data); 
    io.to(player).emit('gameRequest', encodeMessage({ from: users[socket.id], word }));
  });

  socket.on('gameResponse', (data) => {
    const { from, accept, word } = decodeMessage(data)
    const socketPlayerOneId = Object.keys(users).find(id => users[id] === from);
    if (accept) {
      const roomId = `${socketPlayerOneId}-${socket.id}`;
      gameRooms[roomId] = { player1: socketPlayerOneId, player2: socket.id , word };
      
      const socketPlayerOne = io.sockets.sockets.get(socketPlayerOneId);
      socketPlayerOne.join(roomId);
      socket.join(roomId);

      io.to(socketPlayerOneId).to(socket.id).emit('startGame', encodeMessage({ roomId, player1: users[socketPlayerOneId], player2: users[socket.id]}));
    } else {
      io.to(socketPlayerOneId).emit('gameDeclined');
    }
  });


  socket.on('gameMessage', (gameData) => {

    const { gameId, message, author } = decodeMessage(gameData)

    const {player1, player2, word} = gameRooms[gameId]

    if(message === word){
      io.to(gameId).emit('gameOver', encodeMessage({winner: users[player2]}));
      delete gameRooms[gameId];
    }
    const msg = encodeMessage({message, player1, author, authorName: users[author]})

    io.to(gameId).emit('gameMessage', msg);

  });
  
});

server.listen(3010, () => {
  console.log('server running at http://localhost:3010');
});
