import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma/lib/prisma";
import {
  FriendRequestCreate,
  FriendRequestData,
} from "../store/interfaces/friendRequestInterfaces";

interface IFriendRequestStore {
  createFriendInvite(data: FriendRequestCreate): Promise<any>;
}

class FriendRequestStore implements IFriendRequestStore {
  async createFriendInvite(data: FriendRequestCreate): Promise<any> {
    try {
      const response = await prisma.friendRequest.create({ data });
      return response;
    } catch (error) {
      console.error(
        "prisma error trying to create specific joinRequest",
        error,
      );
    }
  }

  async getUserFriendsRequests(userId: number): Promise<any[]> {
    try {
      const responses = await prisma.friendRequest.findMany({
        where: {
          receiverId: userId,
        },
      });
      const enrichedResponses = await Promise.all(
        responses.map(async (response) => {
          const sender = await prisma.user.findUnique({
            where: {
              id: response.emitterId,
            },
          });
          const receiver = await prisma.user.findUnique({
            where: {
              id: response.receiverId,
            },
          });

          return {
            ...response,
            sender,
            receiver,
          };
        }),
      );
      return enrichedResponses;
    } catch (error) {
      console.error("prisma error trying to retrieve friend requests", error);
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
      console.error(
        "prisma error trying to delete specific friendRequest",
        error,
      );
    }
  }
}

export { FriendRequestStore };
