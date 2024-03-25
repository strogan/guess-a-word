import { decodeMessage , encodeMessage} from "../utils/binaryProtocolUtils"
import { SyntheticEvent, useEffect, useState } from "react"
import socket from "../utils/socket"

interface GameProps {
  gameId:any,
  onGameOver: () => void
  player: string, 
  word: string
}
 
export default function Game({gameId, player, word, onGameOver}:GameProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{message: string, author: string, host: boolean}[]>([])

  const handleSubmit = (e:SyntheticEvent) => {
    e.preventDefault()
    const data = encodeMessage({gameId, message, author: player })
    socket.emit("gameMessage",data)
    setMessage('')
  }

  useEffect(()=>{
    socket.on('gameMessage', (data) => {
        const {message, player1, author} = decodeMessage(data)
        setMessages(prevMessages => [...prevMessages, { message, author, host: player1===author }]);
    });

    socket.on('gameOver', (data) => {
      const {winner} = decodeMessage(data)
      alert(winner + " won")
      onGameOver()
    });


    return ()=>{
        socket.off('gameMessage');
        socket.off('gameOver');
    }
  },[messages])

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Welcome to Guess a word game, {player}</h1>
      <h2>{word ? `Selected word:${word}, can write hint in chat` : "Write your guess"}</h2>
      <div className="flex flex-col gap-4">
        <form id="form" onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input id="input" value={message} onChange={(e)=>setMessage(e.target.value)} className="border p-2 rounded"/>
          <button type='submit' className="bg-blue-500 text-white p-2 rounded">Send</button>
        </form>

        <ul className="border p-4 rounded overflow-auto h-64">
          {messages.map((message,idx)=>(
            <li key={idx} className="mb-2">
              <span className={message.host ? "font-bold text-blue-500" : "font-bold"}>
                {message.author}:</span> {message.message}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}