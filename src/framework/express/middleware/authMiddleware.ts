import { NextFunction, Request, Response } from "express";
import { IAuthMiddleware, ITokenModule } from "../../../data/interface/abstractInterface";
import { HttpStatus, UserRole } from "../../../data/enum/utilEnum";



class AuthMiddleware implements IAuthMiddleware {


    private readonly tokenModule: ITokenModule;


    constructor(tokenModule: ITokenModule) {
        this.tokenModule = tokenModule;
    }


    async isAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const headerToken = req.headers['authorization'];
            if (headerToken && headerToken.startsWith("Bearer")) {
                const token = headerToken.split(" ")[1];
                if (token) {
                    const decode = await this.tokenModule.compareToken(token);
                    if (decode && decode.role == UserRole.Admin) {
                        return next()
                    } else {
                        res.status(HttpStatus.FORBIDDEN).json({ status: false, msg: "Forbidden" })
                        return;
                    }
                }
            }
            res.status(HttpStatus.UNAUTHORIZED).json({ status: false, msg: "Un authrazied access" })
        } catch (e) {
            console.log(e);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, msg: "Internal server error" });
        }
    }

    async isLogged(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const headerToken = req.headers['authorization'];
            if (headerToken && headerToken.startsWith("Bearer")) {
                const token = headerToken.split(" ")[1];
                if (token) {
                    const decode = await this.tokenModule.compareToken(token);
                    if (decode) {
                        return next()
                    }
                }
            }
            res.status(HttpStatus.UNAUTHORIZED).json({ status: false, msg: "Un authrazied access" })
        } catch (e) {
            console.log(e);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, msg: "Internal server error" });
        }
    }
}


export default AuthMiddleware