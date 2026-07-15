import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma/lib/prisma";
import {
  EventCreate,
  EventUpdate,
  EventData,
} from "./interfaces/eventInterfaces";
import { UserStore } from "./userStore";

const userStore = new UserStore();

type JoinRequestStatus = "NONE" | "SENT" | "ACCEPTED" | "REJECTED";

interface IEventStore {
  createEvent(data: EventCreate): Promise<any>;
  getEventById(id: number): Promise<any>;
  updateEvent(id: number, data: EventData): Promise<any>;
  deleteEvent(id: number): Promise<any>;
  getEventsByDate(date: string, userId: any): Promise<any>;
}

class EventStore implements IEventStore {

  async createEvent(data: EventCreate): Promise<any> {
    const existingEvent = await prisma.event.findFirst({
      where: {
        userId: data.userId,
        AND: [
          {
            eventStartTime: {
              lt: new Date(data.eventEndTime),
            },
          },
          {
            eventEndTime: {
              gt: new Date(data.eventStartTime),
            },
          },
        ],
      },
    });
    if (existingEvent) {
      console.log("EXISTING EVENT");
      console.log(existingEvent);
    } else {
      try {
        let newEvent = await prisma.event.create({ data });
        return newEvent;
      } catch (error) {
        console.error("Prisma creation error:", error);
      }
    }
  }

  async createEventInvite(
  type:any,
  eventHostId: number,  // L'hôte qui invite
  friendId: number,    // L'ami invité
  content:any,
  eventId: number,      // L'événement
  conversationId:number
   ) {
  try {

    // 1. Vérifier que l'événement existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { createdBy: true, participants: true },
    });
    if (!event) throw new Error("Event not found");

    // 2. Vérifier que l'hôte est bien le créateur de l'événement
    if (event.userId !== eventHostId) {
      throw new Error("Only the event host can send invites");
    }

    // 3. Trouver ou créer une conversation entre l'hôte et l'ami
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: { id: { in: [eventHostId, friendId] } },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: eventHostId }, { id: friendId }],
          },
        },
      });
    }

    // 4. Récupérer les infos de l'hôte et de l'ami
    const host = await prisma.user.findUnique({ where: { id: eventHostId } });
    const friend = await prisma.user.findUnique({ where: { id: friendId } });
    if (!host || !friend) throw new Error("User not found");

    // 5. Créer un message pour l'invitation (SANS JoinRequest)
    const message = await prisma.message.create({
      data: {
        type: "event",
        senderId: eventHostId,
        conversationId: conversation.id,
        content: {
          hostId: host.id,
          hostName: `${host.firstName} ${host.lastName}`,
          hostPicture: host.picture,
          friendId: friend.id,
          friendName: `${friend.firstName} ${friend.lastName}`,
          eventId: event.id,
          eventName: event.eventName,
          eventAddress: event.eventAddress,
          eventStartTime: event.eventStartTime,
          date: new Date(),
        },
      },
    });
    return message;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send event invite");
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
            friendId: userId,
          },
        },
      },
    });
  }

  async getEventsCreatedByUser(userId: number): Promise<any> {
    try {
      const eventsCreatedByUser = await prisma.event.findMany({
        where: {
          userId,
        },
        include: {
          participants: true,
        },
      });
      return eventsCreatedByUser;
    } catch (error) {
      console.error("Prisma retrieve error:", error);
    }
  }

  async getAllEvents(): Promise<any> {
    try {
      const events = await prisma.event.findMany({
        include: {
          createdBy: true,
          participants: true,
          joinRequests: true,
        },
      });
      return events;
    } catch (error) {
      console.error("Prisma retrieve error:", error);
    }
  }

  async getUserParticipatingEvents(userId: number) {
    try {
      const events = await prisma.event.findMany({
        where: {
          participants: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          createdBy: true,
          participants: true,
        },
      });
      return events;
    } catch (error) {
      return error;
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
    try {
      let newParticipant = await prisma.event.update({
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
      return newParticipant;
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

  async addNotifications(userName: string, userId: number, eventId: number) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true, eventName: true },
    });
    if (!event) throw new Error("Event not found");
    const existingNotification = await prisma.notification.findFirst({
      where: {
        type: "ON_ITS_WAY",
        senderId: userId,
        receiverId: event.userId,
        eventId: eventId,
      },
    });

    if (existingNotification) {
      throw new Error("Notification already exists");
    }
    try {
      let notificationCreated = await prisma.notification.create({
        data: {
          type: "ON_ITS_WAY",
          message: `${userName} is on their way`,
          senderId: userId,
          receiverId: event.userId,
          eventId,
        },
      });
      return notificationCreated;
    } catch (error) {
      console.error(
        "Error trying to create the event related notification:",
        error,
      );
    }
  }

  async loadEventNotifications(eventId: number) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { eventId },
        orderBy: { createdAt: "desc" },
      });
      if (!notifications) {
        throw new Error("Error");
      }
      return notifications;
    } catch (error) {
      console.error("Error trying to retrieve notifications:", error);
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

  async addPhoto(eventId: number, userId: number, photoUrl: string) {
    try {
      let createdP = prisma.eventPhoto.create({
        data: {
          url: photoUrl,
          eventId: eventId,
          uploadedById: userId,
        },
      });
      return createdP;
    } catch (error) {
      console.error(error);
    }
  }

  async getEventPhotos(eventId: number): Promise<any> {
    try {
      let photos = await prisma.eventPhoto.findMany({
        where: {
          eventId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return photos;
    } catch (error) {
      console.error("Prisma delete error:", error);
    }
  }

  async deletePhoto(photoId: number): Promise<any> {
    try {
      let deletedP = await prisma.eventPhoto.delete({ where: { id: photoId } });
      return deletedP;
    } catch (error) {
      console.error("Prisma delete error:", error);
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
