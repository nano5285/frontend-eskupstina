import { io } from "socket.io-client";

// const URL = 'https://skupstina.azurewebsites.net/';
const URL =
  process.env.REACT_APP_SOCKET_URL ||
  // "https://backend-eskupstina.azurewebsites.net/";
"localhost:5005/"

export const socket = io(URL);
