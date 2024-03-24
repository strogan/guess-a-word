// useGetUsers.ts
import { useEffect, useState } from 'react';
import socket from '../utils/socket';
import { decodeMessage } from '../utils/binaryProtocolUtils';

interface Users {
  [key: string]: string;
}

export default function useGetUsers(){
  socket.emit("getUsers")
  const [users, setUsers] = useState<Users>({});

  useEffect(() => {
    socket.on('users', (data) => {
      const {users} = decodeMessage(data)
      setUsers(users);
    });

    return () => {
      socket.off('users');
    };
  }, []);

  return users;
}
