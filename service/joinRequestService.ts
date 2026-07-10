import "dotenv/config"; // ⚡ force le chargement de ton .env
import { JoinRequestStore } from "../store/joinRequestStore";
import {
  JoinRequestCreate,
  JoinRequestData,
} from "../store/interfaces/joinRequestInterfaces";

const joinRequestStore = new JoinRequestStore();

type JoinRequestStatus = "NONE" | "SENT" | "ACCEPTED" | "REJECTED";

class JoinRequestService {
  async createJoinRequest(data: JoinRequestCreate): Promise<any> {
    return await joinRequestStore.CreateJoinRequest(data);
  }

  async updateJoinRequestStatus(
    joinRequestId: number,
    status: JoinRequestStatus,
  ) {
    return await joinRequestStore.updateJoinRequestStatus(
      joinRequestId,
      status,
    );
  }

  async getJoinRequest(
    data: JoinRequestCreate,
  ): Promise<JoinRequestData | null> {
    const response: JoinRequestData | null =
      await joinRequestStore.getJoinRequest(
        data.senderId,
        data.receiverId,
        data.eventId,
      );
    return response;
  }

  async createMeetRequest(data: any) {
    const response = await joinRequestStore.createMeetRequest(data);
    return response;
  }
  async deleteJoinRequest(data: JoinRequestCreate): Promise<any> {
    return await joinRequestStore.deleteJoinRequest(
      data.senderId,
      data.receiverId,
    );
  }
}

export { JoinRequestService };
