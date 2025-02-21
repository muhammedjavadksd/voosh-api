import { HttpStatus, JwtExpiration, UserRole } from "../data/enum/utilEnum";
import { IBcryptModule, IProjectHelper, ITokenModule, ITokenRepo, IUserRepo, IUserService } from "../data/interface/abstractInterface";
import { IUserCollection } from "../data/interface/databaseModel";
import { IPaginationResponse, IUserJwtPayload, ServiceResponse } from "../data/interface/typeInterface";


export class UserService implements IUserService {


    private readonly tokenRepo: ITokenRepo;
    private readonly tokenModule: ITokenModule;
    private readonly userRepo: IUserRepo;
    private readonly bcryptModule: IBcryptModule;
    private readonly projectHelper: IProjectHelper;


    constructor(tokenRepo: ITokenRepo, userRepo: IUserRepo, bcryptModule: IBcryptModule, tokenModule: ITokenModule, helper: IProjectHelper) {
        this.signUp = this.signUp.bind(this);
        this.signIn = this.signIn.bind(this);
        this.logout = this.logout.bind(this);
        this.tokenRepo = tokenRepo;
        this.userRepo = userRepo;
        this.bcryptModule = bcryptModule;
        this.tokenModule = tokenModule
        this.projectHelper = helper
    }


    async updatePassword(password: string, profileId: string): Promise<ServiceResponse<null>> {

        const bcrypt = await this.bcryptModule.bcrypt(password);
        if (bcrypt) {
            const updatePassword = await this.userRepo.updateProfile({ password: bcrypt }, profileId);
            if (updatePassword) {
                return {
                    msg: "Profile updated success",
                    status: true,
                    statusCode: HttpStatus.OK
                }
            } else {
                return {
                    msg: "Profile updated failed",
                    status: false,
                    statusCode: HttpStatus.BAD_REQUEST
                }
            }
        } else {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            }
        }
    }


    async deleteProfile(userId: string): Promise<ServiceResponse<null>> {
        const deleteProfile = await this.userRepo.deleteProfile(userId);
        if (deleteProfile) {
            return {
                msg: "Profile delete success",
                status: true,
                statusCode: HttpStatus.OK
            }
        } else {
            return {
                msg: "Data not found",
                status: false,
                statusCode: HttpStatus.NOT_FOUND
            }
        }
    }


    async findSingleUser(profileId: string): Promise<ServiceResponse<IUserCollection>> {
        const profile: IUserCollection | null = await this.userRepo.findUserById(profileId);
        if (profile) {
            return {
                msg: "User found success",
                status: true,
                statusCode: HttpStatus.OK,
                data: profile
            }
        } else {
            return {
                msg: "Not found",
                status: false,
                statusCode: HttpStatus.NOT_FOUND,
            }
        }
    }

    async addUser(emailAddress: string, password: string, role: UserRole): Promise<ServiceResponse<null>> {

        const findByEmailId = await this.userRepo.findUserByEmail(emailAddress);
        if (findByEmailId) {
            return {
                msg: "Email id already exist",
                status: false,
                statusCode: HttpStatus.CONFLICT
            }
        }
        const bcrypt = await this.bcryptModule.bcrypt(password);
        if (bcrypt) {
            const userId = await this.projectHelper.generateUserId();
            await this.userRepo.insertUser({ email_id: emailAddress, password: bcrypt, role: role, user_id: userId });
            return {
                msg: "User created success",
                status: true,
                statusCode: HttpStatus.CREATED
            }
        } else {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            }
        }
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
                const userId: string = await this.projectHelper.generateUserId();
                const insert = await this.userRepo.insertUser({ email_id: emailAddress, password: bcryptPassword, role: UserRole.Viewer, user_id: userId })
                return {
                    msg: insert ? "Sign up success" : "Internal server error",
                    status: !!insert,
                    statusCode: insert ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR
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
                    console.log("Worked");
                    console.log(accessToken);
                    console.log(refreshToken);

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
                statusCode: HttpStatus.NOT_FOUND
            }
        }
    }


    async logout(token: string): Promise<ServiceResponse<null>> {
        console.log("Invoke");

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