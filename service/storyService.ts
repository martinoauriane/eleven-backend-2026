import "dotenv/config"; // ⚡ force le chargement de ton .env
import { StoryStore } from "../store/storyStore";
import {
  JoinRequestCreate,
  JoinRequestData,
} from "../store/interfaces/joinRequestInterfaces";

const storyStore = new StoryStore();

class StoryService {
  async createStory(image:any, userId:number): Promise<any> {
    return await storyStore.CreateStory(image, userId);
  }

/*   async updateJoinRequestStatus(
    joinRequestId: number,
    status: JoinRequestStatus,
  ) {
    return await storyStore.updateStory(
      joinRequestId,
      status,
    );
  } */

  async getStory(
    data: JoinRequestCreate,
  ): Promise<JoinRequestData | null> {
    const response: JoinRequestData | null =
      await storyStore.getStory(
        data.friendId,
        data.eventHostId,
        data.eventId,
      );
    return response;
  }

  async deleteStory(data: JoinRequestCreate): Promise<any> {
    return await storyStore.deleteStory(
      data.friendId,
      data.eventHostId,
    );
  }
}

export { StoryService };
