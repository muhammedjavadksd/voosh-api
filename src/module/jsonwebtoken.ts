
import jwt from 'jsonwebtoken';
import { ITokenModule } from '../data/interface/abstractInterface';


class JsonWebTokenModule implements ITokenModule {

    async createToken(payload: Record<string, any>, expire: string): Promise<string | null> {
        const secrets = process.env.TOKEN_SECRETS;
        if (secrets) {
            const token = jwt.sign(payload, secrets, { expiresIn: expire });
            return token
        } else {
            throw new Error("Token generation error")
        }
    }

    async compareToken(token: string): Promise<Record<string, any> | null> {
        const secrets = process.env.TOKEN_SECRETS;
        if (secrets) {
            const verify = jwt.verify(token, secrets);
            return verify as Record<string, any>
        } else {
            throw new Error("Internals erver error")
        }
    }
}


export default JsonWebTokenModule