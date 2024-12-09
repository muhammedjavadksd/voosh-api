import { UserRole } from "../../../data/enum/utilEnum";
import { IUserRepo } from "../../../data/interface/abstractInterface";
import { IUserCollection, IUserSchema } from "../../../data/interface/databaseModel";
import { IPaginationResponse } from "../../../data/interface/typeInterface";
import userModel from "../models/userSchema";
import { ObjectId } from "mongoose";


class UserRepo implements IUserRepo {

    private readonly instance = userModel;


    async findProfileByUserId(userId: string): Promise<IUserCollection | null> {
        const find = await this.instance.findOne({ user_id: userId });
        return find
    }

    async updateProfile(profile: Partial<IUserCollection>, profileId: string): Promise<boolean> {
        const update = await this.instance.updateOne({ _id: profileId }, { $set: { ...profile } });
        return update.modifiedCount > 0
    }

    async deleteProfile(userId: string): Promise<boolean> {
        const deleteProfile = await this.instance.deleteOne({ _id: userId });
        return deleteProfile.deletedCount > 0
    }

    async findUserById(userId: string): Promise<IUserCollection | null> {
        const find = await this.instance.findById(userId);
        return find
    }

    async findUsers(offset: number | null, limit: number | null, role: UserRole | null): Promise<IPaginationResponse<IUserCollection>> {

        const matchStage = role ? { $match: { role } } : { $match: {} };

        const pipeline: any[] = [
            matchStage,
            ...(offset !== null && offset !== undefined ? [{ $skip: +offset }] : []),
            ...(limit !== null && limit !== undefined ? [{ $limit: +limit }] : [])
        ];

        const result = await this.instance.aggregate([
            {
                $facet: {
                    data: pipeline,
                    size: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        return {
            data: result[0].data,
            page: offset !== null && limit !== null ? Math.floor(+offset / +limit) + 1 : 1,
            size: result[0].size,
        };

    }

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