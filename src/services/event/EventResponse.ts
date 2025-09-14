import { UserDTO, UserId, PostDTO, PostFilesDTO, PostId  } from "../../helpers";
import { EventParticipant } from "../../store/mobx/event";


export type EventResponse = Omit<PostDTO, "postedBy" | "images" | "startDate"> & {
  postedBy: UserDTO;
  images: PostFilesDTO[];
  startDate: string;
  hours?: string[];
};

export interface EventsResponseExtend {
  data: EventResponse[];
  size: number;
}

export interface StatusSuccess {
  message: string;
  code: 200;
}

export interface StatusError {
  message: string;
  code: 500;
}

export type EventParticipateResponse = {
  postedBy: UserId;
  participants: EventParticipant[];
  isModerated: boolean;
};

export type ParticipateResponse = {
  postId: PostId;
  participants: UserId[];
};

export type ViewResponse = {
  views: UserId[];
};

export type LikesResponse = {
  likes: UserId[];
  postId: PostId;
};

export type InvitationsResponse = Omit<PostDTO, "postedBy" | "images" | "startDate"> & {
  postedBy: UserDTO;
  images: PostFilesDTO[];
  startDate: string;
  invitationId: string;
};

export type GeoResponse = {
  country?: string,
  city?: string,
  coordinates?: [number, number]
}