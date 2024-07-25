import { io } from "socket.io-client";

// const URL = 'https://skupstina.azurewebsites.net/';
const URL =
  process.env.REACT_APP_SOCKET_URL ||
  "https://backend-eskupstina.azurewebsites.net/";

export const socket = io(URL);
