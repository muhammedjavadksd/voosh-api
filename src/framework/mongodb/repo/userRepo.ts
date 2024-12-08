import { IUserRepo } from "../../../data/interface/abstractInterface";
import { IUserCollection } from "../../../data/interface/databaseModel";
import userModel from "../models/userSchema";




class UserRepo implements IUserRepo {


    private readonly instance = userModel;

    async findUserByEmail(emailAddress: string): Promise<IUserCollection | null> {
        const find = await this.instance.findOne({ email_id: emailAddress });
        return find
    }
}

export default UserRepo