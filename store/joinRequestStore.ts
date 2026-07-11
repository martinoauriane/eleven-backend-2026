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
  async CreateJoinRequest(data: JoinRequestCreate): Promise<any> {
    try {
      const existingJoinRequest = await prisma.joinRequest.findFirst({
        where: {
          emitterId: data.senderId,
          eventId: data.eventId,
          status: {
            in: ["SENT", "ACCEPTED", "REJECTED"],
          },
        },
      });

      if (existingJoinRequest) {
        throw new Error("Join request already exists");
      }

      const joinRequestCreated = await prisma.joinRequest.create({
        data: {
          emitterId: data.senderId,
          receiverId: data.receiverId,
          eventId: data.eventId,
          status: "SENT",
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

      const event = await prisma.event.findUnique({
        where: {
          id: data.eventId,
        },
        include: {
          participants: true,
          createdBy: true,
        },
      });

      const emitter = await prisma.user.findUnique({
        where: {
          id: data.senderId,
        },
      });

      await prisma.message.create({
        data: {
          type: "joinRequest",
          senderId: data.senderId,
          conversationId: conversation.id,
          joinRequestId: joinRequestCreated.id,
          content: {
            friendId: emitter?.id,
            friendName: `${emitter?.firstName} ${emitter?.lastName}`,
            friendPicture: emitter?.picture,

            eventId: event?.id,
            eventName: event?.eventName,
            eventAddress: event?.eventAddress,
            eventStartTime: event?.eventStartTime,

            hostId: event?.createdBy.id,
            hostName: `${event?.createdBy.firstName} ${event?.createdBy.lastName}`,
            hostPicture: event?.createdBy.picture,

            participants: event?.participants,

            joinRequestId: joinRequestCreated.id,
            date: new Date(),
          },
        },
      });
      return joinRequestCreated;
    } catch (error) {
      console.error(error);
      throw new Error("ERROR IN createJoinRequest");
    }
  }

  async getJoinRequest(
    emitterId: number,
    receiverId: number,
    eventId: number,
  ): Promise<JoinRequestData | null> {
    try {
      const response: JoinRequestData | null =
        await prisma.joinRequest.findFirst({
          where: {
            emitterId: emitterId,
            receiverId: receiverId,
            eventId: eventId,
          },
          include: {
            event: true,
            emitter: true,
          },
        });
      return response;
    } catch (error) {
      console.error(
        "prisma error trying to retrieve specific joinRequest",
        error,
      );
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

      await prisma.message.create({
        data: {
          type: "meetRequest",
          senderId: data.senderId,
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

  async updateJoinRequestStatus(
    joinRequestId: number,
    JoinRequestStatus: JoinRequestStatus,
  ): Promise<any> {
    try {
      const updatedStatus = prisma.joinRequest.update({
        where: {
          id: joinRequestId,
        },
        data: {
          status: JoinRequestStatus,
        },
      });
      return updatedStatus;
    } catch (error) {
      console.error("Prisma updating join request status error");
    }
  }

  async deleteJoinRequest(emitter_id: number, receiver_id: number) {
    // delete n'en supprime qu'un seul à la fois
    // deleteMany en supprime plusieurs
    try {
      const result = await prisma.joinRequest.deleteMany({
        where: {
          emitterId: emitter_id,
          receiverId: receiver_id,
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
