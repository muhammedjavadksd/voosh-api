import express from 'express';
import { UserController } from '../controller/userController';
import { UserService } from '../../../service/userServer';
import TokenRepo from '../../mongodb/repo/tokenRepo';
import AuthMiddleware from '../middleware/authMiddleware';
import JsonWebTokenModule from '../../../module/jsonwebtoken';
import BcryptModule from '../../../module/bcrypt';
import UserRepo from '../../mongodb/repo/userRepo';
import { signInValidator, signUpValidator } from '../../../data/validator/express-validator';
import { validateRequest } from '../middleware/utilMiddleware';
const userRouter = express.Router();

const tokenModule = new JsonWebTokenModule();
const tokenRepo = new TokenRepo()
const bcryptModule = new BcryptModule()
const userRepo = new UserRepo();
const service = new UserService(tokenRepo, userRepo, bcryptModule, tokenModule);
const router = new UserController(service)
const authMiddleware = new AuthMiddleware(tokenModule)

userRouter.get("/logout", authMiddleware.isLogged.bind(authMiddleware), router.logout);
userRouter.post("/login", signInValidator, validateRequest, router.signIn);
userRouter.post("/signup", signUpValidator, validateRequest, router.signUp);

export default userRouter






