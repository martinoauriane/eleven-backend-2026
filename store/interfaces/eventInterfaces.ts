export interface EventCreate{
  userId: number;
  eventName: string;
  eventType: string // flat-party // clubbing night out // drinks with friends
  eventDate: Date;
  eventStartTime: Date;
  eventEndTime: Date;
  eventLat: number;
  eventLon: number;
  eventAddress: string;
  eventCity: string;
  eventCountry: string;
  isFull: boolean;
  isPublic: boolean;
} 

export interface EventUpdate {
  eventName?: string;
  eventType?: string // flat-party // clubbing night out // drinks with friends
  eventLat?: number;
  eventLon?: number;
  eventAddress?: string;
  eventCity?: string
  eventCuntry?: string
  isFull?: boolean;
  isPublic?: boolean;
}

export interface EventData {
  userId: number;
  eventName: string;
  eventType: string
  eventLat: number;
  eventLon: number;
  eventAddress: string;
  eventCity: string;
  eventCountry: string;
}