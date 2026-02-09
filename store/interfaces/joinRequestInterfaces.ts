export interface JoinRequestCreate {
  emitterId: number;
  receiverId: number;  
}

export interface JoinRequestData {
  id: number;
  sentAt: Date;
  emitterId: number;
  receiverId: number;
  isAccepted: boolean;
}

export interface JoinRequestSuccessCreate {
  id : number;
  sentAt: Date;
}