import { makeAutoObservable, runInAction } from "mobx";
import { UserDTO } from "../../helpers";
import ProfileService, { AiBotUpdatePayload } from "../../services/profile/ProfileService";
import uiStore from "./ui";

export interface AiBotFormValues {
  name: string;
  lastname: string;
  profession?: string;
  userBio?: string;
  aiPrompt?: string;
}

type AvatarFile = { uri: string; name: string; type: string };

class AiBotStore {
  bots: UserDTO[] = [];
  private profileService = ProfileService;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchBots() {
    try {
      const { data } = await this.profileService.getAiBots();
      runInAction(() => {
        this.bots = data;
      });
    } catch (e) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async createBot(formData: FormData) {
    try {
      const { data } = await this.profileService.createAiBot(formData);
      runInAction(() => {
        this.bots.push(data);
      });
      uiStore.showSnackbar("Created", "success");
      return data;
    } catch (e) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async updateBot(id: string, data: AiBotUpdatePayload, avatar?: AvatarFile) {
    try {
      let updated: UserDTO | undefined;

      if (Object.keys(data).length) {
        const res = await this.profileService.updateAiBot(id, data);
        updated = res.data;
      }

      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar as any);
        const res = await this.profileService.uploadAiBotAvatar(id, formData);
        updated = res.data;
      }

      if (updated) {
        runInAction(() => {
          const idx = this.bots.findIndex(b => b._id === id);
          if (idx !== -1) this.bots[idx] = updated!;
        });
        uiStore.showSnackbar("Updated", "success");
      }
    } catch (e) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async deleteBot(id: string) {
    try {
      await this.profileService.deleteAiBot(id);
      runInAction(() => {
        this.bots = this.bots.filter(b => b._id !== id);
      });
      uiStore.showSnackbar("Deleted", "success");
    } catch (e) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  getBot(id: string) {
    return this.bots.find(b => b._id === id);
  }
}

export default new AiBotStore();
