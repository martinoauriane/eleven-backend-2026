
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

    async returnEventById(req: Request, res: Response) {
        const id = Number(req.params.event_id);
        try {
            const event = await eventService.getEventById(id);
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving event" });
        }
    }

     async getAll(req: Request, res: Response) {
        try {
            const controllersEvent = await eventService.getAllEvents();
            res.status(200).json(controllersEvent);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving event" });
        }
    }

    async updateEvent(req: Request, res: Response) {
        const data = req.body;
        const event_id = Number(req.params.event_id);
        if (isNaN(event_id)) {
            res.status(400).json({ error: "Invalid id" });
        }
        try {
            const updatedEvent = await eventService.updateEvent(data, event_id);
            res.status(200).json(updatedEvent);
        } catch (error: any) {
            res.status(500).json({ 
                error: "Error updating event",
                details: error.message //
            });
        }
    }

    async addParticipants(req: Request, res:Response){
        const eventId = Number(req.params.event_id);
         if (isNaN(eventId)) {
            res.status(400).json({ error: "Invalid event id" });
        }
        const userId = Number(req.params.user_id);
        if (isNaN(userId)) {
            res.status(400).json({ error: "Invalid user id" });
        }
        try {
        const addedParticipant = await eventService.addParticipant(eventId, userId);
        return addedParticipant;
        } catch(error: any){
            res.status(500).json({ 
                error: "Error adding participants to the event",
                details: error.message 
            });
        }
    }

        async deleteParticipant(req: Request, res:Response){
        const userId = Number(req.params.user_id);
         if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user id" });
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
