import { useEffect, useState } from 'react';
import socket from '../utils/socket';
import { decodeMessage } from '../utils/binaryProtocolUtils';

interface gameRoomId{
    player1: string;
    player2: string;
    word: string;
}
interface Games {
  [key: string]: gameRoomId;
}

export default function useGetGames(){
  socket.emit("getGames")
  const [games, setGames] = useState<Games | null>(null);

  useEffect(() => {
    socket.on('games', (data) => {
      const {gameRooms} = decodeMessage(data)
      setGames(gameRooms);
    });

    return () => {
      socket.off('games');
    };
  }, []);

  return games;
}
