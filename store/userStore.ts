import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import { UserCreate, UserUpdate, UserData } from "./interfaces/userInterfaces";

interface UserStore {
  createUser(data: UserCreate): Promise<any>;
  getUserById(id: number): Promise<any>;
  updateUser(id: number, data: UserData): Promise<any>;
  deleteUser(id: number): Promise<any>;
}

class UserStore {
  async createUser(data: UserCreate) {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      console.error("Prisma update error:", error);
    }
  }

  async getUserById(id: number) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      console.error("Prisma update error:", error);
    }
  }

  async updateUser(id: number, data: UserUpdate) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("Prisma update error:", error);
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      console.error("Prisma update error:", error);
    }
  }
}

export { UserStore };
