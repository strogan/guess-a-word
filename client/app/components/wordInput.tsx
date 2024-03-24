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
        <h2>Write word for a game</h2>
         <form id="form" onSubmit={handleSubmit}>
            <input id="input" value={word} onChange={(e) => setWord(e.target.value)} />
            <button type='submit'>Send</button>
        </form>
        </>
       
    );
}