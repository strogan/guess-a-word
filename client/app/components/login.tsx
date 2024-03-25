import { SyntheticEvent, useEffect, useState } from 'react';
import socket from '../utils/socket';
import { decodeMessage } from '../utils/binaryProtocolUtils';

interface LoginFormProps {
    setLoggedIn: (value: { username: string; id: string }) => void;
}

export default function LoginForm({setLoggedIn}:LoginFormProps) {
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');

  const handleSubmit = (e:SyntheticEvent) => {
    e.preventDefault();
    if (password === '123') {
        
        socket.emit("login", login)
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  useEffect(() => {
    socket.on('userId', (data) => {
      const {id} = decodeMessage(data)
      setLoggedIn({username: login, id})
    });

    return () => {
      socket.off('userId');
    };
  }, [login]);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen items-center justify-between p-4 bg-gray-100">
        <div className="w-full">
            <h1 className="text-4xl font-bold mb-4">Guess a word game</h1>
            <h2 className="text-2xl">Write your invite password or 123 to find game</h2>
        </div>
        <form onSubmit={handleSubmit} className="w-full bg-white p-4 rounded shadow-md">
            <label>
            Login:
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} className="mt-1 p-2 w-full border rounded"/>
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-2 w-full border rounded"/>
          </label>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
    </div>
  );
}
