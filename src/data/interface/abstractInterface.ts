import { NextFunction, Request, Response } from "express";
import { IPaginationResponse, ServiceResponse } from "./typeInterface";
import { IUserCollection, IUserSchema } from "./databaseModel";
import { ObjectId } from "mongoose";
import { UserRole } from "../enum/utilEnum";


export interface ITokenRepo {
    addToBlackList(token: string): Promise<string | false>
}

export interface IUserService {
    logout(token: string): Promise<ServiceResponse<null>>
    signIn(emailAddress: string, password: string): Promise<ServiceResponse<Record<string, any>>>
    signUp(emailAddress: string, password: string): Promise<ServiceResponse<null>>
    getUsers(offset: number | null, limit: number | null, role: UserRole | null): Promise<ServiceResponse<IPaginationResponse<IUserCollection>>>
    addUser(emailAddress: string, password: string, role: UserRole): Promise<ServiceResponse<null>>
}

export interface IBcryptModule {
    bcrypt(data: string): Promise<string | null>
    compare(data: string, compareWith: string): Promise<boolean>
}

export interface IUserRepo {
    findUserByEmail(emailAddress: string): Promise<IUserCollection | null>
    insertUser(instance: Partial<IUserSchema>): Promise<ObjectId | null>
    findUsers(offset: number | null, limit: number | null, role: UserRole | null): Promise<IPaginationResponse<IUserCollection>>
}

export interface ITokenModule {
    createToken(payload: Record<string, any>, expire: string): Promise<string | null>
    compareToken(token: string): Promise<Record<string, any> | null>
}

export interface IAuthMiddleware {
    isLogged(req: Request, res: Response, next: NextFunction): Promise<void>
}