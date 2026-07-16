import { JoinRequestService } from "../service/joinRequestService";
import { Request, Response } from "express";
import { JoinRequestCreate } from "../store/interfaces/joinRequestInterfaces";

const joinRequestService = new JoinRequestService();

class JoinRequestController {
  async createJoinRequest(req: Request, res: Response) {
    console.log('creating join request');
    try {
      const joinRequest: JoinRequestCreate = {
        eventId: Number(req.params.eventId),
        friendId: Number(req.body.friendId),
        eventHostId: Number(req.body.eventHostId),
      };
      console.log("joinrequest");
      console.log(joinRequest);
      const joinRequestCreated =
        await joinRequestService.createJoinRequest(joinRequest);
        console.log("join request successfullly created");
        console.log(joinRequestCreated);
      res.status(200).json(joinRequestCreated);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Join Request" });
    }
  }

  async updateJoinRequestStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;
    try {
      const updatedJoinRequest =
        await joinRequestService.updateJoinRequestStatus(id, status);
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
      const retrievedJoinRequest =
        await joinRequestService.getJoinRequest(joinRequest);
      res.status(200).json(retrievedJoinRequest);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Join Request" });
    }
  }

  async getAllUserDailyJoinRequests(req: Request, res: Response) {
    try {
      const day = new Date();
      let userId = Number(req.params.userId);
      const allUserJoinRequest = await joinRequestService.getAllUserDailyJoinRequests(day, userId);
      res.status(200).json(allUserJoinRequest);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Join Request" });
    }
  }

  async createMeetRequest(req: Request, res: Response) {
    try {
      const meetRequest: any = {
        senderId: Number(req.params.senderId),
        receiverId: Number(req.body.receiverId),
        latitude: Number(req.body.latitude),
        longitude: Number(req.body.longitude),
        activity: String(req.body.longitude),
      };
      const createdMeetRequest =
        await joinRequestService.createMeetRequest(meetRequest);
      res.status(200).json(createdMeetRequest);
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
