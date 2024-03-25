import useGetGames from "../hooks/useGetGames";
import useGetUsers from "../hooks/useGetUsers";

interface PlayerSelectionProps {
    login: string;
    myUserId: string;
    onSelectPlayer: (user: string) => void,
    onSelectGame: (gameID: string) => void
}

export default function PlayerSelection({ myUserId, onSelectPlayer, onSelectGame }: PlayerSelectionProps) {
    const users = useGetUsers();
    const usersList = Object.keys(users);
    
    const games = useGetGames()
    let gamesList
    if(games){
        const gamesListIds = Object.keys(games)
        gamesList = gamesListIds.map(gameId=>{
            const gameData = games[gameId]
            const gameName = `${users[gameData.player1]} vs ${users[gameData.player2]}, word: ${games[gameId].word}`
            return {gameId, gameName}
        })
    }


    return (
        <div className="flex">  
            <div className="w-1/2">
                <h2>Select player for a game:</h2>
            <ul className="list-none p-0">
                {usersList.map((userId) => (
                    <li
                        key={userId}
                        onClick={() => {
                            if (userId !== myUserId) {
                                onSelectPlayer(userId);
                            }}
                        }
                        className={`py-2 px-4 ${userId === myUserId ? 'bg-blue-100' : 'cursor-pointer hover:bg-gray-100'}`}
                    >
                        {userId === myUserId ? `${users[userId]} (you)` : users[userId]}
                    </li>
                ))}
            </ul>
            </div>
            

            <div className="w-1/2">
                <h2>Select game to watch:</h2>
                <ul className="list-none p-0">
                    {gamesList?.map((game) => (
                        <li
                            key={game.gameName}
                            onClick={()=>onSelectGame(game.gameId)}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                            {game.gameName}
                        </li>
                    ))}
                </ul>
            </div>
            
        </div>
    );
}

