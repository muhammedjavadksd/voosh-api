import { IUserRepo } from "../../../data/interface/abstractInterface";
import { IUserCollection, IUserSchema } from "../../../data/interface/databaseModel";
import userModel from "../models/userSchema";
import { ObjectId } from "mongoose";


class UserRepo implements IUserRepo {


    private readonly instance = userModel;

    async insertUser(instance: IUserSchema): Promise<ObjectId | null> {
        const object = new this.instance(instance);
        const user = await object.save();
        return user?.id
    }

    async findUserByEmail(emailAddress: string): Promise<IUserCollection | null> {
        const find = await this.instance.findOne({ email_id: emailAddress });
        return find
    }
}

export default UserRepo