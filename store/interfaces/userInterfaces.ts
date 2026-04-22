import { MoodStatus } from "@prisma/client";

export interface UserCreate {
    firstName: string;
    lastName: string;
    email: string;
    homeAddress: string;
    password: string;
}

export interface UserUpdate {
  firstName?: string
  lastName?: string 
  email?: string 
  picture?: string
  password?: string
  homeAddress?: string 
  isOnline?: boolean
  isOnMap?: boolean
  userLat?: number
  userLon?: number
  status?: MoodStatus // Wants to go out / is Partying / is Bored at Party
  lastLogin?: Date | string
  partyAddress?: string
  partyLat?: number
  partyLon?: number  
  friendsNumber?: number  
}

export interface UserData {
  firstName : string
  lastName : string 
  email : string 
  picture?: string
  password : string
  homeAddress? : string 
  isOnline : boolean
  isOnMap : boolean
  userLat : number
  userLon : number
  status : string // Wants to go     Out / is Partying / is Bored at Party
  lastLogin : Date
  partyAddress: string
  partyLat : number
  partyLon : number  
  friendsNumber : number 
}

