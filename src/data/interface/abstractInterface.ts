import { NextFunction, Request, Response } from "express";
import { ServiceResponse } from "./typeInterface";
import { IUserCollection, IUserSchema } from "./databaseModel";
import { ObjectId } from "mongoose";


export interface ITokenRepo {
    addToBlackList(token: string): Promise<string | false>
}

export interface IUserService {
    logout(token: string): Promise<ServiceResponse>
    signIn(emailAddress: string, password: string): Promise<ServiceResponse>
    signUp(emailAddress: string, password: string): Promise<ServiceResponse>
}

export interface IBcryptModule {
    bcrypt(data: string): Promise<string | null>
    compare(data: string, compareWith: string): Promise<boolean>
}


export interface IUserRepo {
    findUserByEmail(emailAddress: string): Promise<IUserCollection | null>
    insertUser(instance: Partial<IUserSchema>): Promise<ObjectId | null>
}

export interface ITokenModule {
    createToken(payload: Record<string, any>, expire: string): Promise<string | null>
    compareToken(token: string): Promise<Record<string, any> | null>
}

export interface IAuthMiddleware {
    isLogged(req: Request, res: Response, next: NextFunction): Promise<void>
}