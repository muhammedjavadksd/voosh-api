import { NextFunction, Request, Response } from "express";
import { ServiceResponse } from "./typeInterface";


export interface ITokenRepo {
    addToBlackList(token: string): Promise<string | false>
}

export interface IUserService {
    logout(token: string): Promise<ServiceResponse>
}


export interface ITokenModule {
    createToken(payload: Record<string, any>, expire: string): Promise<string | null>
    compareToken(token: string): Promise<Record<string, any> | null>
}

export interface IAuthMiddleware {
    isLogged(req: Request, res: Response, next: NextFunction): Promise<void>
}