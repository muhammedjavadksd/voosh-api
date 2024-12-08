import { IUserCollection, IUserSchema } from '../../../data/interface/databaseModel'
import { UserRole } from '../../../data/enum/utilEnum'
import { model, Schema } from 'mongoose';

const userCollection = process.env.USER_COLLECTION || "users"

const userSchema = new Schema<IUserSchema>({
    user_id: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(UserRole)
    }
})

const userModel = model(userCollection, userSchema);
export default userModel