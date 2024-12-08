import { IBcryptModule } from "../data/interface/abstractInterface";
import bcpt from 'bcrypt'


class BcryptModule implements IBcryptModule {

    async bcrypt(data: string): Promise<string | null> {
        const bcrypt = await bcpt.hash(data, 10)
        return bcrypt
    }

    async compare(data: string, compareWith: string): Promise<boolean> {
        const compare = await bcpt.compare(data, compareWith);
        return !!compare
    }
}

export default BcryptModule