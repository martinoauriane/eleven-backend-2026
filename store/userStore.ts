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
  updateMood(userId: number, mood: any): Promise<any>;
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

  async loginUser(email: string, password: string): Promise<any> {
    try {
      let userDb = await prisma.user.findUnique({
        where: { email: email },
      });
      const userId = userDb?.id;
      if (userDb) {
        const isMatch = await bcrypt.compare(password, userDb?.password);
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
      let allusers = await prisma.user.findMany();
      return allusers;
    } catch (error) {
      console.error("Prisma retrieving all users error:", error);
      throw error;
    }
  }

  async getUserById(id: number) {
    if (id == null) {
      return;
    }
    try {
      let user = await prisma.user.findUnique({ where: { id: id } });
      return user;
    } catch (error) {
      console.error("Prisma retrieve error:", error);
    }
  }

  async addFriend(userId: number, friendId: number) {
    const [smallId, bigId] =
      userId < friendId ? [userId, friendId] : [friendId, userId];

    try {
      return await prisma.friendship.create({
        data: {
          userId: smallId,
          friendId: bigId,
        },
      });
    } catch (error) {
      console.error("Prisma adding friend error:", error);
    }
  }

  async getUserSavedEvents(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          favorites: {
            include: {
              participants: true,
              createdBy: true,
              joinRequests: true,
            },
          },
        },
      });

      const userSavedEvents = user?.favorites ?? [];

      console.log("user saved events");
      console.log(userSavedEvents);

      return userSavedEvents;
    } catch (error) {
      console.error("Prisma get user favorite events error:", error);
      throw error;
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
      console.error("Prisma add favorite events error:", error);
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
      console.error("Prisma remove favorite events error:", error);
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
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [{ userId }, { friendId: userId }],
        },
      });

      const friendIds = friendships.map((f) =>
        f.userId === userId ? f.friendId : f.userId,
      );

      const friendsOnMap = await prisma.onMap.findMany({
        where: {
          userId: {
            in: friendIds,
          },
        },
        select: {
          latitude: true,
          longitude: true,
          address: true,
          activity: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              picture: true,
            },
          },
        },
      });

      return friendsOnMap;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch users on map");
    }
  }

  async getFriendsMood(userId: number) {
    try {
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [{ userId }, { friendId: userId }],
        },
        include: {
          user: true,
          friend: true,
        },
      });

      const friends = friendships.map((f) =>
        f.userId === userId ? f.friend : f.user,
      );

      let friendsMood = friends.map((friend) => ({
        id: friend.id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        picture: friend.picture,
        mood: friend.mood,
        moodUpdatedat: friend.moodUpdatedAt,
      }));
      return friendsMood;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserFriends(id: number) {
    try {
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [{ userId: id }, { friendId: id }],
        },
        include: {
          user: true,
          friend: true,
        },
      });

      const friends = friendships.map((f) =>
        f.userId === id ? f.friend : f.user,
      );

      return friends;
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

  async updateMood(userId: number, userMood: MoodStatus) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          mood: userMood,
          moodUpdatedAt: new Date(),
        },
      });
      return updatedUser;
    } catch (error) {
      console.error("Prisma update user status error:", error);
      throw error;
    }
  }

  async createConversation(userId: number, friendId: number) {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: userId }, { id: friendId }],
          },
        },
        include: {
          participants: true,
        },
      });
      return conversation;
    } catch (error) {
      console.error("Prisma creating new conversation error:", error);
      throw error;
    }
  }

  async getMessages(conversationId: number) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          conversationId,
        },
        orderBy: {
          sentAt: "desc",
        },
        include: {
          sender: true,
          joinRequest: {
            include: {
              friend: true,
              eventHost: true,
              event: {
                include: {
                  participants: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      picture: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      console.log(
        messages
          .filter((m) => m.type === "joinRequest")
          .map((m) => ({
            id: m.id,
            joinRequestId: m.joinRequestId,
            hasJoinRequest: !!m.joinRequest,
          })),
      );

      const formattedMessages = await Promise.all(
        messages.map(async (msg) => {
          if (msg.type === "joinRequest" && msg.joinRequest) {
            return {
              // ...
            };
          }

          if (msg.type === "event") {
            const content = msg.content as any;

            const event = await prisma.event.findUnique({
              where: {
                id: content.eventId,
              },
              include: {
                createdBy: true,
                participants: true,
              },
            });

            if (!event) {
              return {
                id: msg.id,
                type: "event",
                senderId: msg.senderId,
                sentAt: msg.sentAt,
                content,
              };
            }

            return {
              id: msg.id,
              type: "event",
              senderId: msg.senderId,
              sentAt: msg.sentAt,
              content: {
                ...content,
                eventName: event.eventName,
                eventAddress: event.eventAddress,
                eventStartTime: event.eventStartTime,
                eventEndTime: event.eventEndTime,

                hostId: event.createdBy.id,
                hostName: `${event.createdBy.firstName} ${event.createdBy.lastName}`,
                hostPicture: event.createdBy.picture,

                participants: event.participants,
              },
            };
          }

          return {
            id: msg.id,
            senderId: msg.senderId,
            type: msg.type,
            isRead: msg.isRead,
            sentAt: msg.sentAt,
            content: msg.content,
          };
        }),
      );

      return formattedMessages;
    } catch (error) {
      console.error("Prisma retrieving messages error:", error);
      throw error;
    }
  }

  async getUserConversations(userId: number) {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { id: userId },
          },
        },
        include: {
          participants: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              picture: true,
            },
          },
          messages: {
            orderBy: { sentAt: "desc" },
            take: 1,
          },
        },
      });

      return conversations.map((conv) => {
        const friend = conv.participants.find((p) => p.id !== userId);

        return {
          ...conv,
          friend,
          participants: undefined,
        };
      });
    } catch (error) {
      console.error("Prisma retrieving conversation error:", error);
      throw error;
    }
  }

  async markConversationAsRead(conversationId: number, userId: number) {
    try {
      const conversationRead = await prisma.message.updateMany({
        where: {
          conversationId: Number(conversationId),
          isRead: false,
          senderId: {
            not: userId,
          },
        },
        data: {
          isRead: true,
        },
      });
      return conversationRead;
    } catch (error) {
      console.error("Prisma retrieving conversation error:", error);
      throw error;
    }
  }

  async getReceivedFriendRequests(userId: number) {
    try {
      const receivedfriendsRequests = await prisma.friendRequest.findMany({
        where: {
          receiverId: userId,
        },
        orderBy: {
          sentAt: "desc",
        },
        include: {
          emitter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              picture: true,
            },
          },
        },
      });
      return receivedfriendsRequests;
    } catch (error) {
      console.error("Prisma retrieving received friend requests error:", error);
    }
  }

  async getSentFriendRequests(userId: number) {
    try{
      const sentFriendRequests = await prisma.friendRequest.findMany({
      where: {
        emitterId: userId,
      },
      orderBy: {
        sentAt: "desc",
      },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },
      },
    });
    return sentFriendRequests;
    } catch(error){
      console.error("Prisma retrieving sent friend requests error:", error);
    }
  }

  async addMessage(
    conversationId: number,
    type: string,
    content: any,
    senderId: number,
    receiverId: number,
    joinRequestId?: number,
    meetRequestId?: number,
  ) {
    console.log({
      conversationId,
      type,
      senderId,
      receiverId,
      joinRequestId,
      meetRequestId,
    });
    try {
      const newMessage = await prisma.message.create({
        data: {
          type,
          content,
          conversation: {
            connect: { id: conversationId },
          },
          sender: {
            connect: { id: senderId },
          },
          receiver: {
            connect: { id: receiverId },
          },
          joinRequest: joinRequestId
            ? {
                connect: { id: joinRequestId },
              }
            : undefined,
          meetRequest: meetRequestId
            ? {
                connect: { id: meetRequestId },
              }
            : undefined,
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
      return newMessage;
    } catch (error) {
      console.error("Error adding message:", error);
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
