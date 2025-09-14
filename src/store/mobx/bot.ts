import { makeAutoObservable, runInAction } from "mobx";
import { BotService } from "../../services/bot/BotService";
import uiStore from "./ui";

export type BotType = 'info' | 'feedback';

export interface Bot {
  _id: string;
  type: BotType;
  name: string;
  questions: number;
  welcome?: string;
  createdBy: string;
  end?: string;
  options?: { text: string }[];
}

export interface BotFormValues {
  type: BotType;
  title: string;
  welcome: string;
  end: string;
  options: { text: string }[];
}

class BotStore {
  bots: Bot[] = [];

  private botService: BotService;

  constructor() {
    makeAutoObservable(this);
    this.botService = new BotService();
  }

  async fetchBots() {
    try {
      const res = await this.botService.getBots();
      runInAction(() => {
        this.bots = res.data;
      });
    } catch (e) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async createBot(data: BotFormValues) {
    try {
      const res = await this.botService.createBot({
        type: data.type,
        title: data.title,
        welcome: data.welcome,
        end: data.end,
        options: data.options,
      });
      runInAction(() => {
        this.bots.push(res.data);
      });
      uiStore.showSnackbar("Created", "success");
      return res.data;
    } catch (e) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async updateBot(id: string, data: BotFormValues) {
    try {
      const res = await this.botService.updateBot(id, {
        type: data.type,
        title: data.title,
        welcome: data.welcome,
        end: data.end,
        options: data.options,
      });
      runInAction(() => {
        const index = this.bots.findIndex((b) => b._id === id);
        if (index !== -1) {
          this.bots[index] = res.data;
        }
      });
      uiStore.showSnackbar("Updated", "success");
    } catch (e) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async deleteBot(id: string) {
    try {
      await this.botService.deleteBot(id);
      runInAction(() => {
        this.bots = this.bots.filter((b) => b._id !== id);
      });
      uiStore.showSnackbar("Deleted", "success");
    } catch (e) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  getBot(id: string) {
    return this.bots.find((b) => b._id === id);
  }

  /**
   * Launches a bot for selected participants
   */
  async runBotForParticipants(botId: string, participants: string[]) {
    const bot = this.getBot(botId);
    if (!bot) return;

    await this.botService.runBot({botId, participants});
  }
}

export default new BotStore();
