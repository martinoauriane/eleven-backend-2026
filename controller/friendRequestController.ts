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

  async getReceivedFriendRequests(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid userId",
      });
    }

    const requests = await friendRequestService.getReceivedFriendRequests(
      userId,
    );

    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error getting received friend requests:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async getSentFriendRequests(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid userId",
      });
    }

    const requests = await friendRequestService.getSentFriendRequests(
      userId,
    );

    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error getting sent friend requests:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
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
