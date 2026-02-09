import { Request, Response } from "express";
import { FriendRequestCreate } from "../store/interfaces/friendRequestInterfaces";
import { FriendRequestService } from "../service/friendRequestService";

const friendRequestService = new FriendRequestService();

class FriendRequestController {
    
  async newFriendRequest(req: Request, res: Response) {
    try {
      const friendRequest: FriendRequestCreate = {
        emitterId: Number(req.params.emitter_id),
        receiverId: Number(req.params.receiver_id),
      };
      const friendRequestCreated =
        await friendRequestService.createFriendRequest(friendRequest);
      res.status(200).json(friendRequestCreated);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Friend Request" });
    }
  }

  async getFriendRequest(req: Request, res: Response) {
    try {
      const friendRequest: FriendRequestCreate = {
        emitterId: Number(req.params.emitter_id),
        receiverId: Number(req.params.receiver_id),
      };
      const retrievedFriendRequest = await friendRequestService.getFriendRequest(friendRequest);
      res.status(200).json(retrievedFriendRequest);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Friend Request" });
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
