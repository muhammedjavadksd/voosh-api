import { HttpStatus, JwtExpiration, UserRole } from "../data/enum/utilEnum";
import { IBcryptModule, ITokenModule, ITokenRepo, IUserRepo, IUserService } from "../data/interface/abstractInterface";
import { IUserCollection } from "../data/interface/databaseModel";
import { IPaginationResponse, IUserJwtPayload, ServiceResponse } from "../data/interface/typeInterface";


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


    async getUsers(offset: number | null, limit: number | null, role: UserRole | null): Promise<ServiceResponse<IPaginationResponse<IUserCollection>>> {

        const findUsers = await this.userRepo.findUsers(offset, limit, role);
        if (findUsers.size) {
            return {
                msg: "User fetch success",
                status: true,
                statusCode: HttpStatus.OK,
                data: findUsers
            }
        } else {
            return {
                msg: "No data found",
                status: false,
                statusCode: HttpStatus.NOT_FOUND,
            }
        }
    }


    async signUp(emailAddress: string, password: string): Promise<ServiceResponse<null>> {
        const findByEmailId = await this.userRepo.findUserByEmail(emailAddress);
        if (!findByEmailId) {
            const bcryptPassword = await this.bcryptModule.bcrypt(password);
            if (bcryptPassword) {
                const insert = await this.userRepo.insertUser({ email_id: emailAddress, password: bcryptPassword, role: UserRole.Viewer })
                return {
                    msg: insert ? "Sign up success" : "Internal server error",
                    status: !!insert,
                    statusCode: insert ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR
                }
            }
            return {
                msg: "Internal server error",
                status: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            }
        } else {
            return {
                msg: "Email id already exist",
                status: false,
                statusCode: HttpStatus.CONFLICT
            }
        }
    }


    async signIn(emailAddress: string, password: string): Promise<ServiceResponse<Record<string, any>>> {
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


    async logout(token: string): Promise<ServiceResponse<null>> {
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