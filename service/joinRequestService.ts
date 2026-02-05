import 'dotenv/config';  // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import {UserStore} from "../store/userStore";
import { JoinRequestStore } from '../store/joinRequestStore';
import {JoinRequestData} from "./interfaces/serviceInterfaces";

const joinRequestStore = new JoinRequestStore();
const userStore = new UserStore();

class JoinRequestService {

    async createJoinRequest(data: any) : Promise<any> {
        const emitter = await userStore.getUserById(data.emitterId);
        const receiver = await userStore.getUserById(data.receiverId);
        if(emitter != null && receiver != null){
        const newData: JoinRequestData = {
            sentAt: data.sentAt,
            emitter: emitter,
            emitterId: emitter.id,
            receiver: receiver,
            receiverId: receiver.id
        }
        return await joinRequestStore.CreateJoinRequest(newData);
    }
}
}

export { JoinRequestService };