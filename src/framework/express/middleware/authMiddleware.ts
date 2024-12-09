import { NextFunction, Request, Response } from "express";
import { IAuthMiddleware, ITokenModule, ITokenRepo } from "../../../data/interface/abstractInterface";
import { HttpStatus, UserRole } from "../../../data/enum/utilEnum";
import { CustomeHeader } from "../../../data/interface/typeInterface";



class AuthMiddleware implements IAuthMiddleware {


    private readonly tokenModule: ITokenModule;
    private readonly tokenRepo: ITokenRepo;


    constructor(tokenModule: ITokenModule, tokenRepo: ITokenRepo) {
        this.tokenModule = tokenModule;
        this.tokenRepo = tokenRepo;
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

    async isLogged(req: CustomeHeader, res: Response, next: NextFunction): Promise<void> {

        try {
            const headerToken = req.headers['authorization'];
            console.log("Header token");
            console.log(headerToken);

            if (headerToken && headerToken.startsWith("Bearer")) {

                const token = headerToken.split(" ")[1];
                if (token) {
                    const isBlock: boolean = await this.tokenRepo.isExist(token);
                    if (isBlock) {
                        res.status(HttpStatus.UNAUTHORIZED).json({ status: false, msg: "Un authrazied access" })
                    }
                    const decode = await this.tokenModule.compareToken(token);

                    if (decode) {
                        console.log("Next");
                        req.context = {
                            token
                        }
                        next()
                        return;
                    }
                }
            }

            console.log("Un authrazied access");
            res.status(HttpStatus.UNAUTHORIZED).json({ status: false, msg: "Un authrazied access" })
        } catch (e) {
            console.log(e);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, msg: "Internal server error" });
        }
    }
}


export default AuthMiddleware