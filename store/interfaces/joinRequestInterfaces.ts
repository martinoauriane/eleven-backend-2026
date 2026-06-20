export interface JoinRequestCreate {
  senderId: number;
  receiverId: number;  
  eventId: number;
  eventName: string;
  eventAddress: string;
  eventStartTime: any;
}

export type JoinRequestStatus = "NONE" | "SENT" | "ACCEPTED" | "REJECTED";

export interface JoinRequestData {
  sentAt: Date;
  status: JoinRequestStatus;
  id: number;
  emitterId: number;
  receiverId: number;
  eventId: number;
}

export interface JoinRequestSuccessCreate {
  id : number;
  sentAt: Date;
}