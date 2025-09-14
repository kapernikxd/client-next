import { ChatId } from "./ChatDto";
import { UserId } from "./UserDto";

export enum EventType {
  EVENT = "EVENT",
  PLACE = "PLACE",
}

export enum AccessType {
  COMMON = "COMMON",
  SUBSCRIBERS = "SUBSCRIBERS",
  PRIVATE = "PRIVATE",
}

export type LatLngTuple = [number, number]

type TLocation = {
  type: "Point";
  coordinates: LatLngTuple;
};

interface LocationDTO {
  type: string;
  coordinates: [number, number];
}

export type PostId = string;
export type ImageId = string;

export interface PostDTO<TPostedBy = UserId, TImages = ImageId[]> {
  _id: PostId;
  title: string;
  description: string;
  eventType?: EventType;
  accessType: AccessType;
  images: TImages;
  startDate?: Date;
  endDate?: string;
  address?: string;
  location: TLocation;
  mapPosition: any;
  postedBy: TPostedBy;
  likes: UserId[];
  views: string[];
  participants: UserId[];
  maxParticipants?: number;
  isParticipantsModerated?: boolean;
  retweetUsers: UserId[];
  retweetData?: PostDTO;
  replyTo?: PostDTO;
  chat?: ChatId;
  pinned: boolean;
  channelLink?: string;
  categories?: string[];
  postStatus: string;
  moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  moderationImageStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  price?: EventPriceType;
}

export interface PostFilesDTO {
  _id: ImageId;
  name: string;
  path: string;
  post: PostId;}


export interface EventPriceType {
  range?: string;
  amount?: number;
  currency?: 'RUB' | 'EUR' | 'USD' | 'RSD';
  donation?: boolean;
}