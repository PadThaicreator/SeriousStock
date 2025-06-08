import { io } from "socket.io-client";

const socket = io("https://seriousstock-production-dcef.up.railway.app");

export default socket;
