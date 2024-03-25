"use client"
import { useState } from 'react';

import LoginForm from './components/login';
import GameCreation from './components/gameCreation';


export default function Home() {

  const [loggedIn, setLoggedIn] = useState<{ username: string; id: string }>({ username: '', id: '' });


  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      
      
      <div>
          {loggedIn.id ? <GameCreation login={loggedIn.username} id={loggedIn.id} /> : <LoginForm setLoggedIn={setLoggedIn}/>}

    </div>

   
      

    </main>
  );
}
