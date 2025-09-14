import { AxiosResponse } from "axios";
import { $api } from "../../helpers";
import { PostSettingsDTO } from "../../helpers/models/dtos/PostSettingsDto";

export class PostSettingsService {
  async getSettings(postId: string): Promise<AxiosResponse<PostSettingsDTO>> {
    return $api.get(`/post-settings/${postId}`);
  }

  async updateSettings(
    postId: string,
    data: Partial<PostSettingsDTO>
  ): Promise<AxiosResponse<PostSettingsDTO>> {
    return $api.put(`/post-settings/${postId}`, data);
  }
}
