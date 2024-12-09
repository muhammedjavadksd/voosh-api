import { IProjectHelper, IUserRepo } from "../data/interface/abstractInterface";
import crypto from 'crypto'


class ProjectHelper implements IProjectHelper {


    private readonly userRepo: IUserRepo;


    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    async generateUserId(): Promise<string> {
        let index = 0
        let userId = `${crypto.randomBytes(16).toString('hex')}${index}`
        let findProfile = await this.userRepo.findProfileByUserId(userId);
        while (findProfile) {
            index++
            userId = `${crypto.randomBytes(16).toString('hex')}${index}`
            findProfile = await this.userRepo.findProfileByUserId(userId);
        }

        return userId;
    }
}

export default ProjectHelper