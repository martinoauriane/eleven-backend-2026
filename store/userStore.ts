import "dotenv/config"; // ⚡ force le chargement de ton .env
import { UserCreate, UserUpdate, UserData } from "./interfaces/userInterfaces";
import { prisma } from "../prisma/lib/prisma";
import { MoodStatus } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface IUserStore {
  createUser(data: UserCreate): Promise<any>;
  getUserById(id: number): Promise<any>;
  updateUser(id: number, data: UserUpdate): Promise<any>;
  UpdateUserStatus(userId: number, userStatus: any): Promise<any>;
  deleteUser(id: number): Promise<any>;
}

class UserStore implements IUserStore {
  async createUser(data: UserCreate) {
    try {
      let createdUser = await prisma.user.create({ data });
      const token = jwt.sign(
        { userId: createdUser.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" },
      );
      return {
        user: createdUser,
        token,
      };
    } catch (error) {
      console.error("Prisma creation error:", error);
    }
  }

  async loginUser(userLogin: any): Promise<any> {
    const email_login = userLogin.email;
    try {
      let userDb = await prisma.user.findUnique({
        where: { email: email_login },
      });
      const userId = userDb?.id;
      if (userDb) {
        const isMatch = await bcrypt.compare(
          userLogin.password,
          userDb?.password,
        );
        if (isMatch && userId) {
          const user = await prisma.user.findUnique({ where: { id: userId } });
          const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
          });
          return { token, user };
        } else {
          throw new Error("Invalid credentials");
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

  async shareUserOnMap(user: any) {
    try {
      const newUserOnMap = await prisma.onMap.upsert({
        where: { userId: user.id },
        update: {
          latitude: user.latitude,
          longitude: user.longitude,
          address: user.address,
          activity: user.activity,
        },
        create: {
          userId: user.id,
          latitude: user.latitude,
          longitude: user.longitude,
          address: user.address,
          activity: user.activity,
        },
      });

      return newUserOnMap;
    } catch (error) {
      console.error("Error adding user on map", error);
      throw error;
    }
  }

  async getFriendsOnMap(userId: number) {
    try {
      const usersOnMap = await prisma.onMap.findMany({
        where: {
          user: {
            OR: [
              {
                friends: {
                  some: {
                    id: userId,
                  },
                },
              },
              {
                friendOf: {
                  some: {
                    id: userId,
                  },
                },
              },
            ],
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              picture: true,
            },
          },
        },
      });
      return usersOnMap;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch users on map");
    }
  }

  async getUserFavorites(userId: number) {
    try {
      let user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          favorites: true,
        },
      });
      let favorites = user?.favorites;
      return favorites;
    } catch (error) {
      console.error("Prisma retrieve error:", error);
    }
  }

  async getUserFriendsStatuses(userId: number) {
    try {
      let userFriendsStatuses = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          friends: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              picture: true,
              status: true,
            },
          },
          friendOf: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              picture: true,
              status: true,
            },
          },
        },
      });
      return userFriendsStatuses;
    } catch (error) {
      return error;
    }
  }

  async getUserFriends(id: string) {
    const idNum = parseInt(id);
    try {
      const user = await prisma.user.findUnique({
        where: { id: idNum },
        include: { friends: true },
      });
      const userArrayFriends = user?.friends;
      return userArrayFriends;
    } catch (error) {
      console.error("Prisma retrieve error:", error);
    }
  }

  async updateUser(id: number, data: UserUpdate) {
    try {
      const newUser = await prisma.user.update({
        where: { id },
        data,
      });
      return newUser;
    } catch (error) {
      console.error("Prisma update error:", error);
      throw error;
    }
  }

  async UpdateUserStatus(userId: number, userStatus: any) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          status: userStatus,
          statusUpdatedAt: new Date(),
        },
      });
      return updatedUser;
    } catch (error) {
      console.error("Prisma update user status error:", error);
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
