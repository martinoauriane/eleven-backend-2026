import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma/lib/prisma";
import {  JoinRequestCreate, JoinRequestData } from "./interfaces/joinRequestInterfaces";


type JoinRequestStatus = "NONE" | "SENT" | "ACCEPTED" | "REJECTED";


interface IJoinRequestStore {
  CreateJoinRequest(senderId: any, receiverId: any, eventId: any,  eventName: string,
    eventAddress: string, 
    eventStartTime: any,): Promise<any>;
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
      if (existingJoinRequest == null) {
        const joinRequestCreated = await prisma.joinRequest.create({
          data: {
            emitterId: data.senderId,
            receiverId: data.receiverId,
            eventId: data.eventId,
            status: "SENT",
          },
        });
         return joinRequestCreated;
      } else {
        throw new Error("Join request already exists");
      }
    } catch (error) {
      throw new Error("ERROR IN createJoinRequest:");
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
