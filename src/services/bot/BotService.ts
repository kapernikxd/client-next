import { AxiosResponse } from 'axios';
import { $api } from '../../helpers';
import type { Bot } from '../../store/mobx/bot';

export interface CreateBotPayload {
  type: 'info' | 'feedback';
  title: string;
  welcome?: string;
  end?: string;
  options?: { text: string }[];
}

export class BotService {
  async getBots(): Promise<AxiosResponse<Bot[]>> {
    return $api.get('/bots');
  }

  async createBot(data: CreateBotPayload): Promise<AxiosResponse<Bot>> {
    return $api.post('/bots', data);
  }

  async updateBot(id: string, data: CreateBotPayload): Promise<AxiosResponse<Bot>> {
    return $api.put(`/bots/${id}`, data);
  }

  async deleteBot(id: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/bots/${id}`);
  }

  async runBot(data: { botId: string, participants: string[]}): Promise<AxiosResponse<void>> {
    return $api.post(`/bots/run`, data);
  }
}
