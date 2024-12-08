import { ITokenRepo } from "../data/interface/abstractInterface";
import { HttpStatus, ServiceResponse } from "../data/interface/typeInterface";


export class UserService {


    private readonly tokenRepo: ITokenRepo;


    constructor(tokenRepo: ITokenRepo) {
        this.tokenRepo = tokenRepo;
    }


    async logout(token): Promise<ServiceResponse> {
        try {
            const block = await this.tokenRepo.addToBlackList(token);
            return {
                msg: block ? "Logout success" : "Logout failed",
                status: !!block,
                statusCode: block ? HttpStatus.OK : HttpStatus.BAD_REQUEST
            }
        } catch (e) {
            return {
                status: false,
                msg: "Something went wrong",
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            }
        }
    }
}