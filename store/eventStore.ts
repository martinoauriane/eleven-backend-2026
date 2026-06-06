import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma/lib/prisma";
import {
  EventCreate,
  EventUpdate,
  EventData,
} from "./interfaces/eventInterfaces";
import { UserStore } from "./userStore";

const userStore = new UserStore();

interface IEventStore {
  createEvent(data: EventCreate): Promise<any>;
  getEventById(id: number): Promise<any>;
  updateEvent(id: number, data: EventData): Promise<any>;
  deleteEvent(id: number): Promise<any>;
  getEventsByDate(date: string, userId: any): Promise<any>;
}

class EventStore implements IEventStore {
  async createEvent(data: EventCreate): Promise<any> {
    try {
      return await prisma.event.create({ data });
    } catch (error) {
      console.error("Prisma creation error:", error);
    }
  }

  async getEventById(id: number): Promise<any> {
    try {
      const event: EventData | null = await prisma.event.findUnique({
        where: { id },
      });
      if (!event) {
        return null;
      }
      const user = await prisma.user.findUnique({
        where: { id: event.userId },
      });
      return { event, user };
    } catch (error) {
      console.error("Prisma retrieve error:", error);
      throw error;
    }
  }

  async getEventsByDate(date: string, userId: any): Promise<any> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    return prisma.event.findMany({
      where: {
        eventStartTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        createdBy: true,
        participants: true,
        joinRequests: {
          where: {
            emitterId: userId,
          },
        },
      },
    });
  }

  async getAllEvents(): Promise<any> {
    try {
      const events = await prisma.event.findMany({
        include: {
          createdBy: true,
          participants: true,
        },
      });
      return events;
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
      console.error("Prisma updating event error:", error);
      throw error;
    }
  }

  async addEventParticipant(eventId: number, id: number): Promise<any> {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }
    if (user?.attendingEventId) {
      throw new Error("User already attending an event");
    }
    try {
      return await prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          participants: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } catch (error) {
      console.error("Prisma adding event participant error");
      throw error;
    }
  }

  async getEventParticipants(eventId: number): Promise<any> {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          participants: true,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }
      return event.participants;
    } catch (error) {
      console.error("Prisma get event participants error:", error);
      throw error;
    }
  }

  async deleteParticipant(userId: number, eventId: number): Promise<any> {
    const user = await userStore.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    try {
      let deletedP = await prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          participants: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
      return deletedP;
    } catch (error) {
      console.error("Prisma removing event participant event error");
      throw error;
    }
  }

  async deleteEvent(eventId: number): Promise<any> {
    try {
      return await prisma.event.delete({ where: { id: eventId } });
    } catch (error) {
      console.error("Prisma delete error:", error);
    }
  }
}

export { EventStore };
