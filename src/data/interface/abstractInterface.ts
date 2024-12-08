import { ServiceResponse } from "./typeInterface";


export interface ITokenRepo {
    addToBlackList(token: string): Promise<string | false>
}

export interface IUserService {
    logout(token: string): Promise<ServiceResponse>
}