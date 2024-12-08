import { startServer } from "./framework/express/server";
import express from 'express';
import dotenv from 'dotenv';


dotenv.config({ path: "./.env" })
const port: number = parseInt(process.env.PORT || '8000', 10);
const app = express();
const server = startServer(app, port);


server()