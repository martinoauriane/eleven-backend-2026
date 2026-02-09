import "dotenv/config"; // ⚡ force le chargement de ton .env
import { FriendRequestStore } from "../store/friendRequestStore";
import { FriendRequestCreate, FriendRequestData } from "../store/interfaces/friendRequestInterfaces";

const friendRequestStore = new FriendRequestStore();

class FriendRequestService {

  async createFriendRequest(data: FriendRequestCreate): Promise<any> {
    return await friendRequestStore.CreateFriendRequest(data);
  }

  async getFriendRequest(data: FriendRequestCreate): Promise<FriendRequestData | null> {
    const response : FriendRequestData | null = await friendRequestStore.getFriendRequest(
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
