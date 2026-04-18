import "dotenv/config"; // ⚡ force le chargement de ton .env
import { UserCreate, UserUpdate, UserData } from "./interfaces/userInterfaces";
import { prisma } from "../prisma/lib/prisma";
import { hashPassword } from "../service/utils/hash";
import bcrypt from "bcryptjs";

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

  async checkUser(userLogin: any): Promise<any> {
    const email_login = userLogin.email;
    try {
      let userDb = await prisma.user.findUnique({
        where: { email: email_login },
      });
      if (userDb) {
        const isMatch = await bcrypt.compare(
          userLogin.password,
          userDb?.password,
        );
        if (isMatch) {
          return "okay";
        } else {
          return "false";
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getAllUsers() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      console.error("Prisma retrieving all users error:", error);
      throw error;
    }
  }

  async getUserById(id: number) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      console.error("Prisma retrieve error:", error);
    }
  }

  async addFriend(userId: number, friendId: number) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            connect: { id: friendId },
          },
        },
        include: {
          friends: true,
        },
      });
      return updatedUser;
    } catch (error) {
      console.error("Prisma adding friend error:", error);
    }
  }

  async addEventFavorite(userId: number, eventId: number) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            connect: { id: eventId },
          },
        },
        include: {
          favorites: true,
        },
      });
      return updatedUser;
    } catch (error) {
      console.error("Prisma add favorite error:", error);
    }
  }

  async removeEventFavorite(userId: number, eventId: number) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            disconnect: { id: eventId },
          },
        },
        include: {
          favorites: true,
        },
      });
    } catch (error) {
      console.error("Prisma remove favorite error:", error);
    }
  }

  async getUserFavorites(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: true,
      },
    });
  }

  async getUserFriends(id: string) {
    const idNum = parseInt(id);
    console.log("idNum", idNum);
    try {
      const user = await prisma.user.findUnique({
        where: { id: idNum },
        include: { friends: true },
      });
      const userArrayFriends = user?.friends;
      console.log("userArray Friends", userArrayFriends);
      return userArrayFriends;
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
