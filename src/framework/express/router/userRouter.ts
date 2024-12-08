import express from 'express';
import { UserController } from '../controller/userController';
import { UserService } from '../../../service/userServer';
import TokenRepo from '../../mongodb/repo/tokenRepo';
import AuthMiddleware from '../middleware/authMiddleware';
const userRouter = express.Router();


const tokenRepo = new TokenRepo()
const service = new UserService(tokenRepo);
const router = new UserController(service)

const tokenModule = new Token
const authMiddleware = new AuthMiddleware()

userRouter.post("/logout", router.logout);
export default userRouter






