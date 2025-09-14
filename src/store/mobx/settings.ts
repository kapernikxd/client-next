import { makeAutoObservable, runInAction } from "mobx";
import { PostSettingsDTO } from "../../helpers/models/dtos/PostSettingsDto";
import { PostSettingsService } from "../../services/post/PostSettingsService";
import uiStore from "./ui";

export type ReminderTime = 30 | 60 | 120 | 1440;

export interface PostSettings extends Omit<PostSettingsDTO, "reminderTimes"> {
  reminderTimes: ReminderTime[];
}

const defaultSettings: PostSettings = {
  reminderTimes: [],
  showQr: false,
  addToCalendar: false,
  admins: [],
  allowImages: true,
};

class SettingsStore {
  postSettings: Record<string, PostSettings> = {};
  private service: PostSettingsService;

  constructor() {
    makeAutoObservable(this);
    this.service = new PostSettingsService();
  }

  async fetchPostSettings(postId: string) {
    try {
      const { data } = await this.service.getSettings(postId);
      runInAction(() => {
        this.postSettings[postId] = {
          ...defaultSettings,
          ...data,
          reminderTimes: data.reminderTimes as ReminderTime[],
        };
      });
    } catch (e) {
      console.error(e);
    }
  }

  async updatePostSettings(postId: string, settings: Partial<PostSettings>) {
    const current = this.postSettings[postId] ?? { ...defaultSettings };
    const payload = { ...current, ...settings };
    try {
      const { data } = await this.service.updateSettings(postId, payload);
      runInAction(() => {
        this.postSettings[postId] = {
          ...defaultSettings,
          ...data,
          reminderTimes: data.reminderTimes as ReminderTime[],
        };
        uiStore.showSnackbar("Saved", "success");
      });
    } catch (e) {
      console.error(e);
      runInAction(() => {
        this.postSettings[postId] = current;
        uiStore.showSnackbar("Save failed", "error");
      });
    }
  }

  getPostSettings = (postId: string): PostSettings =>
    this.postSettings[postId] ?? { ...defaultSettings };
}

export default new SettingsStore();
