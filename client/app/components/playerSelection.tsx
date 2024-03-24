interface PlayerSelectionProps {
    users: { [key: string]: string };
    login: string;
    myUserId: string;
    onSelectPlayer: (user: string) => void;
}

export default function PlayerSelection({ users, login, myUserId, onSelectPlayer }: PlayerSelectionProps) {

    const usersList = Object.keys(users);


    return (
        <>
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
        </>
    );
}

