import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma/lib/prisma";
import {
  JoinRequestCreate,
  JoinRequestData,
} from "./interfaces/joinRequestInterfaces";
import { UserStore } from "./userStore";
const userStore = new UserStore();

type JoinRequestStatus = "NONE" | "SENT" | "ACCEPTED" | "REJECTED";

interface IJoinRequestStore {
  CreateJoinRequest(
    senderId: any,
    receiverId: any,
    eventId: any,
    eventName: string,
    eventAddress: string,
    eventStartTime: any,
  ): Promise<any>;
}

class JoinRequestStore implements IJoinRequestStore {
  async CreateJoinRequest(data: any): Promise<any> {
    try {
      // 1. Vérifier qu'une demande n'existe pas déjà
      const existingJoinRequest = await prisma.joinRequest.findFirst({
        where: {
          senderId: data.senderId,
          receiverId: data.receiverId,
          eventId: data.eventId,
          status: {
            in: ["SENT", "ACCEPTED"],
          },
        },
      });

      if (existingJoinRequest) {
        throw new Error("Join request already exists");
      }

      // 2. Créer la demande
      const joinRequestCreated = await prisma.joinRequest.create({
        data: {
          senderId: data.senderId,
          receiverId: data.receiverId,
          eventId: data.eventId,
          status: "SENT",
        },
      });

      // 3. Récupérer l'événement
      const event = await prisma.event.findUnique({
        where: {
          id: data.eventId,
        },
        include: {
          participants: true,
          createdBy: true,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // 4. Récupérer l'utilisateur qui fait la demande
      const friend = await prisma.user.findUnique({
        where: {
          id: data.senderId,
        },
      });

      if (!friend) {
        throw new Error("Sender not found");
      }

      // 5. Chercher la conversation
      let conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: {
                  id: data.senderId,
                },
              },
            },
            {
              participants: {
                some: {
                  id: data.receiverId,
                },
              },
            },
          ],
        },
      });

      // 6. La créer si nécessaire
      if (!conversation) {
        conversation = await userStore.createConversation(
          data.senderId,
          data.receiverId,
        );
      }

      // 7. Créer le message de demande
      const joinRequestMessage = await prisma.message.create({
        data: {
          type: "joinRequest",
          senderId: data.senderId,
          receiverId: data.receiverId,
          conversationId: conversation.id,
          joinRequestId: joinRequestCreated.id,

          content: {
            friendId: friend.id,
            friendName: `${friend.firstName} ${friend.lastName}`,
            friendPicture: friend.picture,

            eventId: event.id,
            eventName: event.eventName,
            eventAddress: event.eventAddress,
            eventStartTime: event.eventStartTime,

            hostId: event.createdBy.id,
            hostName: `${event.createdBy.firstName} ${event.createdBy.lastName}`,
            hostPicture: event.createdBy.picture,

            participants: event.participants,

            date: new Date(),
          },
        },
      });

      console.log(
        "join request message successfully created",
        joinRequestMessage,
      );

      return joinRequestCreated;
    } catch (error) {
      console.error(error);
      throw new Error("ERROR IN createJoinRequest");
    }
  }

  async getJoinRequest(
    senderId: number,
    receiverId: number,
    eventId: number,
  ): Promise<any> {
    try {
      const message = await prisma.message.findFirst({
        where: {
          joinRequest: {
            senderId,
            receiverId,
            eventId,
          },
        },
        include: {
          joinRequest: true,
        },
      });
      return message;
    } catch (error) {
      console.error(
        "prisma error trying to retrieve specific joinRequest",
        error,
      );
      throw error;
    }
  }

  async getUserDailyJoinRequests(day: Date, userId: number) {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    try {
      const allJoinRequest = await prisma.joinRequest.findMany({
        where: {
          receiverId: userId,
          sentAt: {
            gte: start,
            lte: end,
          },
        },
        include: {
          sender: true,
          event: true,
        },
      });
      return allJoinRequest;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createMeetRequest(data: any): Promise<any> {
    try {
      const existingMeetRequest = await prisma.meetRequest.findFirst({
        where: {
          emitterId: data.senderId,
          receiverId: data.receiverId,
          status: {
            in: ["SENT", "ACCEPTED"],
          },
        },
      });

      if (existingMeetRequest) {
        throw new Error("Meet request already exists");
      }

      const meetRequestCreated = await prisma.meetRequest.create({
        data: {
          emitterId: data.senderId,
          receiverId: data.receiverId,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
          activity: data.activity,
          status: "SENT",
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      });

      let conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: {
                  id: data.senderId,
                },
              },
            },
            {
              participants: {
                some: {
                  id: data.receiverId,
                },
              },
            },
          ],
        },
      });

      if (!conversation) {
        conversation = await userStore.createConversation(
          data.senderId,
          data.receiverId,
        );
      }

      const emitter = await prisma.user.findUnique({
        where: {
          id: data.senderId,
        },
      });

      let meetRequestMessage = await prisma.message.create({
        data: {
          type: "meetRequest",
          senderId: data.senderId,
          receiverId: data.receiverId,
          conversationId: conversation.id,
          content: {
            meetRequestId: meetRequestCreated.id,
            friendId: emitter?.id,
            friendName: `${emitter?.firstName} ${emitter?.lastName}`,
            friendPicture: emitter?.picture,
            latitude: meetRequestCreated.latitude,
            longitude: meetRequestCreated.longitude,
            address: meetRequestCreated.address,
            activity: meetRequestCreated.activity,
            date: new Date(),
          },
        },
      });
      return meetRequestCreated;
    } catch (error) {
      console.error(error);
      throw new Error("ERROR IN createMeetRequest");
    }
  }

  async getJoinRequestStatus(userId: number, eventId: number) {
    try {
      const joinRequest = await prisma.joinRequest.findUnique({
        where: {
          senderId_eventId: {
            senderId: userId,
            eventId: eventId,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

      return joinRequest;
    } catch (error) {
      console.error("Prisma retrieving join request status error:", error);
      throw error;
    }
  }

  async updateJoinRequestStatus(
    joinRequestId: number,
    joinRequestStatus: JoinRequestStatus,
  ): Promise<any> {
    try {
      console.log("join request id");
      console.log(joinRequestId);
      console.log("join request status");
      console.log(joinRequestStatus);
      return await prisma.$transaction(async (tx) => {
        const joinRequest = await tx.joinRequest.findUnique({
          where: {
            id: joinRequestId,
          },
        });

        if (!joinRequest) {
          throw new Error("Join request not found");
        }

        const updatedStatus = await tx.joinRequest.update({
          where: {
            id: joinRequestId,
          },
          data: {
            status: joinRequestStatus,
          },
        });

        if (joinRequestStatus === "ACCEPTED") {
          await tx.event.update({
            where: {
              id: joinRequest.eventId,
            },
            data: {
              participants: {
                connect: {
                  id: joinRequest.senderId,
                },
              },
            },
          });
        }

        if (joinRequestStatus === "REJECTED") {
          await tx.event.update({
            where: {
              id: joinRequest.eventId,
            },
            data: {
              participants: {
                disconnect: {
                  id: joinRequest.senderId,
                },
              },
            },
          });
        }

        return updatedStatus;
      });
    } catch (error) {
      console.error("Prisma updating join request status error:", error);
      throw error;
    }
  }

  async deleteJoinRequest(senderId: number, receiverId: number) {
    // delete n'en supprime qu'un seul à la fois
    // deleteMany en supprime plusieurs
    try {
      const result = await prisma.joinRequest.deleteMany({
        where: {
          senderId: senderId,
          receiverId: receiverId,
        },
      });
      return result;
    } catch (error) {
      console.error(
        "prisma error trying to delete specific joinRequest",
        error,
      );
    }
  }
}

export { JoinRequestStore };
