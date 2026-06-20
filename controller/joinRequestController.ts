import { JoinRequestService } from "../service/joinRequestService";
import { Request, Response } from "express";
import { JoinRequestCreate } from "../store/interfaces/joinRequestInterfaces";

const joinRequestService = new JoinRequestService();

class JoinRequestController {
    
  async createJoinRequest(req: Request, res: Response) {
    try {
      const joinRequest: JoinRequestCreate = {
        eventId: Number(req.params.eventId),
        senderId: Number(req.body.senderId),
        receiverId: Number(req.body.receiverId),
      };
      const joinRequestCreated = await joinRequestService.createJoinRequest(joinRequest);
      res.status(200).json(joinRequestCreated);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Join Request" });
    }
  }
  
  async updateJoinRequestStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;
    try {
      const updatedJoinRequest = await joinRequestService.updateJoinRequestStatus(
        id,
        status,
      );
      res.status(200).json(updatedJoinRequest);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  async getJoinRequest(req: Request, res: Response) {
    try {
      const joinRequest: any = {
        eventId: Number(req.params.eventId),
        emitterId: Number(req.body.emitterId),
        receiverId: Number(req.body.receiverId),
      };
      const retrievedJoinRequest = await joinRequestService.getJoinRequest(joinRequest);
      res.status(200).json(retrievedJoinRequest);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Join Request" });
    }
  }

  async deleteJoinRequest(req: Request, res: Response) {
    try {
      const joinRequest: any = {
        eventId: Number(req.params.eventId),
        emitterId: Number(req.body.emitterId),
        receiverId: Number(req.body.receiverId),
      };
      const joinRequestDeleted =
        await joinRequestService.deleteJoinRequest(joinRequest);
      res.status(200).json(joinRequestDeleted);
    } catch (error) {
      res.status(500).json({ error: "Error deleting Join Request" });
    }
  }

}

export { JoinRequestController };
