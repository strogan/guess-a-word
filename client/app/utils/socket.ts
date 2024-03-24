// socket.js
import io from 'socket.io-client'; 
import customParser from "socket.io-msgpack-parser";

const socket = io("http://localhost:3010",{parser: customParser});

export default socket;