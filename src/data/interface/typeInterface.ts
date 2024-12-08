import { Request } from "express"
import { HttpStatus } from "../enum/utilEnum"

export interface IUserJwtPayload {
    email: string,
    user_id: string
}

export interface ServiceResponse<T> {
    status: boolean,
    statusCode: HttpStatus,
    msg: string,
    data?: T
}


export interface CustomeHeader extends Request {
    context?: Record<string, any>
}


export interface IPaginationResponse<T> {
    data: T[],
    page: number,
    size: number
}