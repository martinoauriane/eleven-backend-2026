import "dotenv/config"; // ⚡ force le chargement de ton .env
import { prisma } from "../prisma/lib/prisma";
import {
  JoinRequestCreate,
  JoinRequestData,
} from "./interfaces/joinRequestInterfaces";
import { UserStore } from "./userStore";
const userStore = new UserStore();

type JoinRequestStatus = "NONE" | "SENT" | "ACCEPTED" | "REJECTED";

interface IStoryStore {
  CreateStory(
    senderId: any,
    receiverId: any,
    eventId: any,
    eventName: string,
    eventAddress: string,
    eventStartTime: any,
  ): Promise<any>;
}

class StoryStore implements IStoryStore {
  async CreateStory(image:any, userId:number): Promise<any> {
   /*  const existingStory = await prisma.joinRequest.findFirst({
      where: {
        friendId: data.friendId,
        eventId: data.eventId,
        status: {
          in: ["SENT", "ACCEPTED", "REJECTED"],
        },
      },
    });
    if (existingStory) {
      throw new Error("Join request already exists");
    } */
    try {
      const story = await prisma.story.create({
        data: {
          userId,
          url: image,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      return story;
    } catch (error) {
      console.error(error);
      throw new Error("ERROR IN createJoinRequest");
    }
  }

  async getStory(
    senderId: number,
    receiverId: number,
    eventId: number,
  ): Promise<any> {
    try {
      const message = await prisma.message.findFirst({
        where: {
          joinRequest: {
            senderId,
            receiverId,
            eventId,
          },
        },
        include: {
          joinRequest: true,
        },
      });
      return message;
    } catch (error) {
      console.error(
        "prisma error trying to retrieve specific joinRequest",
        error,
      );
      throw error;
    }
  }

  async deleteStory(senderId: number, receiverId: number) {
    // delete n'en supprime qu'un seul à la fois
    // deleteMany en supprime plusieurs
    try {
      const result = await prisma.joinRequest.deleteMany({
        where: {
          senderId: senderId,
          receiverId: receiverId,
        },
      });
      return result;
    } catch (error) {
      console.error(
        "prisma error trying to delete specific joinRequest",
        error,
      );
    }
  }
}

export { StoryStore };
