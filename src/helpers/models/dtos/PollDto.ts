import { UserBasicDTO } from "./UserDto";

export interface PollOptionDTO {
  _id: string;
  text: string;
  votes: number;
  voters: UserBasicDTO[];
}

export interface PollDTO {
  _id: string;
  question: string;
  isAnonymous: boolean;
  allowComments: boolean;
  multiChoice: boolean;
  expiresAt?: string;
  createdBy: UserBasicDTO;
  createdAt: string;
}

export interface PollWithVotesCount extends PollDTO {
  votesCount: number;
}
