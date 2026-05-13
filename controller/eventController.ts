import { EventService } from "../service/eventService";
import { Request, Response } from "express";
import { EventCreate } from "../store/interfaces/eventInterfaces";
const eventService = new EventService();

class EventController {
  async newEvent(req: Request, res: Response) {
    const userId = parseInt(String(req.params.userId));
    const newEvent: EventCreate = {
      userId: userId,
      eventName: String(req.body.eventName),
      eventLat: parseFloat(req.body.eventLat),
      eventLon: parseFloat(req.body.eventLon),
      eventAddress: String(req.body.eventAddress),
      eventDate: req.body.eventDate,
      eventType: req.body.eventType,
      eventStartTime: req.body.eventStartTime,
      eventEndTime: req.body.eventEndTime,
      eventCity: String(req.body.eventCity),
      eventCountry: String(req.body.eventCountry),
      isFull: req.body.isFull,
      isPublic: req.body.isPublic,
    };
    try {
      const eventCreated = await eventService.createEvent(newEvent);
      res.status(200).json(eventCreated);
    } catch (error) {
      res.status(500).json({ error: "Error creating new event" });
    }
  }

  async returnEventById(req: Request, res: Response) {
    const eventId = Number(req.params.eventId);
    try {
      const { event, user } = await eventService.getEvent(eventId);
      const finalResult = {
        ...event,
        userCreator: user,
      };

      res.status(200).json(finalResult);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving event" });
    }
  }

  async getAllEvents(req: Request, res: Response) {
    try {
      const controllersEvent = await eventService.getAllEvents();
      res.status(200).json(controllersEvent);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving event" });
    }
  }

  async getEventsByDate(req: Request, res: Response) {
    try {
      const date  = String(req.params);
      const events = await eventService.getEventsByDate(date);
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({
        error: "Error retrieving events by date",
      });
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
        details: error.message, //
      });
    }
  }

  async addParticipants(req: Request, res: Response) {
    const eventId = Number(req.params.event_id);
    if (isNaN(eventId)) {
      res.status(400).json({ error: "Invalid event id" });
    }
    const userId = Number(req.params.user_id);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user id" });
    }
    try {
      const addedParticipant = await eventService.addEventParticipants(
        eventId,
        userId,
      );
      res.status(200).json(addedParticipant);
    } catch (error: any) {
      console.error("ADD PARTICIPANT ERROR:", error);
      res.status(500).json({
        error: "Error adding participants to the event",
        details: error.message,
      });
    }
  }

  async getParticipants(req: Request, res: Response) {
    const eventId = Number(req.params.eventId);
    if (isNaN(eventId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    try {
      const participantsList = await eventService.getEventParticipants(eventId);
      res.status(200).json(participantsList);
    } catch (error: any) {
      res.status(500).json({
        error: "Error retrieving event participants",
        details: error.message,
      });
    }
  }

  async deleteParticipant(req: Request, res: Response) {
    const userId = Number(req.params.user_id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    try {
      const removedParticipant = await eventService.deleteParticipant(userId);
      res.status(200).json(removedParticipant);
    } catch (error: any) {
      res.status(500).json({
        error: "Error adding participants to the event",
        details: error.message, //
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
