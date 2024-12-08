import { HttpStatus, JwtExpiration } from "../data/enum/utilEnum";
import { IBcryptModule, ITokenModule, ITokenRepo, IUserRepo, IUserService } from "../data/interface/abstractInterface";
import { IUserJwtPayload, ServiceResponse } from "../data/interface/typeInterface";


export class UserService implements IUserService {


    private readonly tokenRepo: ITokenRepo;
    private readonly tokenModule: ITokenModule;
    private readonly userRepo: IUserRepo;
    private readonly bcryptModule: IBcryptModule;


    constructor(tokenRepo: ITokenRepo, userRepo: IUserRepo, bcryptModule: IBcryptModule, tokenModule: ITokenModule) {
        this.tokenRepo = tokenRepo;
        this.userRepo = userRepo;
        this.bcryptModule = bcryptModule;
        this.tokenModule = tokenModule
    }


    async signIn(emailAddress: string, password: string): Promise<ServiceResponse> {
        const findByEmail = await this.userRepo.findUserByEmail(emailAddress);
        if (findByEmail) {
            const comparePassword = await this.bcryptModule.compare(password, findByEmail.password);
            if (comparePassword) {
                const payload: IUserJwtPayload = {
                    email: emailAddress,
                    user_id: findByEmail.id
                }

                const accessToken = await this.tokenModule.createToken(payload, JwtExpiration.ACCESS_TOKEN);
                const refreshToken = await this.tokenModule.createToken(payload, JwtExpiration.REFRESH_TOKEN);

                if (refreshToken && accessToken) {
                    return {
                        status: true,
                        msg: "Loggin success",
                        statusCode: HttpStatus.OK,
                        data: {
                            access_token: accessToken,
                            refreshToken: refreshToken
                        }
                    }
                } else {
                    return {
                        status: false,
                        msg: "Internal server error",
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
                    }
                }
            } else {
                return {
                    status: false,
                    msg: "Incorrect password",
                    statusCode: HttpStatus.BAD_REQUEST
                }
            }
        } else {
            return {
                status: false,
                msg: "Email id not found",
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
    }


    async logout(token: string): Promise<ServiceResponse> {
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