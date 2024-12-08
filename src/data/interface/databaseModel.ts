import { UserRole } from "../enum/utilEnum"



export interface IUserSchema {
    user_id: string,
    email_id: string
    password: string
    role: UserRole
}

export interface ITokenBlackList {
    token: string
    timestamp: string
}