import { NextFunction, Request, Response } from "express";
import { ServiceResponse } from "./typeInterface";
import { IUserCollection } from "./databaseModel";


export interface ITokenRepo {
    addToBlackList(token: string): Promise<string | false>
}

export interface IUserService {
    logout(token: string): Promise<ServiceResponse>
    signIn(emailAddress: string, password: string): Promise<ServiceResponse>
}


export interface IUserRepo {
    findUserByEmail(emailAddress: string): Promise<IUserCollection | null>
}

export interface ITokenModule {
    createToken(payload: Record<string, any>, expire: string): Promise<string | null>
    compareToken(token: string): Promise<Record<string, any> | null>
}

export interface IAuthMiddleware {
    isLogged(req: Request, res: Response, next: NextFunction): Promise<void>
}