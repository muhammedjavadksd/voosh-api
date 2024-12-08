import { Request, Response } from "express";
import { IUserService } from "../../../data/interface/abstractInterface";
import { CustomeHeader, HttpStatus } from "../../../data/interface/typeInterface";


export class UserController {


    private readonly userService: IUserService;


    constructor(userService: IUserService) {
        this.userService = userService;
    }


    async logout(req: CustomeHeader, res: Response): Promise<void> {
        const token: string | null = req.context?.token;
        if (token) {
            const logout = await this.userService.logout(token);
            res.status(logout.statusCode).json({ status: logout.statusCode, msg: logout.msg, data: logout.msg })
        } else {
            res.status(HttpStatus.UNAUTHORIZED).json({ status: false, msg: "Un authrazed access" })
        }
    }
}


