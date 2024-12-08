import { ITokenRepo } from "../../../data/interface/abstractInterface";
import { ServiceResponse } from "../../../data/interface/typeInterface";
import tokenCollection from "../models/tokenBlacklist";


export default class TokenRepo implements ITokenRepo {

    private readonly dbInstance = tokenCollection


    async addToBlackList(token: string): Promise<string | false> {
        const instance = new this.dbInstance({ timestamp: new Date(), token: token });
        const save = await instance.save();
        return save?.id
    }
}