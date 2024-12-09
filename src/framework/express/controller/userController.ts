import { Request, Response } from "express";
import { IUserService } from "../../../data/interface/abstractInterface";
import { CustomeHeader } from "../../../data/interface/typeInterface";
import { CookiePair, HttpStatus, UserRole } from "../../../data/enum/utilEnum";


export class UserController {


    private readonly userService: IUserService;


    constructor(userService: IUserService) {
        this.signUp = this.signUp.bind(this)
        this.userService = userService;
    }


    async updatePassword(req: CustomeHeader, res: Response): Promise<void> {
        const password = req.body.password;
        const profileId = req.context?.profileId;

        const updatePassword = await this.userService.updatePassword(password, profileId);
        res.status(updatePassword.statusCode).json({
            status: updatePassword.statusCode,
            message: updatePassword.msg,
            data: updatePassword.data,
            error: !updatePassword.status ? updatePassword.msg : null
        })
    }


    async findSingleUser(req: Request, res: Response): Promise<void> {
        const userId: string = req.query.id as string;
        const findProfile = await this.userService.findSingleUser(userId);
        res.status(findProfile.statusCode).json({
            status: findProfile.statusCode,
            message: findProfile.msg,
            data: findProfile.data,
            error: !findProfile.status ? findProfile.msg : null
        })
    }

    async addUser(req: Request, res: Response): Promise<void> {

        const emailAddress: string = req.body.email_address;
        const password: string = req.body.password;
        const role: UserRole = req.body.role;

        const add = await this.userService.addUser(emailAddress, password, role);
        res.status(add.statusCode).json({
            status: add.statusCode,
            message: add.msg,
            error: !add.status ? add.msg : null,
            data: null
        })
    }


    async getUsers(req: Request, res: Response): Promise<void> {

        const limit: number | null = req.query.limit as unknown as number
        const offset: number | null = req.query.offset as unknown as number
        const role: UserRole | null = req.query.role as UserRole;

        const findUsers = await this.userService.getUsers(offset, limit, role)
        res.status(findUsers.statusCode).json({
            status: findUsers.statusCode,
            message: findUsers.msg,
            data: findUsers.data,
            error: !findUsers.status ? findUsers.msg : null
        });
    }


    async signUp(req: Request, res: Response): Promise<void> {
        const password: string = req.body.password
        const email: string = req.body.email


        console.log("Request body");
        console.log(req.body);


        try {
            const signUp = await this.userService.signUp(email, password);
            res.status(signUp.statusCode).json({
                status: signUp.statusCode,
                message: signUp.msg,
                data: signUp.data,
                error: !signUp.status ? signUp.msg : null
            })
        } catch (e) {
            console.log(e);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
                error: "Internal server error",
                data: null
            })
        }
    }

    async signIn(req: Request, res: Response): Promise<void> {

        const password: string = req.body.password
        const email: string = req.body.email

        try {
            const signIn = await this.userService.signIn(email, password);
            res.status(signIn.statusCode).json({
                status: signIn.statusCode,
                message: signIn.msg,
                data: signIn.data,
                error: !signIn.status ? signIn.msg : null
            })
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
                data: null,
                error: "Internal server error"
            })
        }
    }

    async logout(req: CustomeHeader, res: Response): Promise<void> {
        const token: string | null = req.context?.token;
        if (token) {
            const logout = await this.userService.logout(token);
            res.clearCookie(CookiePair.accessToken, { httpOnly: true, secure: true })
            res.clearCookie(CookiePair.refreshToken, { httpOnly: true, secure: true })
            res.status(logout.statusCode).json({
                status: logout.statusCode,
                message: logout.msg,
                data: logout.msg,
                error: !logout.status ? logout.msg : null
            })
        } else {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: "Un authrazed access",
                error: "Un authrazed access",
                data: null
            })
        }
    }
}


