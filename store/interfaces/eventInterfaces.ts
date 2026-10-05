import { ActivityCategory, ActivityType } from "@prisma/client";

export interface EventCreate {
  HostId: number;
  eventName: string;

  category: ActivityCategory;
  activityType: ActivityType;

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

export interface EventData {
  HostId: number;
  eventName: string;
  eventLat: number;
  eventLon: number;
  eventAddress: string;
  eventCity: string;
  eventCountry: string;
  category: ActivityCategory;
  activityType: ActivityType;
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
