import {UserStore} from "../store/userStore";
import { hashPassword } from "./utils/hash";
import { UserCreate, UserUpdate } from "../store/interfaces/userInterfaces";

const userStore = new UserStore();

interface UserService {
    createUser(data: UserCreate): Promise<any>;
    getUserById(id: number): Promise<any>;
    updateUser(id: number, data:any): Promise<any>;
    deleteUser(id: number): Promise<any>;
}

class UserService {

    async createUser(data:any) {
        const password = String(data.password);
        const passwordHash = await hashPassword(password);
        const userData: UserCreate = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            homeAddress: data.homeAddress,
            password: passwordHash
        };
        return await userStore.createUser(userData);
    }

    async getUserById(id: number) {
        return await userStore.getUserById(id);
    }

    async updateUser(data:any, id: number) {
        const updateData : UserUpdate = data;
        return await userStore.updateUser(id, updateData);
    }

    async deleteUser(id:number) {
        return await userStore.deleteUser(id);
    }
}

export { UserService };