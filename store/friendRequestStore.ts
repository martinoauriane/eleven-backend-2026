import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import { FriendRequestCreate, FriendRequestData } from "../store/interfaces/friendRequestInterfaces";

interface IFriendRequestStore {
    CreateFriendRequest(data:FriendRequestCreate): Promise<any> 
} 

class FriendRequestStore implements IFriendRequestStore {

  async CreateFriendRequest(data:FriendRequestCreate): Promise<any> {
    try {
      console.log("friend data", data);
      const response = await prisma.friendRequest.create({ data });
      return response;
    } catch (error) {
      console.error(
        "prisma error trying to create specific joinRequest",
        error,
      );
    }
  }

  async GetFriendRequest(emitter_id: number, receiver_id: number): Promise<FriendRequestData | null> {
    try {
      const response : FriendRequestData | null = await prisma.friendRequest.findFirst({
        where: {
          emitterId: emitter_id,
          receiverId: receiver_id,
        },
      });
      return response;
    } catch (error) {
      console.error("prisma error trying to retrieve specific joinRequest", error);
      throw error;
    }
  }

  async deleteFriendRequest(emitter_id: number, receiver_id: number) {
    // delete n'en supprime qu'un seul à la fois
    // deleteMany en supprime plusieurs
    try {
      const result = await prisma.friendRequest.deleteMany({
        where: {
          emitterId: emitter_id,
          receiverId: receiver_id,
        },
      });
      return result;
    } catch (error) {
      console.error("prisma error trying to delete specific friendRequest", error);
    }
  }
}

export { FriendRequestStore };
