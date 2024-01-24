import { io } from 'socket.io-client';

// const URL = 'https://skupstina.azurewebsites.net/';
const URL = process.env.SOCKET_URL || 'http://52.158.47.57:4000/';


export const socket = io(URL);