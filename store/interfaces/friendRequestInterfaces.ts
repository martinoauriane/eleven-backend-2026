export interface FriendRequestCreate {
  emitterId: number;
  receiverId: number;  
}

export interface FriendRequestData {
  id: number;
  sentAt: Date;
  emitterId: number;
  receiverId: number;
  isAccepted: boolean;
}

export interface FriendRequestSuccessCreate {
  id : number;
  sentAt: Date;
}