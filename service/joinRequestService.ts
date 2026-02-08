import "dotenv/config"; // ⚡ force le chargement de ton .env
import { JoinRequestStore } from "../store/joinRequestStore";
import { JoinRequestCreate } from "../store/interfaces/joinRequestInterfaces";

const joinRequestStore = new JoinRequestStore();

class JoinRequestService {

  async createJoinRequest(data: JoinRequestCreate): Promise<any> {
    return await joinRequestStore.CreateJoinRequest(data);
  }

  async getJoinRequest(data: JoinRequestCreate): Promise<any> {
    console.log("service data", data);
    return await joinRequestStore.getJoinRequest(
      data.emitterId,
      data.receiverId,
    );
  }

  async deleteJoinRequest(data: JoinRequestCreate): Promise<any> {
    return await joinRequestStore.deleteJoinRequest(
      data.emitterId,
      data.receiverId,
    );
  }
}

export { JoinRequestService };
