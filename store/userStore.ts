import "dotenv/config"; // ⚡ force le chargement de ton .env
import { UserCreate, UserUpdate, UserData } from "./interfaces/userInterfaces";
import { prisma } from "../prisma/lib/prisma";


interface IUserStore {
  createUser(data: UserCreate): Promise<any>;
  getUserById(id: number): Promise<any>;
  updateUser(id: number, data: UserData): Promise<any>;
  deleteUser(id: number): Promise<any>;
}

class UserStore implements IUserStore {
  async createUser(data: UserCreate) {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      console.error("Prisma creation error:", error);
    }
  }

  async getAllUsers(){
    try{
      return await prisma.user.findMany();
    } catch(error){
      console.error("Prisma retrieving all users error:", error);
    }
  }

  async getUserById(id: number) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      console.error("Prisma retrieve error:", error);
    }
  }

  async getUserFriends(id: string) {
    const idNum = parseInt(id);
    try {
      return await prisma.user.findMany({
        where: { id: idNum },
        include: { friends: true },
      });
    } catch (error) {
      console.error("Prisma retrieve error:", error);
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
      console.error("Prisma delete error:", error);
    }
  }
}

export { UserStore };
