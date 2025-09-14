import { makeAutoObservable, runInAction } from "mobx";
import { MyProfileDTO, ProfileDTO, PushNotificationSettings, UserDTO } from "../../helpers";
import ProfileService, { UsersFilterParams } from "../../services/profile/ProfileService";
import { ChangePasswordProps } from "../../services/auth/AuthResponse";
import uiStore from "./ui";
export interface ProfilesFilterParams {
  page?: number;
}

export type UpdateProfileProps = {
  lastname?: string,
  name?: string,
  phone?: string,
  profession?: string,
  userBio?: string,
  username?: string,
  socialMediaLinks?: {
    facebook?: string,
    instagram?: string,
    vk?: string,
  }
  pushNotificationSettings?: PushNotificationSettings,
}

class ProfileStore {
  /** Профиль текущего пользователя */
  myProfile: MyProfileDTO = {} as MyProfileDTO;
  /** Просматриваемый профиль (например, другого пользователя) */
  profile: ProfileDTO = {} as ProfileDTO;
  /** Список всех профилей */
  profiles: ProfileDTO[] = [];
  hasMoreProfiles: boolean = true;
  isLoadingProfiles: boolean = false;
  /** Список подписчиков */
  followers: UserDTO[] = [];
  /** Список подписок (на кого подписан пользователь) */
  following: UserDTO[] = [];
  followersHasMore = true;
  followingHasMore = true;
  isLoadingFollowers = false;
  isLoadingFollowing = false;

  /** Инстанс сервиса для работы с API профиля */
  private profileService = ProfileService;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Очищает данные профилей.
   */
  clearProfileData = () => {
    this.myProfile = {} as MyProfileDTO;
    this.profile = {} as ProfileDTO;
    this.followers = [];
    this.following = [];
    this.followersHasMore = true;
    this.followingHasMore = true;
  };

  resetFollowing = () => {
    this.following = [];
    this.followingHasMore = true;
  };

  resetFollowers = () => {
    this.followers = [];
    this.followersHasMore = true;
  };

  /**
   * Возвращает информацию профиля текущего пользователя.
   */
  getMyProfileInfo = () => this.myProfile;

  /**
   * Получает профиль текущего пользователя.
   */
  async fetchMyProfile() {
    try {
      const { data } = await this.profileService.getMyProfile();
      runInAction(() => {
        this.myProfile = data;
      });
      return data;
    } catch (error) {
      console.error("Error fetching my profile", error);
    }
  }

  /**
   * Получает профиль по его идентификатору.
   * @param id Идентификатор профиля
   */
  async fetchProfileById(id: string) {
    try {
      const { data } = await this.profileService.getProfileById(id);
      runInAction(() => {
        this.profile = data;
      });
    } catch (error) {
      console.error("Error fetching profile by id", error);
    }
  }

  /**
   * Получает список всех профилей.
   */
  async fetchProfiles(params: ProfilesFilterParams) {
    if (this.isLoadingProfiles || (!this.hasMoreProfiles && params?.page && params.page > 1)) return;

    this.isLoadingProfiles = true;
    try {
      const { data } = await this.profileService.getProfiles(params);
      runInAction(() => {
        // Если это первая страница — заменяем события
        if (params?.page === 1) {
          this.profiles = data.profiles;
          // Если загружаем следующую страницу — добавляем к существующим
        } else {
          this.profiles = [...this.profiles, ...data.profiles];
        }
        this.hasMoreProfiles = data.hasMore; // Флаг, есть ли еще данные
        // this.profiles = data;
      });
    } catch (error) {
      console.error("Error fetching profiles", error);
    } finally {
      runInAction(() => {
        this.isLoadingProfiles = false;
      });
    }
  }

  /**
   * Загружает фотографию профиля.
   * @param fileData Данные файла в формате FormData
   */
  async uploadProfilePhoto(fileData: FormData) {
    try {
      await this.profileService.uploadProfilePhoto(fileData);
    } catch (error) {
      console.error("Error uploading profile photo", error);
    }
  }

  /**
   * Получает фотографию профиля.
   */
  async fetchProfilePhoto() {
    try {
      await this.profileService.getProfilePhoto();
    } catch (error) {
      console.error("Error fetching profile photo", error);
    }
  }

  /**
   * Удаляет фотографию профиля.
   * @param fileName Имя файла фотографии
   */
  async deleteProfilePhoto(fileName: string) {
    try {
      await this.profileService.deleteProfilePhoto({ name: fileName });
    } catch (error) {
      console.error("Error deleting profile photo", error);
    }
  }

  /**
   * Обновляет данные профиля текущего пользователя.
   * @param props Данные для обновления профиля
   */
  async updateProfile(props: UpdateProfileProps) {
    try {
      const { data } = await this.profileService.updateProfile(props);
      runInAction(() => {
        Object.assign(this.myProfile, data.user);
      });
    } catch (error) {
      console.error("Error updating profile", error);
    }
  }

  /**
   * Изменяет пароль пользователя.
   * @param props Объект с полями oldPassword и password
   */
  async changePassword(props: ChangePasswordProps) {
    try {
      const { data } = await this.profileService.changePassword(props);
      return data;
    } catch (error: any) {
      // Преобразуем ошибки в формат, подходящий для react-hook-form
      if (error.response?.data?.errors) {
        const formattedErrors = error.response.data.errors.reduce(
          (acc: Record<string, string>, errorItem: { field: string; message: string }) => {
            acc[errorItem.field] = errorItem.message;
            return acc;
          },
          {}
        );
        throw formattedErrors;
      }
      throw error;
    }
  }

  /**
   * Подписывается или отписывается от профиля по его идентификатору.
   * @param id Идентификатор профиля для подписки/отписки
   */
  async followProfile(id: string) {
    try {
      const { data } = await this.profileService.followProfileById(id);
      runInAction(() => {
        // Обновляем данные просматриваемого профиля
        this.profile.followers = data.followers;
        this.profile.isFollowing = data.isFollowing;
        // Если нужно, обновляем и счётчик подписок у моего профиля (при условии, что он числовой)
        if (typeof this.myProfile.following === "number") {
          this.myProfile.following = data.isFollowing
            ? this.myProfile.following + 1
            : this.myProfile.following - 1;
        }
      });
    } catch (error) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  /**
   * Получает список подписчиков текущего пользователя.
   */
  async fetchMyFollowers(params: UsersFilterParams) {
    if (this.isLoadingFollowers || (!this.followersHasMore && params.page && params.page > 1)) return;

    this.isLoadingFollowers = true;
    try {
      const { data } = await this.profileService.getMyFollowers(params);
      runInAction(() => {
        if (params.page && params.page > 1) {
          this.followers = [...this.followers, ...data.users];
        } else {
          this.followers = data.users;
        }
        this.followersHasMore = data.hasMore;
      });
    } catch (error) {
      console.error("Error fetching my followers", error);
    } finally {
      runInAction(() => { this.isLoadingFollowers = false; });
    }
  }

  /**
   * Получает список подписок (на кого подписан текущий пользователь).
   */
  async fetchMyFollowing(params: UsersFilterParams) {
    if (this.isLoadingFollowing || (!this.followingHasMore && params.page && params.page > 1)) return;

    this.isLoadingFollowing = true;
    try {
      const { data } = await this.profileService.getMyFollowing(params);
      runInAction(() => {
        if (params.page && params.page > 1) {
          this.following = [...this.following, ...data.users];
        } else {
          this.following = data.users;
        }
        this.followingHasMore = data.hasMore;
      });
    } catch (error) {
      console.error("Error fetching my following", error);
    } finally {
      runInAction(() => { this.isLoadingFollowing = false; });
    }
  }

  /**
   * Получает список подписчиков указанного профиля.
   * @param userId Идентификатор профиля
   */
  async fetchFollowers(userId: string, params: UsersFilterParams) {
    if (this.isLoadingFollowers || (!this.followersHasMore && params.page && params.page > 1)) return;

    this.isLoadingFollowers = true;
    try {
      const { data } = await this.profileService.getFollowersById(userId, params);
      runInAction(() => {
        if (params.page && params.page > 1) {
          this.followers = [...this.followers, ...data.users];
        } else {
          this.followers = data.users;
        }
        this.followersHasMore = data.hasMore;
      });
    } catch (error) {
      console.error("Error fetching followers", error);
    } finally {
      runInAction(() => { this.isLoadingFollowers = false; });
    }
  }

  /**
   * Получает список подписок указанного профиля.
   * @param userId Идентификатор профиля
   */
  async fetchFollowing(userId: string, params: UsersFilterParams) {
    if (this.isLoadingFollowing || (!this.followingHasMore && params.page && params.page > 1)) return;

    this.isLoadingFollowing = true;
    try {
      const { data } = await this.profileService.getFollowingById(userId, params);
      runInAction(() => {
        if (params.page && params.page > 1) {
          this.following = [...this.following, ...data.users];
        } else {
          this.following = data.users;
        }
        this.followingHasMore = data.hasMore;
      });
    } catch (error) {
      console.error("Error fetching following", error);
    } finally {
      runInAction(() => { this.isLoadingFollowing = false; });
    }
  }

  async blockUser(data: { reason?: string, details?: string, targetId: string }) {
    try {
      await this.profileService.blockUser(data);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteAccount() {
    try {
      await this.profileService.deleteAccount(this.myProfile._id);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ProfileStore();
