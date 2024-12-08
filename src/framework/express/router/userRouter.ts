import express from 'express';
import { UserController } from '../controller/userController';
import { UserService } from '../../../service/userServer';
import TokenRepo from '../../mongodb/repo/tokenRepo';
const userRouter = express.Router();


const tokenRepo = new TokenRepo()
const service = new UserService(tokenRepo);
const router = new UserController(service)

userRouter.post("/logout", router.logout);
export default userRouter






