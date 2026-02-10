import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import { EventCreate, EventUpdate, EventData } from "./interfaces/eventInterfaces";

interface IEventStore {
  createEvent(data: EventCreate): Promise<any>;
  getEventById(id: number): Promise<any>;
  updateEvent(id: number, data: EventData): Promise<any>;
  deleteEvent(id: number): Promise<any>;
}

class EventStore implements IEventStore {
    
  async createEvent(data: EventCreate) {
    try {
      console.log("event create data");
      return await prisma.event.create({ data });
    } catch (error) {
      console.error("Prisma creation error:", error);
    }
  }

  async getEventById(id: number) {
    try {
      return await prisma.event.findUnique({ where: { id } });
    } catch (error) {
      console.error("Prisma retrieve error:", error);
    }
  }

  async updateEvent(id: number, data: EventUpdate) {
    try {
      return await prisma.event.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("Prisma update error:", error);
      throw error;
    }
  }

  async deleteEvent(id: number) {
    try {
      return await prisma.event.delete({ where: { id } });
    } catch (error) {
      console.error("Prisma delete error:", error);
    }
  }
}

export { EventStore };
