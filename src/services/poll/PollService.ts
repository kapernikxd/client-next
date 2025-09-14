import { AxiosResponse } from 'axios';
import { $api } from '../../helpers';
import { PollDTO, PollOptionDTO, PollWithVotesCount } from '../../helpers/models/dtos/PollDto';
import { UserBasicDTO } from '../../helpers/models/dtos/UserDto';

export interface CreatePollDTO {
  question: string;
  options: string[];
  isAnonymous?: boolean;
  allowComments?: boolean;
  multiChoice?: boolean;
  expiresAt?: string;
}

export interface PollCommentDTO {
  _id: string;
  text: string;
  createdBy: UserBasicDTO;
  createdAt: string;
}

export interface PollData {
  options: PollOptionDTO[];
  poll: PollDTO;
  comments?: PollCommentDTO[];
  voted: boolean;
}

export class PollService {
  async getMyPolls(): Promise<AxiosResponse<PollWithVotesCount[]>> {
    return $api.get('/polls/my');
  }

  async createPoll(data: CreatePollDTO): Promise<AxiosResponse<PollDTO>> {
    return $api.post('/polls', data);
  }

  async vote(
    pollId: string,
    payload: { optionIds: string[]; comment?: string },
  ): Promise<AxiosResponse<PollData>> {
    return $api.post(`/polls/${pollId}/vote`, payload);
  }

  async getPoll(pollId: string): Promise<AxiosResponse<PollData>> {
    const poll = await $api.get(`/polls/${pollId}`);
    return poll;
  }

  async sendInvitations(users: string[], pollId: string): Promise<AxiosResponse<any>> {
    return $api.post(`/polls/${pollId}/invitations`, { recipientIds: users });
  }

  async getInvitationStatuses(pollId: string): Promise<AxiosResponse<any>> {
    return $api.get(`/polls/${pollId}/invitations/statuses`);
  }

  async deletePoll(id: string): Promise<AxiosResponse<202>> {
    return $api.delete(`/polls/${id}`);
  }
}
