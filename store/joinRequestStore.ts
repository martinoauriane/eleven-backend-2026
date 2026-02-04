import 'dotenv/config';  // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";
import {userStore} from "./userStore";

interface JoinRequestData {
  sentAt: Date;
  emitterId: number;
  receiverId: number;  
}


class JoinRequestStore {
    async createUser(data: JoinRequestData) {
        const emitter = await userStore.getUserById(data.emitterId);
        const receiver = await userStore.getUserById(data.receiverId);
        if(emitter != null && receiver != null){
        const newData: any = {
            sentAt: data.sentAt,
            emitter: emitter,
            emitterId: emitter.id,
            receiver: receiver,
            receiverId: receiver.id
        }
        return await prisma.joinRequest.create({ data });
    }
}

    async getUserById(id) {
        return await prisma.user.findUnique({ where: { id } });
    }

    async updateUser(id, data) {
        return await prisma.user.update({ where: { id }, data });
    }

    async deleteUser(id) {
        return await prisma.user.delete({ where: { id } });
    }
}
