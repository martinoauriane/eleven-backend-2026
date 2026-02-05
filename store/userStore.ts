import 'dotenv/config';  // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import {UserCreate, UserUpdate, UserData} from "./interfaces/userInterfaces";


interface UserStore {
    createUser(data: UserCreate): Promise<any>;
    getUserById(id: number): Promise<any>;
    updateUser(id: number, data: UserData): Promise<any>;
    deleteUser(id: number): Promise<any>;
}

class UserStore {
    async createUser(data: UserCreate) {
        return await prisma.user.create({ data });
    }

    async getUserById(id: number) {
        return await prisma.user.findUnique({ where: { id } });
    }

    async updateUser(id: number, data: UserUpdate) {
        return await prisma.user.update({ where: { id }, data });
    }

    async deleteUser(id: number) {
        return await prisma.user.delete({ where: { id } });
    }
}

export {UserStore};