import 'dotenv/config';  // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import {userStore} from "./userStore";
import { JoinRequestData } from '../service/interfaces/serviceInterfaces';
import { isJsonNull } from '@prisma/client/runtime/client';

interface IJoinRequestStore {
  CreateJoinRequest(data: JoinRequestData): Promise<any>;
}

class JoinRequestStore {

    async CreateJoinRequest(data: JoinRequestData) {
        return await prisma.joinRequest.create({ data });
    }
    async getJoinRequest(id) {
        return await prisma.joinRequest.findUnique({ where: { id } });
    }

    async deleteJoinRequest(id) {
        return await prisma.joinRequest.delete({ where: { id } });
    }
}

export { JoinRequestStore };