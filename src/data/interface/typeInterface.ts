import { Request } from "express"
import { HttpStatus } from "../enum/utilEnum"

export interface IUserJwtPayload {
    email: string,
    user_id: string
}

export interface ServiceResponse {
    status: boolean,
    statusCode: HttpStatus,
    msg: string,
    data?: Record<string, any>
}


export interface CustomeHeader extends Request {
    context?: Record<string, any>
}