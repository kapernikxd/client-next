import { AxiosResponse } from "axios";
import { $api, MyProfileDTO, ProfileDTO, UserDTO } from "../../helpers";
import { AuthProfileResponse, AuthResponse, ChangePasswordProps } from "../auth/AuthResponse";
import { ProfilesFilterParams, UpdateProfileProps } from "../../store/mobx/profile";
import { getQueriedUrl } from "../../helpers/queryStringHelper";

export interface UsersFilterParams {
  search?: string;
  limit?: number;
  page?: number;
}

export interface UsersResponse {
  users: UserDTO[];
  hasMore: boolean;
}

export interface AiBotUpdatePayload {
  name?: string;
  lastname?: string;
  profession?: string;
  userBio?: string;
}

export class ProfileService {
  /**
   * Получить профиль текущего пользователя.
   * @returns Ответ с данными профиля.
   */
  public async getMyProfile(): Promise<AxiosResponse<MyProfileDTO, any>> {
    return $api.get("/profile/my");
  }

  /**
   * Получить список всех профилей.
   * @returns Ответ со списком профилей.
   */
  public async getProfiles(params: ProfilesFilterParams): Promise<AxiosResponse<{ profiles: ProfileDTO[], hasMore: boolean }>> {
    return $api.get(getQueriedUrl({ url: "/profile/", query: params }));
  }

  /**
   * Получить профиль по его идентификатору.
   * @param id Идентификатор профиля.
   * @returns Ответ с данными профиля.
   */
  public async getProfileById(id: string): Promise<AxiosResponse<ProfileDTO, any>> {
    return $api.get(`/profile/${id}`);
  }

  /**
   * Загрузить фотографию профиля.
   * @param fileData Данные файла в формате FormData.
   * @returns Ответ от сервера.
   */
  public async uploadProfilePhoto(fileData: FormData): Promise<AxiosResponse> {
    return $api.post("/profile/upload", fileData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Получить фотографию профиля.
   * @returns Ответ с данными фотографии.
   */
  public async getProfilePhoto(): Promise<AxiosResponse> {
    return $api.get("/profile/avatar");
  }

  /**
   * Удалить фотографию профиля.
   * @param params Объект с именем файла (например, { name: "avatar.jpg" }).
   * @returns Ответ от сервера.
   */
  public async deleteProfilePhoto(params: { name: string }): Promise<AxiosResponse> {
    return $api({
      method: "DELETE",
      url: "/profile/avatar",
      data: { ...params },
    });
  }

  /**
   * Обновить данные профиля текущего пользователя.
   * @param props Объект с данными для обновления профиля.
   * @returns Ответ с обновлёнными данными профиля.
   */
  public async updateProfile(props: UpdateProfileProps): Promise<AxiosResponse<AuthProfileResponse>> {
    return $api.patch<AuthProfileResponse>("/profile/my", props);
  }

  /**
   * Изменить пароль пользователя.
   * @param props Объект, содержащий старый и новый пароль.
   * @returns Ответ от сервера.
   */
  public async changePassword({ oldPassword, password }: ChangePasswordProps): Promise<AxiosResponse> {
    return $api.post<AuthResponse>("/auth/changePassword", { oldPassword, password });
  }

  /**
   * Подписаться или отписаться от профиля по его идентификатору.
   * @param id Идентификатор профиля.
   * @returns Ответ с информацией о количестве подписчиков и статусе подписки.
   */
  public async followProfileById(id: string): Promise<AxiosResponse<{ followers: number; isFollowing: boolean }, any>> {
    return $api.put(`/profile/${id}/follow`);
  }

  /**
   * Получить список подписчиков текущего пользователя.
   * @returns Ответ со списком подписчиков.
   */
  public async getMyFollowers(params?: UsersFilterParams): Promise<AxiosResponse<UsersResponse, any>> {
    return $api.get(`/profile/my/followers`, { params });
  }

  /**
   * Получить список подписчиков указанного профиля.
   * @param id Идентификатор профиля.
   * @returns Ответ со списком подписчиков.
   */
  public async getFollowersById(id: string, params?: UsersFilterParams): Promise<AxiosResponse<UsersResponse, any>> {
    return $api.get(`/profile/${id}/followers`, { params });
  }

  /**
   * Получить список подписок текущего пользователя.
   * @returns Ответ со списком подписок.
   */
  public async getMyFollowing(params?: UsersFilterParams): Promise<AxiosResponse<UsersResponse, any>> {
    return $api.get(`/profile/my/following`, { params });
  }

  /**
   * Получить список подписок указанного профиля.
   * @param id Идентификатор профиля.
   * @returns Ответ со списком подписок.
   */
  public async getFollowingById(id: string, params?: UsersFilterParams): Promise<AxiosResponse<UsersResponse, any>> {
    return $api.get(`/profile/${id}/following`, { params });
  }

  /**
   * Получить список созданных AI-ботов текущего пользователя.
   */
  public async getAiBots(): Promise<AxiosResponse<UserDTO[], any>> {
    return $api.get(`/profile/ai-bots`);
  }

  /**
   * Создать нового AI-бота. Для передачи аватара необходимо использовать FormData.
   */
  public async createAiBot(formData: FormData): Promise<AxiosResponse<UserDTO, any>> {
    return $api.post(`/profile/ai-bots`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Обновить данные AI-бота (без загрузки аватара).
   */
  public async updateAiBot(id: string, data: AiBotUpdatePayload): Promise<AxiosResponse<UserDTO, any>> {
    return $api.patch(`/profile/ai-bots/${id}`, data);
  }

  /**
   * Загрузить аватар для AI-бота.
   */
  public async uploadAiBotAvatar(id: string, formData: FormData): Promise<AxiosResponse<UserDTO, any>> {
    return $api.post(`/profile/ai-bots/${id}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Удалить AI-бота по идентификатору.
   */
  public async deleteAiBot(id: string): Promise<AxiosResponse<void, any>> {
    return $api.delete(`/profile/ai-bots/${id}`);
  }

  public async blockUser(data: { reason?: string, details?: string, targetId: string }): Promise<AxiosResponse<boolean>> {
    return $api.post(`/reports`, { targetType: 'user', ...data });
  }

  public async deleteAccount(id: string): Promise<AxiosResponse<boolean>> {
    return $api.delete(`/profile`);
  }
}

export default new ProfileService();
