import "dotenv/config"; // ⚡ force le chargement de ton .env
import { FriendRequestStore } from "../store/friendRequestStore";
import { FriendRequestCreate, FriendRequestData } from "../store/interfaces/friendRequestInterfaces";

const friendRequestStore = new FriendRequestStore();

class FriendRequestService {

  async createFriendInvite(data: FriendRequestCreate): Promise<any> {
    return await friendRequestStore.createFriendInvite(data);
  }

  async getUserFriendsRequests(data: FriendRequestCreate): Promise<FriendRequestData | null> {
    const response : FriendRequestData | null = await friendRequestStore.getUserFriendsRequests(
      data.emitterId,
      data.receiverId,
    );
    return response;
  }

  async deleteFriendRequest(data: FriendRequestCreate): Promise<any> {
    return await friendRequestStore.deleteFriendRequest(
      data.emitterId,
      data.receiverId,
    );
  }
}

export { FriendRequestService };
