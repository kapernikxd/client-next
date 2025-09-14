import { makeAutoObservable, runInAction } from 'mobx';
import { PollData, PollService } from '../../services/poll/PollService';
import uiStore from './ui';
import { PollWithVotesCount } from '../../helpers/models/dtos/PollDto';

export interface PollOption {
  _id: string;
  text: string;
  votes: number;
  voters: string[];
}

class PollStore {
  poll?: PollData = {} as PollData;
  myPolls: PollWithVotesCount[] = [];
  invitationStatuses: any[] = [];

  private pollService: PollService;

  constructor() {
    makeAutoObservable(this);
    this.pollService = new PollService();
  }

  clearPollData = () => {
    this.poll = {} as PollData;
  };

  async fetchPoll(id: string) {
    try {
      const res = await this.pollService.getPoll(id);
      runInAction(() => {
        this.poll = res.data;
      });
    } catch (e) {
      console.error(e);
    }
  }

  async fetchMyPolls() {
    try {
      const res = await this.pollService.getMyPolls();
      runInAction(() => {
        this.myPolls = res.data;
      });
    } catch (e) {
      console.error(e);
    }
  }

  async createPoll(data: any) {
    try {
      const res = await this.pollService.createPoll(data);
      uiStore.showSnackbar('Created', 'success');
      return res.data;
    } catch (e) {
      uiStore.showSnackbar('Failed', 'error');
    }
  }

  async vote(pollId: string, optionIds: string[], comment?: string) {
    try {
      const { data } = await this.pollService.vote(pollId, { optionIds, comment });
      runInAction(() => {
        this.poll = data;
      });
    } catch (e) {
      uiStore.showSnackbar('Failed', 'error');
    }
  }

  async sendInvitations(userIds: string[], pollId: string) {
    try {
      await this.pollService.sendInvitations(userIds, pollId);
    } catch (e) {
      uiStore.showSnackbar('Failed', 'error');
    }
  }

  async fetchInvitationStatuses(pollId: string) {
    try {
      const res = await this.pollService.getInvitationStatuses(pollId);
      runInAction(() => {
        this.invitationStatuses = res.data;
      });
    } catch (e) {
      console.error(e);
    }
  }

  async deletePoll(id: string) {
    try {
      await this.pollService.deletePoll(id);
    } catch (e) {
      uiStore.showSnackbar('Failed', 'error');
    }
  }
}

export default new PollStore();
