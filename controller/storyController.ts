import { StoryService } from "../service/storyService";
import { Request, Response } from "express";

const storyService = new StoryService();

class StoryController {
    
  async createStory(req: Request, res: Response) {
    try {
      const { image } = req.body;
      const userId = Number(req.params.userId);
      const storyCreated = await storyService.createStory(image, userId);
      console.log("story successfullly created");
      console.log(storyCreated);
      res.status(200).json(storyCreated);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Join Request" });
    }
  }
/* 
  async updateStory(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;
    try {
      const updatedJoinRequest = await storyService.updateStory(
        id,
        status,
      );
      res.status(200).json(updatedJoinRequest);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  } */

  async getStory(req: Request, res: Response) {
    try {
      const joinRequest: any = {
        eventId: Number(req.params.eventId),
        emitterId: Number(req.body.emitterId),
        receiverId: Number(req.body.receiverId),
      };
      const retrievedJoinRequest = await storyService.getStory(joinRequest);
      res.status(200).json(retrievedJoinRequest);
    } catch (error) {
      res.status(500).json({ error: "Error creating new Join Request" });
    }
  }

  async deleteStory(req: Request, res: Response) {
    try {
      const joinRequest: any = {
        eventId: Number(req.params.eventId),
        emitterId: Number(req.body.emitterId),
        receiverId: Number(req.body.receiverId),
      };
      const joinRequestDeleted = await storyService.deleteStory(joinRequest);
      res.status(200).json(joinRequestDeleted);
    } catch (error) {
      res.status(500).json({ error: "Error deleting Join Request" });
    }
  }
}

export { StoryController };
