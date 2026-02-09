import { JoinRequestService } from "../service/joinRequestService";
import { Request, Response } from "express";
import { JoinRequestCreate } from "../store/interfaces/joinRequestInterfaces";

const joinRequestService = new JoinRequestService();

class JoinRequestController {
    
  async newJoinRequest(req: Request, res: Response) {
    try {
      const joinRequest: JoinRequestCreate = {
        emitterId: Number(req.params.emitter_id),
        receiverId: Number(req.params.receiver_id),
      };
      const joinRequestCreated =
        await joinRequestService.createJoinRequest(joinRequest);
      res.status(200).json(joinRequestCreated);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Join Request" });
    }
  }

  async getJoinRequest(req: Request, res: Response) {
    try {
      const joinRequest: JoinRequestCreate = {
        emitterId: Number(req.params.emitter_id),
        receiverId: Number(req.params.receiver_id),
      };
      const retrievedJoinRequest = await joinRequestService.getJoinRequest(joinRequest);
      res.status(200).json(retrievedJoinRequest);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Join Request" });
    }
  }

  async deleteJoinRequest(req: Request, res: Response) {
    try {
      const joinRequestDelete: JoinRequestCreate = {
        emitterId: Number(req.params.emitter_id),
        receiverId: Number(req.params.receiver_id),
      };
      const joinRequestDeleted =
        await joinRequestService.deleteJoinRequest(joinRequestDelete);
      res.status(200).json(joinRequestDeleted);
    } catch (error) {
      res.status(500).json({ error: "Error deleting Join Request" });
    }
  }
}

export { JoinRequestController };
