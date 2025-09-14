import { AxiosResponse } from "axios";
import { $api } from "../../helpers";
import { SpecialistMe, ToggleSpecialistFlagDProps, UpdateSpecialistInfoDto } from "../../store/mobx/specialist";


export class SpecialistService {

  public async getMe(): Promise<SpecialistMe> {
    const { data } = await $api.get('/specialist/me');
    return data;
  }

  public async getByUserId(id: string): Promise<SpecialistMe> {
    const { data } = await $api.get(`/specialist/user/${id}`);
    return data;
  }

  public async getUsers(): Promise<any> {
    const { data } = await $api.get('/specialist/users');
    return data;
  }

  public async toggleSpecialistFlag(data: ToggleSpecialistFlagDProps): Promise<AxiosResponse<boolean, any>> {
    return $api.post("/specialist/enabled", data);
  }

  public async updateInfo(dto: UpdateSpecialistInfoDto): Promise<SpecialistMe> {
    const { data } = await $api.put('/specialist/me', dto);
    return data;
  }

  public async getServices(): Promise<any[]> {
    const { data } = await $api.get('/specialist/service');
    return data;
  }

  public async createService(props: FormData): Promise<any> {
    const { data } = await $api.post('/specialist/service', props, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  public async updateService(id: string, props: FormData): Promise<any> {
    const { data } = await $api.put(`/specialist/service/${id}`, props, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  public async deleteService(id: string): Promise<boolean> {
    const { data } = await $api.delete(`/specialist/service/${id}`);
    return data;
  }

  public async updateCover(props: FormData): Promise<string> {
    const { data } = await $api.post('/specialist/cover', props, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  public async addPortfolioImages(props: FormData): Promise<string[]> {
    const { data } = await $api.post('/specialist/portfolio', props, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  public async deletePortfolioImages(keys: string[]): Promise<string[]> {
    const { data } = await $api.delete('/specialist/portfolio', {
      data: { keys },
    });
    return data;
  }
}

export default new SpecialistService();
