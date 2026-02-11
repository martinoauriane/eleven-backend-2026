export interface EventCreate{
  eventName: string;
  eventLat: number;
  eventLon: number;
  eventAddress: string;
  eventPictures?: string[];
  eventTags?: string[];
  eventType?: string // flat-party // clubbing night out // drinks with friends
  city: string
  country: string
  userId: number;
  eventCreatorId: number;
} 

export interface EventUpdate {
  eventName?: string;
  eventLat?: number;
  eventLon?: number;
  eventAddress?: string;
  eventPictures?: string[];
  eventTags?: string[];
  eventType?: string // flat-party // clubbing night out // drinks with friends
  city?: string
  country?: string
}

export interface EventData {
  eventName: string;
  eventLat: number;
  eventLon: number;
  eventAddress: string;
  eventPictures?: string[];
  eventTags?: string[];
  eventType: string // flat-party // clubbing night out // drinks with friends
  city: string
  country: string
  userId: number;
}