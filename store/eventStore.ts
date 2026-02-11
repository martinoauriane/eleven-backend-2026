import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import { EventCreate, EventUpdate, EventData } from "./interfaces/eventInterfaces";
import { UserStore } from "./userStore";

const userStore = new UserStore();

interface IEventStore {
  createEvent(data: EventCreate): Promise<any>;
  getEventById(id: number): Promise<any>;
  updateEvent(id: number, data: EventData): Promise<any>;
  deleteEvent(id: number): Promise<any>;
}

class EventStore implements IEventStore {
    
  async createEvent(data: EventCreate) {
    try {
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
      console.error("Prisma updating event error:", error);
      throw error;
    }
  }

  async addEventParticipant(eventId: number, id: number){
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user){
      throw new Error("User not found");
    }

    if (user?.attendingEventId) { // empêcher l'ubiquité
      throw new Error("User already attending an event");
    }

    try{
      return await prisma.user.update({
        where: {id: id}, 
        data: {
          attendingEventId: eventId
        }
      })
    } catch(error){
      console.error("Prisma adding event participant error");
      throw error;
    }
  }

  async deleteParticipant(userId: number){
    console.log("USER id", userId);
    const user = await userStore.getUserById(userId);
    if(!user){
      throw new Error("User not found");
    }
    console.log("user", user);
    try {
    let deletedP = await prisma.user.update({
        where: { id: userId },
        data: { attendingEventId: null }
    });
    console.log(deletedP);
    return deletedP;
    }catch (error){
      console.error("Prisma removing event participant event error");
      throw error;
    }
  }
 

  async deleteEvent(eventId: number) {
    try {
      return await prisma.event.delete({ where: { id : eventId } });
    } catch (error) {
      console.error("Prisma delete error:", error);
    }
  }
}

export { EventStore };
