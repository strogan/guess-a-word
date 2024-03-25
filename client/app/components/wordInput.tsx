import { SyntheticEvent, useState } from "react";

export default function WordInput({ onSubmit }: { onSubmit: (word: string) => void }) {
    const [word, setWord] = useState('');

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        onSubmit(word);
        setWord('');
    };

    return (
        <>
        <h1>Write word for a game</h1>
         <form id="form" onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input id="input" value={word} onChange={(e) => setWord(e.target.value)} className="border p-2 rounded"/>
            <button type='submit' className="bg-blue-500 text-white p-2 rounded">Send</button>
        </form>
        </>
       
    );
}