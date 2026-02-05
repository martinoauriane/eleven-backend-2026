import 'dotenv/config';  // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";

interface PartyCoords{
    lat: number
    lng: number
}

interface UserData {
  firstName : string
  lastName : string 
  email : string 
  picture?: string
  passwordHash : string
  homeAddress : string 
  isOnline : boolean
  status : string // Wants to go     Out / is Partying / is Bored at Party
  lastLogin : Date
  partyAddress: string
  partyLat : number
  partyLon : number  
  friendsNumber : number  
}


interface UserUpdate {
  firstName : string
  lastName : string 
  email : string 
  picture?: string
  passwordHash : string
  homeAddress : string 
  isOnline : boolean
  status : string // Wants to go     Out / is Partying / is Bored at Party
  lastLogin : Date
  partyAddress: string
  partyLat : number
  partyLon : number  
  friendsNumber : number  
}


interface UserCreate {
  firstName : string
  lastName : string 
  email : string 
  picture?: string
  passwordHash : string
  homeAddress : string 
}

interface UserStore {
    createUser(data: UserCreate): Promise<any>;
    getUserById(id: number): Promise<any>;
    updateUser(id: number, data: UserData): Promise<any>;
    deleteUser(id: number): Promise<any>;
}

class UserStore {
    async createUser(data: UserData) {
        return await prisma.user.create({ data });
    }

    async getUserById(id: number) {
        return await prisma.user.findUnique({ where: { id } });
    }

    async updateUser(id: number, data: UserUpdate) {
        return await prisma.user.update({ where: { id }, data });
    }

    async deleteUser(id) {
        return await prisma.user.delete({ where: { id } });
    }
}

export {UserStore};