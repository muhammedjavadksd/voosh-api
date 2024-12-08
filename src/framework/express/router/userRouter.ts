import express from 'express';
import { UserController } from '../controller/userController';
import { UserService } from '../../../service/userServer';
import TokenRepo from '../../mongodb/repo/tokenRepo';
import AuthMiddleware from '../middleware/authMiddleware';
import JsonWebTokenModule from '../../../module/jsonwebtoken';
const userRouter = express.Router();


const tokenRepo = new TokenRepo()
const service = new UserService(tokenRepo);
const router = new UserController(service)

const tokenModule = new JsonWebTokenModule();
const authMiddleware = new AuthMiddleware(tokenModule)

userRouter.get("/logout", authMiddleware.isLogged.bind(authMiddleware), router.logout);
userRouter.post("/sign", authMiddleware.isLogged.bind(authMiddleware), router.logout);

export default userRouter






