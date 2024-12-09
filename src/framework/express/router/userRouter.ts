import express from 'express';
import { UserController } from '../controller/userController';
import { UserService } from '../../../service/userService';
import TokenRepo from '../../mongodb/repo/tokenRepo';
import AuthMiddleware from '../middleware/authMiddleware';
import JsonWebTokenModule from '../../../module/jsonwebtoken';
import BcryptModule from '../../../module/bcrypt';
import UserRepo from '../../mongodb/repo/userRepo';
import { addUserValidator, signInValidator, signUpValidator } from '../../../data/validator/express-validator';
import { validateRequest } from '../middleware/utilMiddleware';
import ProjectHelper from '../../../module/helper';
const userRouter = express.Router();

const tokenModule = new JsonWebTokenModule();
const tokenRepo = new TokenRepo()
const bcryptModule = new BcryptModule()
const userRepo = new UserRepo();
const helper = new ProjectHelper(userRepo);
const service = new UserService(tokenRepo, userRepo, bcryptModule, tokenModule, helper);
const router = new UserController(service)
const authMiddleware = new AuthMiddleware(tokenModule)

userRouter.get("/logout", authMiddleware.isLogged.bind(authMiddleware), router.logout);
userRouter.get("/users", authMiddleware.isLogged.bind(authMiddleware), router.logout);
userRouter.get("/:id", authMiddleware.isLogged.bind(authMiddleware), router.logout);

userRouter.post("/login", signInValidator, validateRequest, router.signIn);
userRouter.post("/signup", signUpValidator, validateRequest, router.signUp);
userRouter.post("/add-user", authMiddleware.isAdmin, addUserValidator, validateRequest, router.signUp);

userRouter.delete("/:id", authMiddleware.isAdmin, router.signUp);

userRouter.put("/update-password", authMiddleware.isLogged, router.signUp);

export default userRouter






