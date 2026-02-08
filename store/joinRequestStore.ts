import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import { JoinRequestCreate } from "./interfaces/joinRequestInterfaces";

interface IJoinRequestStore {
  CreateJoinRequest(data: JoinRequestCreate): Promise<any>;
}

class JoinRequestStore implements IJoinRequestStore {

  async CreateJoinRequest(data: JoinRequestCreate): Promise<any> {
    try {
      return await prisma.joinRequest.create({ data });
    } catch (error) {
      console.error(
        "prisma error trying to create specific joinRequest",
        error,
      );
    }
  }

  async getJoinRequest(emitter_id: number, receiver_id: number) {
    try {
      return await prisma.joinRequest.findFirst({
        where: {
          emitterId: emitter_id,
          receiverId: receiver_id,
        },
      });
    } catch (error) {
      console.error("prisma error trying to retrieve specific joinRequest");
    }
  }

  async deleteJoinRequest(emitter_id: number, receiver_id: number) {
    // delete n'en supprime qu'un seul à la fois
    // deleteMany en supprime plusieurs
    try {
      return await prisma.joinRequest.deleteMany({
        where: {
          emitterId: emitter_id,
          receiverId: receiver_id,
        },
      });
    } catch (error) {
      console.error("prisma error trying to delete specific joinRequest");
    }
  }
}

export { JoinRequestStore };
