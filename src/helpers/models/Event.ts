import { AccessType, EventType, LatLngTuple } from "./dtos/PostDto";

export interface ICreateEditEvent {
  _id?: string;
  title: string;
  description: string;
  eventType: EventType;
  accessType: AccessType;
  imageUploades: any;
  startDate?: string;
  endDate?: string;
  address: string;
  coordinates: LatLngTuple;
  categories?: string[];
  channelLink?: string;
  maxParticipants?: number | null;
  isParticipantsModerated?: boolean;
}

export interface ICreateEditPlace {
  _id?: string;
  title: string;
  description: string;
  imageUploades: any;
  address: string;
  coordinates: LatLngTuple;
  eventType: EventType;
  channelLink: string;
  categories?: string[];
  maxParticipants?: number | null;
  isParticipantsModerated?: boolean;
}

export interface ICreateEditEventPlace extends ICreateEditEvent {
  eventType: EventType;
  channelLink: string;
}