import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma/lib/prisma";
import { JoinRequestCreate, JoinRequestData } from "./interfaces/joinRequestInterfaces";

interface IJoinRequestStore {
  CreateJoinRequest(data: JoinRequestCreate): Promise<any>;
}

class JoinRequestStore implements IJoinRequestStore {

  async CreateJoinRequest(data: JoinRequestCreate): Promise<any> {
    try {
      let newJoinRequest = await prisma.joinRequest.create({ data });
      return newJoinRequest;
    } catch (error) {
      console.error(
        "prisma error trying to create specific joinRequest",
        error,
      );
    }
  }

  async getJoinRequest(emitterId: number, receiverId: number, eventId: number): Promise<JoinRequestData | null> {
    try {
      const response : JoinRequestData | null = await prisma.joinRequest.findFirst({
        where: {
          emitterId: emitterId,
          receiverId: receiverId,
          eventId: eventId
        },
        include: {
        event: true,
        emitter: true,
      },
      });
      return response;
    } catch (error) {
      console.error("prisma error trying to retrieve specific joinRequest", error);
      throw error;
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
      console.error("prisma error trying to delete specific joinRequest", error);
    }
  }
}

export { JoinRequestStore };
