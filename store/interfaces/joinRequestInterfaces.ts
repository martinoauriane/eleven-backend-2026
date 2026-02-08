export interface JoinRequestCreate {
  emitterId: number;
  receiverId: number;  
}

export interface JoinRequestSuccessCreate {
  id : number;
  sentAt: Date;
}