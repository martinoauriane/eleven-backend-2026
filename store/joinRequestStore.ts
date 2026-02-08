import 'dotenv/config';  // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import {UserStore} from "./userStore";
import { JoinRequestCreate } from './interfaces/joinRequestInterfaces';

const userStore = new UserStore();

interface IJoinRequestStore {
  CreateJoinRequest(data: JoinRequestCreate): Promise<any>;
}

class JoinRequestStore implements IJoinRequestStore{

    async CreateJoinRequest(data: JoinRequestCreate): Promise<any> {
    try {
        return await prisma.joinRequest.create({ data });
    } catch(error){
        console.error("prisma error trying to create joinRequest", error);
    }
    }

    async getJoinRequest(id: number) {
        return await prisma.joinRequest.findUnique({ where: { id } });
    }

    async deleteJoinRequest(id: number) {
        return await prisma.joinRequest.delete({ where: { id } });
    }
}

export { JoinRequestStore };