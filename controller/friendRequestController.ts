import { Request, Response } from "express";
import { FriendRequestCreate } from "../store/interfaces/friendRequestInterfaces";
import { FriendRequestService } from "../service/friendRequestService";

const friendRequestService = new FriendRequestService();

class FriendRequestController {
    
  async createFriendInvite(req: Request, res: Response) {
    try {
      const friendInvite: FriendRequestCreate = {
        emitterId: Number(req.params.emitter_id),
        receiverId: Number(req.params.receiver_id),
      };
      const friendInviteCreated =
        await friendRequestService.createFriendInvite(friendInvite);
      res.status(200).json(friendInviteCreated);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Friend Request" });
    }
  }

  async getUserFriendsRequests(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    try {
      const retrievedFriendRequest = await friendRequestService.getUserFriendsRequests(userId);
      console.log("friends requests");
      console.log(retrievedFriendRequest);
      res.status(200).json(retrievedFriendRequest);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving friend requests" });
    }
  }

  async deleteFriendRequest(req: Request, res: Response) {
    try {
      const friendRequestDelete: FriendRequestCreate = {
        emitterId: Number(req.params.emitter_id),
        receiverId: Number(req.params.receiver_id),
      };
      const friendRequestDeleted =
        await friendRequestService.deleteFriendRequest(friendRequestDelete);
      res.status(200).json(friendRequestDeleted);
    } catch (error) {
      res.status(500).json({ error: "Error deleting Friend Request" });
    }
  }
}

export { FriendRequestController };
