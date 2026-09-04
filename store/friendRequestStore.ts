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
