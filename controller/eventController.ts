
import { EventService } from "../service/eventService";
import { Request, Response } from "express";

const eventService = new EventService();

class EventController {
    
    async newEvent(req: Request, res: Response) {
    const event = req.body;
    try {
        const eventCreated = await eventService.createEvent(event);
        res.status(200).json(eventCreated);
    } catch (error) {
        res.status(500).json({ error: "Error creating new event" });
    }
    }

    async returnEvent(req: Request, res: Response) {
        const id = Number(req.params.event_id);
        try {
            const event = await eventService.getEventById(id);
            if (event) {
                res.status(200).json(event);
            } else {
                res.status(404).json({ error: "Event not found" });
            }
        } catch (error) {
            res.status(500).json({ error: "Error retrieving event" });
        }
    }

    async updateEvent(req: Request, res: Response) {
        const data = req.body;
        const event_id = Number(req.params.event_id);
        if (isNaN(event_id)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        try {
            const updatedEvent = await eventService.updateEvent(data, event_id);
            res.status(200).json(updatedEvent);
        } catch (error: any) {
            console.error("Prisma update error:", error); 
            res.status(500).json({ 
                error: "Error updating event",
                details: error.message //
            });
        }
    }

    async addParticipants(req: Request, res:Response){
        const eventId = Number(req.params.event_id);
         if (isNaN(eventId)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        const userId = Number(req.params.user_id);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        console.log("user id", userId);
        console.log("event id", eventId);
        try {
        const addedParticipant = await eventService.addParticipant(eventId, userId);
        return addedParticipant;
        } catch(error: any){
            res.status(500).json({ 
                error: "Error adding participants to the event",
                details: error.message 
            });
            console.log(error);
        }
    }

        async deleteParticipant(req: Request, res:Response){
        const userId = Number(req.params.user_id);
         if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        try {
            const removedParticipant = await eventService.deleteParticipant(userId);
            return removedParticipant;
        } catch(error:any){
            res.status(500).json({ 
                error: "Error adding participants to the event",
                details: error.message //
            });
        }
      }

    async deleteEvent(req: Request, res: Response) {
        const event_id = Number(req.params.event_id);
        try {
            await eventService.deleteEvent(event_id);
            res.status(200).json({ message: "Event deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Error deleting user" });
        }
    }
}

export { EventController };
