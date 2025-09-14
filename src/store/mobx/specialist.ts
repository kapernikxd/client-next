import { makeAutoObservable, runInAction } from 'mobx';
import SpecialistService from '../../services/specialist/SpecialistService';
import uiStore from "./ui";
import { CityItem } from '../../components/form/AutoComplete';

export interface SpecialistService {
  photo: string[];
  name: string;
  price: string;
  currency: string;
  priceType: string;
  time?: string;
}

export interface SpecialistForm {
  enabled: boolean;
  showOnMap: boolean;
  country: string;
  city: string;
  profession: string;
  description: string;
  services: SpecialistService[];
}
export interface ToggleSpecialistFlagDProps {
  enabled: boolean;
}

export type GeoPoint = { type: 'Point'; coordinates: [number, number] };

export type SpecialistMe = {
  enabled: boolean;
  showOnMap?: boolean;
  country?: string;
  city?: string;
  profession?: string;
  description?: string;
  address?: string;
  location?: GeoPoint; // [lng, lat]
  services?: any[];
  portfolioImages?: string[];
  cover?: string;
};

export type UpdateSpecialistInfoDto = {
  showOnMap: boolean;
  country?: string;
  city?: string;
  profession: string;
  description?: string;
  address?: string;
  location?: GeoPoint | null; // если null/omit — сервер уберёт поле
};

class SpecialistStore {
  me: SpecialistMe | null = null;
  user: SpecialistMe | null = null;
  loading = false;
  userLoading = false;
  toggling = false;
  saving = false;
  services: any[] = [];
  servicesLoading = false;
  portfolioUpdating = false;
  coverUpdating = false;
  users: any[] = [];
  usersLoading = false;
  
  link: string = ""; // link from cloud storage

  private specialistService = SpecialistService;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMe() {
    this.loading = true;
    try {
      const me = await this.specialistService.getMe();
      runInAction(() => { this.me = me; });
    } catch (e) {
      uiStore.showSnackbar('Failed to load specialist', 'error');
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  async fetchUsers() {
    this.usersLoading = true;
    try {
      const data = await this.specialistService.getUsers();
      runInAction(() => {
        this.users = data.specialists;
        this.link = data.link;
      });
    } catch (e) {
      uiStore.showSnackbar('Failed to load specialists', 'error');
    } finally {
      runInAction(() => { this.usersLoading = false; });
    }
  }

  async fetchByUserId(id: string) {
    this.userLoading = true;
    try {
      const data = await this.specialistService.getByUserId(id);
      runInAction(() => {
        this.user = data;
      });
    } catch (e) {
      uiStore.showSnackbar('Failed to load specialist', 'error');
    } finally {
      runInAction(() => {
        this.userLoading = false;
      });
    }
  }

  async toggleSpecialistFlag(enabled: boolean) {
    this.toggling = true;
    try {
      await this.specialistService.toggleSpecialistFlag({ enabled });
      runInAction(() => {
        // обновим локально me.enabled, чтобы UI сразу знал текущее состояние
        if (!this.me) this.me = { enabled };
        else this.me.enabled = enabled;
        uiStore.showSnackbar('Updated', 'success');
      });
    } catch (e) {
      runInAction(() => {
        uiStore.showSnackbar('Failed', 'error');
      });
    } finally {
      runInAction(() => { this.toggling = false; });
    }
  }

  async saveInfo(props: UpdateSpecialistInfoDto) {
    this.saving = true;

    try {
      const updated = await this.specialistService.updateInfo(props);
      runInAction(() => {
        this.me = updated;
        uiStore.showSnackbar('Saved', 'success');
      });
    } catch (e) {
      uiStore.showSnackbar('Save failed', 'error');
    } finally {
      runInAction(() => { this.saving = false; });
    }
  }

  async fetchServices() {
    this.servicesLoading = true;
    try {
      const list = await this.specialistService.getServices();
      runInAction(() => { this.services = list; });
    } catch {
      uiStore.showSnackbar('Failed to load services', 'error');
    } finally {
      runInAction(() => { this.servicesLoading = false; });
    }
  }

  public async createService(data: FormData): Promise<void> {
    try {
      const svc = await this.specialistService.createService(data);
      runInAction(() => { this.services.push(svc); });
    } catch {
      uiStore.showSnackbar('Save failed', 'error');
    }
  }

  public async updateService(id: string, data: FormData): Promise<void> {
    try {
      const updated = await this.specialistService.updateService(id, data);
      runInAction(() => {
        const idx = this.services.findIndex((s) => s._id === id);
        if (idx >= 0) this.services[idx] = updated;
      });
    } catch {
      uiStore.showSnackbar('Save failed', 'error');
    }
  }

  public async deleteService(id: string): Promise<void> {
    try {
      await this.specialistService.deleteService(id);
      runInAction(() => {
        this.services = this.services.filter((s) => s._id !== id);
      });
    } catch {
      uiStore.showSnackbar('Delete failed', 'error');
    }
  }

  public async addPortfolioImages(data: FormData): Promise<void> {
    this.portfolioUpdating = true;
    try {
      const images = await this.specialistService.addPortfolioImages(data);
      runInAction(() => {
        if (!this.me) this.me = { enabled: false, portfolioImages: images } as any;
        else this.me.portfolioImages = images;
        uiStore.showSnackbar('Saved', 'success');
      });
    } catch {
      uiStore.showSnackbar('Upload failed', 'error');
    } finally {
      runInAction(() => { this.portfolioUpdating = false; });
    }
  }

  public async deletePortfolioImages(keys: string[]): Promise<void> {
    this.portfolioUpdating = true;
    try {
      const images = await this.specialistService.deletePortfolioImages(keys);
      runInAction(() => {
        if (!this.me) this.me = { enabled: false, portfolioImages: images } as any;
        else this.me.portfolioImages = images;
        uiStore.showSnackbar('Deleted', 'success');
      });
    } catch {
      uiStore.showSnackbar('Delete failed', 'error');
    } finally {
      runInAction(() => { this.portfolioUpdating = false; });
    }
  }

  public async updateCover(data: FormData): Promise<void> {
    this.coverUpdating = true;
    try {
      const cover = await this.specialistService.updateCover(data);
      runInAction(() => {
        if (!this.me) this.me = { enabled: false, cover } as any;
        else this.me.cover = cover;
        uiStore.showSnackbar('Saved', 'success');
      });
    } catch {
      uiStore.showSnackbar('Upload failed', 'error');
    } finally {
      runInAction(() => { this.coverUpdating = false; });
    }
  }
}

export default new SpecialistStore();
