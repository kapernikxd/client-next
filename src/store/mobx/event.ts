import { makeAutoObservable, runInAction } from "mobx";
import _ from "lodash";
import { EventService } from "../../services/event/EventService";
import { UserId } from "../../helpers/models/dtos/UserDto";
import { EventResponse, InvitationsResponse } from "../../services/event/EventResponse";
import { FilterParams } from "./ui";
import { EventType, ICreateEditPlace, PostFilesDTO, PostId } from "../../helpers";
import uiStore from "./ui";
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

export type EventStatus = "all" | "active" | "completed" | "my" | "draft";

export type EventParticipant = {
  _id: UserId;
  name: string;
  lastname: string;
  avatarFile: string;
  status?: 'PENDING' | 'CONFIRMED' | 'REJECTED'
};

export enum EInvitationStatus {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  SENT = "SENT",
}

class EventStore {
  // Списки событий для разных разделов
  isLoadingEvents: boolean = false;
  homeEvents: EventResponse[] = []; // главная страница
  userEvents: EventResponse[] = []; // страница пользователя
  myEvents: EventResponse[] = [];   // "Мои события"
  mapEvents: EventResponse[] = [];  // события для карты
  isLoadingMapEvents: boolean = false;

  hasMore: boolean = true;

  // Текущее выбранное событие (детальный экран)
  selectedEvent: EventResponse = {} as EventResponse;

  // Пагинация для приглашений (или других списков)
  invitationPaginationTotal = 10;

  // Списки мест (площадки)
  isLoadingPlaces: boolean = false;
  publicPlaces: EventResponse[] = [];
  userPlaces: EventResponse[] = [];
  myPlaces: EventResponse[] = [];

  hasMorePlaces: boolean = true;

  // Участники события и идентификатор создателя
  eventParticipants: EventParticipant[] = [];
  eventOwnerId: UserId = "";
  isModerated: boolean = false;

  // Приглашения и их статусы
  myInvitations: InvitationsResponse[] = [];
  invitationStatuses: any[] = [];

  // Счётчик для принудительного обновления
  updateCount = 0;

  // Инстанс сервиса для работы с API
  private eventService: EventService;

  constructor() {
    makeAutoObservable(this);
    this.eventService = new EventService();
  }

  // Увеличивает счётчик обновлений
  incrementUpdateCount = () => {
    this.updateCount++;
  };

  cleareEvent = () => {
    this.selectedEvent = {} as EventResponse;
  };

  // Обновляет список лайков для события (в homeEvents и selectedEvent)
  updateEventLikes = (targetId: string, newLikes: UserId[]) => {
    const updatedEvents = _.cloneDeep(this.homeEvents);
    const index = _.findIndex(this.homeEvents, { _id: targetId });
    if (index !== -1) {
      this.homeEvents = _.set(updatedEvents, `[${index}].likes`, newLikes);
    }
    if (!_.isEmpty(this.selectedEvent)) {
      this.selectedEvent.likes = newLikes;
    }
  };

  // Обновляет список участников для события (в homeEvents и selectedEvent)
  updateEventParticipants = (targetId: string, newParticipants: UserId[]) => {
    const updatedEvents = _.cloneDeep(this.homeEvents);
    const index = _.findIndex(this.homeEvents, { _id: targetId });
    if (index !== -1) {
      this.homeEvents = _.set(updatedEvents, `[${index}].participants`, newParticipants);
    }
    if (!_.isEmpty(this.selectedEvent)) {
      this.selectedEvent.participants = newParticipants;
    }
  };

  // Обновляет лайки для места (в publicPlaces и selectedEvent)
  updatePlaceLikes = (targetId: string, newLikes: UserId[]) => {
    const updatedPlaces = _.cloneDeep(this.publicPlaces);
    const index = _.findIndex(this.publicPlaces, { _id: targetId });
    if (index !== -1) {
      this.publicPlaces = _.set(updatedPlaces, `[${index}].likes`, newLikes);
    }
    if (!_.isEmpty(this.publicPlaces)) {
      this.selectedEvent.likes = newLikes;
    }
  };

  ////////////////////// События //////////////////////
  async fetchMapEvents(params?: FilterParams) {
    if (this.isLoadingMapEvents) return;

    this.isLoadingMapEvents = true;
    try {
      const response = await this.eventService.getMapEvents(params);
      runInAction(() => {
        this.mapEvents = response.data.events;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isLoadingMapEvents = false;
      });
    }
  }

  async fetchAllEvents(params?: FilterParams) {
    if (this.isLoadingEvents || (!this.hasMore && params?.page && params.page > 1)) return;

    this.isLoadingEvents = true;
    try {
      const response = await this.eventService.getAllEvents(params);
      runInAction(() => {
        // Если это первая страница — заменяем события
        if (params?.page === 1) {
          this.homeEvents = response.data.events;
          // Если загружаем следующую страницу — добавляем к существующим
        } else {
          this.homeEvents = [...this.homeEvents, ...response.data.events];
        }
        this.hasMore = response.data.hasMore; // Флаг, есть ли еще данные
        uiStore.setGeoFilters(response.data.geo)
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isLoadingEvents = false;
      });
    }
  }

  async fetchAllPlaces(params?: FilterParams) {
    if (this.isLoadingPlaces) return;

    this.isLoadingPlaces = true;
    try {
      const response = await this.eventService.getAllEvents(params);
      runInAction(() => {
        if (params?.page === 1) {
          // Если это первая страница — заменяем события
          this.publicPlaces = response.data.events;
        } else {
          // Если загружаем следующую страницу — добавляем к существующим
          this.publicPlaces = [...this.publicPlaces, ...response.data.events];
        }
        this.hasMorePlaces = response.data.hasMore; // Флаг, есть ли еще данные
        uiStore.setGeoFilters(response.data.geo)
      });
    } catch (error) {
      console.error(error);
    }
    finally {
      runInAction(() => {
        this.isLoadingPlaces = false;
      })
    };
  }

  async fetchEventById(eventId: string) {
    try {
      const response = await this.eventService.getEventById(eventId);
      runInAction(() => {
        this.selectedEvent = response.data;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async fetchMyEvents(params: FilterParams) {
    try {
      const response = await this.eventService.getMyEvents(params);
      runInAction(() => {
        // Дублируем массив событий 10 раз (временная заглушка)
        // const duplicatedEvents = Array.from({ length: 10 }, () => response.data.data).flat();
        this.myEvents = response.data.data;
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async fetchMyPlaces() {
    try {
      const response = await this.eventService.getMyPlaces();
      runInAction(() => { this.myPlaces = response.data; });
    } catch (error) {
      console.error(error);
    }
  }

  async fetchPlacesByUserId(userId: string) {
    try {
      const response = await this.eventService.getPlacesById(userId);
      runInAction(() => { this.userPlaces = response.data; });
    } catch (error) {
      console.error(error);
    }
  }

  async fetchEventsByUserId(id: UserId) {
    try {
      const response = await this.eventService.getEventsByUserId(id);
      runInAction(() => {
        this.userEvents = response.data.data;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async recordView(eventId: string, userId?: string) {
    try {
      await this.eventService.recordViewEvent(eventId, userId);
    } catch (error) {
      console.error(error);
    }
  }

  async onLike(eventId: string, type?: EventType) {
    try {
      const response = await this.eventService.likeEvent(eventId);
      runInAction(() => {
        if (type === EventType.PLACE) {
          this.updatePlaceLikes(response.data.postId, response.data.likes);
        } else {
          this.updateEventLikes(response.data.postId, response.data.likes);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createDraft(formData: FormData) {
    try {
      const response = await this.eventService.createDraft(formData);
      uiStore.showSnackbar("Draft saved", "success");
      return response.data;
    } catch (error) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async publishDraft(draftId: string, data: any) {
    try {
      const response = await this.eventService.publishDraft(draftId, data);
      uiStore.showSnackbar("Published", "success");
      return response.data;
    } catch (error) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async createEvent(formData: FormData) {
    try {
      const response = await this.eventService.createEvent(formData);
      uiStore.showSnackbar("Created", "success");
      return response.data;
    } catch (error) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async deleteEvent(eventId: string) {
    try {
      await this.eventService.deleteEvent(eventId);
    } catch (error) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async editEvent(eventData: Partial<ICreateEditPlace>, eventId: string) {
    try {
      const response = await this.eventService.updateEvent(eventId, eventData);
      runInAction(() => {
        this.incrementUpdateCount();
      });
      uiStore.showSnackbar('Updated', 'success');
      return response.data;
    } catch (error) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async uploadFiles(files: any, eventId: string) {
    try {
      const response = await this.eventService.uploadFiles(files, eventId);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async removeFiles(files: PostFilesDTO[], eventId: string) {
    try {
      return await this.eventService.removeFiles(files, eventId);
    } catch (error) {
      console.error(error);
    }
  }

  async participate(eventId: string) {
    try {
      const response = await this.eventService.participateInEvent(eventId);
      await this.fetchEventParticipants(eventId);
      runInAction(() => {
        this.updateEventParticipants(response.data.postId, response.data.participants);
      });
    } catch (error) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async requestToJoin(eventId: string) {
    try {
      await this.eventService.requestToJoin(eventId);
      await this.fetchEventParticipants(eventId);
    } catch (error) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  ////////////////////// Invitations //////////////////////

  async sendInvitations(userIds: UserId[], postId: PostId) {
    try {
      await this.eventService.sendInvitations(userIds, postId);
    } catch (error) {
      uiStore.showSnackbar("Failed", "error");
    }
  }

  async fetchMyInvitations() {
    try {
      const response = await this.eventService.getMyInvitations();
      runInAction(() => {
        this.myInvitations = response.data.data;
        this.invitationPaginationTotal = response.data.size;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async fetchPostByInvitationId(invitationId: string) {
    try {
      const response = await this.eventService.getPostByInvitationId(invitationId);
      runInAction(() => {
        this.selectedEvent = response.data.data[0];
      });
    } catch (error) {
      console.error(error);
    }
  }

  async fetchInvitationStatuses(postId: PostId) {
    try {
      const response = await this.eventService.getInvitationStatuses(postId);
      runInAction(() => {
        this.invitationStatuses = response.data;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async respondToInvitation(invitationId: string, status: string) {
    try {
      await this.eventService.respondToInvitation(invitationId, status);
    } catch (error) {
      throw new Error()
    }
  }

  async revokeInvitationFromUser(postId: PostId, userId: UserId) {
    try {
      await this.eventService.revokeInvitation(postId, userId);
      await this.fetchMyInvitations();
    } catch (error) {
      console.error(error);
    }
  }

  ////////////////////// Participants //////////////////////

  async deleteParticipantFromEvent({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }) {
    try {
      await this.eventService.removeParticipant(postId, userId);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchEventParticipants(eventId: string) {
    try {
      const response = await this.eventService.getParticipants(eventId);
      const { participants, postedBy, isModerated } = response.data;

      runInAction(() => {
        this.eventParticipants = participants;
        this.eventOwnerId = postedBy;
        this.isModerated = isModerated;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async confirmParticipant(postId: string, userId: string) {
    try {
      await this.eventService.confirmParticipant(postId, userId);
      await this.fetchEventParticipants(postId);
    } catch (error) {
      console.error(error);
    }
  }

  async rejectParticipant(postId: string, userId: string) {
    try {
      await this.eventService.rejectParticipant(postId, userId);
      await this.fetchEventParticipants(postId);
    } catch (error) {
      console.error(error);
    }
  }

  async exportParticipants(postId: string) {
    try {
      const response = await this.eventService.exportParticipants(postId);
      const fileUri = FileSystem.documentDirectory + 'participants.xlsx';
      const base64Data = Buffer.from(response.data).toString('base64');
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return fileUri;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async confirmParticipantViaQr(eventId: string) {
    try {
      await this.eventService.confirmParticipantViaQr(eventId);
      await this.fetchEventParticipants(eventId);
    } catch (error) {
      console.error(error);
    }
  }

  async reportPost(data: { reason?: string, details?: string, targetId: string }) {
    try {
      await this.eventService.reportPost(data);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new EventStore();
