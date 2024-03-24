"use client"
import { useState } from 'react';

import LoginForm from './components/login';
import GameCreation from './components/gameCreation';

export default function Home() {

  const [loggedIn, setLoggedIn] = useState<[string, string]>(['','']);


  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      
      
      <div>
          {loggedIn[1] ? <GameCreation login={loggedIn[0]} id={loggedIn[1]} /> : <LoginForm setLoggedIn={setLoggedIn}/>}

    </div>

   
      

    </main>
  );
}
