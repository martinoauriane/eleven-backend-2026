import 'dotenv/config';  // ⚡ force le chargement de ton .env
import { JoinRequestStore,  } from '../store/joinRequestStore';
import { JoinRequestCreate } from '../store/interfaces/joinRequestInterfaces';

const joinRequestStore = new JoinRequestStore();

class JoinRequestService {

    async createJoinRequest(data: JoinRequestCreate) : Promise<any> {
        console.log("service data", data);
        return await joinRequestStore.CreateJoinRequest(data);
    }
}

export { JoinRequestService };