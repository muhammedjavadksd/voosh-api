import { ITokenBlackList } from '../../../data/interface/databaseModel'
import { model, Schema } from 'mongoose';

const collectionName = process.env.BLACK_TOKEN || "black-token"

const blackTokenSchema = new Schema<ITokenBlackList>({
    timestamp: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

const tokenCollection = model(collectionName, blackTokenSchema);
export default tokenCollection