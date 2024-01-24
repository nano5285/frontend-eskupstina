import { io } from 'socket.io-client';

// const URL = 'https://skupstina.azurewebsites.net/';
const URL = 'http://45.84.0.116:4000/';


export const socket = io(URL);