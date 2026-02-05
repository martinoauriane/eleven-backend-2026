import {UserStore} from "../store/userStore";
import { hashPassword } from "./utils/hash";

const userStore = new UserStore();

class UserService {
    async createUser(data:any) {
        const password = String(data.password);
        const passwordHash = await hashPassword(password);
        data.passwordHash = passwordHash;
        return await userStore.createUser(data);
    }

    async getUserById(id: number) {
        return await userStore.getUserById(id);
    }

    async updateUser(id: number, data:any) {
        return await userStore.updateUser(id, data);
    }

    async deleteUser(id:number) {
        return await userStore.deleteUser(id);
    }
}

export { UserService };