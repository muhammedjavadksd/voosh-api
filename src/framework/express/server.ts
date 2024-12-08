import userRouter from './router/userRouter';
import { errorHandle, notFound } from './middleware/utilMiddleware';
import { Express } from 'express';
import express from 'express';



export function startServer(app: Express, port: number) {

    return function () {


        app.use(express.json({}))
        app.use(express.urlencoded({ extended: true }))


        app.use("/user", userRouter)

        app.use(notFound)
        app.use(errorHandle)


        app.listen(port, () => {
            console.log(`Server started at port ${port}`);
        })
    }
}