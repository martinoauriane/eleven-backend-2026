import {UserStore} from "../store/userStore";
import { hashPassword } from "./utils/hash";
import { UserCreate } from "../store/interfaces/userInterfaces";
import { C } from "vue-router/dist/router-CWoNjPRp.mjs";

const userStore = new UserStore();

class UserService {
    async createUser(data:any) {
        const password = String(data.password);
        const passwordHash = await hashPassword(password);
        const userData: UserCreate = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            picture: data.picture,
            passwordHash: passwordHash
        };
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