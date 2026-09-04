import "dotenv/config"; // ⚡ force le chargement de ton .env
import { FriendRequestStore } from "../store/friendRequestStore";
import {
  FriendRequestCreate,
  FriendRequestData,
} from "../store/interfaces/friendRequestInterfaces";

const friendRequestStore = new FriendRequestStore();

class FriendRequestService {
  async createFriendInvite(data: FriendRequestCreate): Promise<any> {
    return await friendRequestStore.createFriendInvite(data);
  }

  async getReceivedFriendRequests(userId: number): Promise<any | null> {
    return await friendRequestStore.getReceivedFriendRequests(userId);
  }

  async getSentFriendRequests(userId: number): Promise<any | null> {
    return await friendRequestStore.getSentFriendRequests(userId);
  }

  async deleteFriendRequest(data: FriendRequestCreate): Promise<any> {
    return await friendRequestStore.deleteFriendRequest(
      data.emitterId,
      data.receiverId,
    );
  }
}

export { FriendRequestService };
