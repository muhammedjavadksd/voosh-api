import { Request, Response } from "express";
import { IUserService } from "../../../data/interface/abstractInterface";
import { CustomeHeader } from "../../../data/interface/typeInterface";
import { CookiePair, HttpStatus, UserRole } from "../../../data/enum/utilEnum";


export class UserController {


    private readonly userService: IUserService;


    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async addUser(req: Request, res: Response): Promise<void> {

        const emailAddress: string = req.body.email_address;
        const password: string = req.body.password;
        const role: UserRole = req.body.role;

        const add = await this.userService.addUser(emailAddress, password, role);
        res.status(add.statusCode).json({ status: add.status, msg: add.msg })
    }


    async getUsers(req: Request, res: Response): Promise<void> {

        const limit: number | null = req.query.limit as unknown as number
        const offset: number | null = req.query.offset as unknown as number
        const role: UserRole | null = req.query.role as UserRole;

        const findUsers = await this.userService.getUsers(offset, limit, role)
        res.status(findUsers.statusCode).json({ status: findUsers.status, msg: findUsers.msg, data: findUsers.data });
    }


    async signUp(req: Request, res: Response): Promise<void> {
        const password: string = req.body.password
        const email: string = req.body.email

        try {
            const signUp = await this.userService.signUp(email, password);
            res.status(signUp.statusCode).json({ status: signUp.status, msg: signUp.msg, data: signUp.data })
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, msg: "Internal server error" })
        }
    }

    async signIn(req: Request, res: Response): Promise<void> {

        const password: string = req.body.password
        const email: string = req.body.email

        try {
            const signIn = await this.userService.signIn(email, password);
            res.status(signIn.statusCode).json({ status: signIn.status, msg: signIn.msg, data: signIn.data })
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, msg: "Internal server error" })
        }
    }

    async logout(req: CustomeHeader, res: Response): Promise<void> {
        const token: string | null = req.context?.token;
        if (token) {
            const logout = await this.userService.logout(token);
            res.clearCookie(CookiePair.accessToken, { httpOnly: true, secure: true })
            res.clearCookie(CookiePair.refreshToken, { httpOnly: true, secure: true })
            res.status(logout.statusCode).json({ status: logout.statusCode, msg: logout.msg, data: logout.msg })
        } else {
            res.status(HttpStatus.UNAUTHORIZED).json({ status: false, msg: "Un authrazed access" })
        }
    }
}


