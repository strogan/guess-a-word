import { useEffect, useState } from "react";
import useGetUsers from "../hooks/useGetUsers";
import WordInput from "./wordInput";
import PlayerSelection from "./playerSelection";
import socket from "../utils/socket";
import { decodeMessage, encodeMessage } from "../utils/binaryProtocolUtils";
import Game from "./game";


export default function gameCreation({ login, id }: { login: string, id: string}) {
    const users  = useGetUsers();
    const [me, setMe] = useState('')
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [gameRequestFrom, setGameRequestFrom] = useState('');
    const [word, setWord] = useState('')
    const [gameId, setGameId] = useState<string | null>(null);

    const handleSelectPlayer = (user: string) => {
        setSelectedPlayer(user);
        
    };

    const handleWordSubmit = (word: string) => {

        setWord(word)

        const buf = encodeMessage({ player: selectedPlayer, word })       

        socket.emit("confirmGame", buf);
    };

    useEffect(() => {



        socket.on('gameRequest', (data) => {
            const {from, word} = decodeMessage(data)
            setGameRequestFrom(from);
            setWord(word);
        });

        socket.on('startGame', (gameData) => {
            const {roomId, player1, player2} = decodeMessage(gameData)
            setGameId(roomId)
            setMe(player1 === login ? player1 : player2);
        });

        socket.on('gameDeclined', () => {
            setSelectedPlayer(null)
            alert('The other player declined your game request.');
        });

        return () => {
            socket.off('gameRequest');
            socket.off('startGame');
            socket.off('gameDeclined');
        };
    }, []);

    const handleDecline = () => {
        console.log("Decline")
        socket.emit('gameResponse', encodeMessage({ from: gameRequestFrom, accept: false }));
        setGameRequestFrom('');
    };

    const handleAccept = () => {
        console.log("Accept")
        socket.emit('gameResponse', encodeMessage({ from: gameRequestFrom, accept: true, word }));
        setGameRequestFrom('');
    };
    const handleGameOver = () => {
        setSelectedPlayer(null)
        setGameId(null)
    }
    const renderGameCreation = () => {
        return selectedPlayer ? (
            <WordInput onSubmit={handleWordSubmit} />
        ) : (
            <PlayerSelection users={users} login={login} myUserId={id} onSelectPlayer={handleSelectPlayer} />
        )
    }
    return (
        <>
            {!gameId ? renderGameCreation() : <Game gameId={gameId} onGameOver={handleGameOver} player={me} word={selectedPlayer ? word : ''}/>}
            {gameRequestFrom && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2>Do you want to play the game with {gameRequestFrom}?</h2>
                        <div className="flex justify-around mt-4">
                            <button aria-label="Decline game" onClick={handleDecline}>No</button>
                            <button aria-label="Accept game" onClick={handleAccept}>Yes</button>
                        </div>
                        
                    </div>
                </div>
            )}
            
        </>
    );
}
