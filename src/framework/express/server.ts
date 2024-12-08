import express from 'express';
import userRouter from './router/userRouter';
import { errorHandle, notFound } from './middleware/utilMiddleware';

const app = express();

export function startServer() {

    const PORT = process.env.PORT || 8000

    app.use(express.json({}))
    app.use(express.urlencoded({ extended: true }))


    app.use("/user", userRouter)

    app.use(notFound)
    app.use(errorHandle)


    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    })
}