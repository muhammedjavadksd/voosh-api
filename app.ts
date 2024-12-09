import express from 'express';
import dotenv from 'dotenv';
import { startServer } from './src/framework/express/server';
import { mongodbConnection } from './src/framework/mongodb/connection';

dotenv.config()
const port: number = parseInt(process.env.PORT || '8000', 10);
console.log(process.env.MONGO_URL);

const mognoUrl: string = process.env.MONGO_URL || ""
const app = express();
const server = startServer(app, port);

mongodbConnection(mognoUrl).then(() => {
    server()
}).catch((err) => {
    process.exit(1)
})
