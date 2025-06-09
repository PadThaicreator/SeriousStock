import { config } from "@/app/config";
import { io } from "socket.io-client";

const socket = io(config.apiBackend);

export default socket;
