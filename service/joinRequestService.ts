import 'dotenv/config';  // ⚡ force le chargement de ton .env
import { UserStore } from "../store/userStore";
import { JoinRequestStore,  } from '../store/joinRequestStore';
import { JoinRequestCreate } from '../store/interfaces/joinRequestInterfaces';

const joinRequestStore = new JoinRequestStore();
const userStore = new UserStore();

class JoinRequestService {

    async createJoinRequest(data: JoinRequestCreate) : Promise<any> {
        return await joinRequestStore.CreateJoinRequest(data);
    }
}

export { JoinRequestService };