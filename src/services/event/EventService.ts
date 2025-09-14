import { AxiosResponse } from "axios";
import {
  EventParticipateResponse,
  EventResponse,
  EventsResponseExtend,
  GeoResponse,
  LikesResponse,
  ParticipateResponse,
  StatusError,
  StatusSuccess,
  ViewResponse,
} from "./EventResponse";
import {
  $api,
  ICreateEditEventPlace,
  LatLngTuple,
  PostDTO,
  PostFilesDTO,
  PostId,
  UserId,
} from "../../helpers";
import { getQueriedUrl } from "../../helpers/queryStringHelper";
import { FilterParams } from "../../store/mobx/ui";

export class EventService {
  //////////// Fetching Events ////////////

  /**
   * Получить список всех событий (или мест) с дополнительными фильтрами.
   * @param params Параметры фильтрации
   */
  async getAllEvents(
    params?: FilterParams
  ): Promise<AxiosResponse<{ events: EventResponse[]; geo: GeoResponse, hasMore: boolean }>> {
    return $api.get(getQueriedUrl({ url: "/event/all", query: params }));
  }

  /**
   * Получить список событий для отображения на карте.
   * Запрос отличается от общего списка и используется только для карты.
   * @param params Параметры фильтрации
   */
  async getMapEvents(
    params?: FilterParams
  ): Promise<AxiosResponse<{ events: EventResponse[] }>> {
    return $api.get(getQueriedUrl({ url: "/event/map", query: params }));
  }

  /**
   * Получить детальную информацию о событии по его идентификатору.
   * @param id Идентификатор события
   */
  async getEventById(id: string): Promise<AxiosResponse<EventResponse>> {
    return $api.get(`/event/${id}`);
  }

  /**
   * Получить события, созданные текущим пользователем.
   * @param params Параметры фильтрации
   */
  async getMyEvents(
    params: FilterParams
  ): Promise<AxiosResponse<EventsResponseExtend>> {
    return $api.get(getQueriedUrl({ url: "/event/my", query: params }));
  }

  /**
   * Получить места, лайкнутые текущим пользователем.
   */
  async getMyPlaces(): Promise<AxiosResponse<any, any>> {
    return await $api.get(`/event/liked-by/me`);
  }
  
  
  async getPlacesById(
    userId: string
  ): Promise<AxiosResponse<any, any>> {
    return await $api.get(`/event/liked-by/${userId}`);
  }

  /**
   * Получить события, созданные конкретным пользователем.
   * @param userId Идентификатор пользователя
   */
  async getEventsByUserId(
    userId: string,
    params?: FilterParams
  ): Promise<AxiosResponse<EventsResponseExtend>> {
    return $api.get(`/event/${userId}/events?status=active`);
  }

  //////////// Event Actions ////////////

  /**
   * Создать черновик события.
   * @param draftData Данные черновика в формате FormData
   */
  async createDraft(draftData: FormData): Promise<AxiosResponse<PostDTO>> {
    return $api.post(`/event/draft`, draftData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Опубликовать черновик как активное событие.
   * @param draftId Идентификатор черновика
   * @param data Данные публикации (даты и параметры повторения)
   */
  async publishDraft(
    draftId: string,
    data: any
  ): Promise<AxiosResponse<PostDTO>> {
    return $api.post(`/event/draft/${draftId}/publish`, data);
  }

  /**
   * Создать новое событие.
   * @param eventData Данные события в формате FormData
   */
  async createEvent(eventData: FormData): Promise<AxiosResponse<PostDTO>> {
    return $api.post(`/event`, eventData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Обновить (отредактировать) событие.
   * @param id Идентификатор события
   * @param eventData Объект с изменёнными данными события
   */
  async updateEvent(
    id: string,
    eventData: Partial<ICreateEditEventPlace>
  ): Promise<AxiosResponse<204>> {
    return $api.put(`/event/${id}`, eventData);
  }

  /**
   * Удалить событие.
   * @param id Идентификатор события
   */
  async deleteEvent(id: string): Promise<AxiosResponse<202>> {
    return $api.delete(`/event/${id}`);
  }

  /**
   * Зарегистрировать просмотр события.
   * @param id Идентификатор события
   * @param userId (Опционально) Идентификатор пользователя
   */
  async recordViewEvent(
    id: string,
    userId?: string
  ): Promise<AxiosResponse<ViewResponse>> {
    return $api.put(`/event/${id}/view`, { userId });
  }

  //////////// Participation & Likes ////////////

  /**
   * Поставить лайк событию.
   * @param id Идентификатор события
   */
  async likeEvent(id: string): Promise<AxiosResponse<LikesResponse>> {
    return $api.put(`/event/${id}/like`);
  }

  /**
   * Зарегистрировать участие в событии.
   * @param id Идентификатор события
   */
  async participateInEvent(
    id: string
  ): Promise<AxiosResponse<ParticipateResponse>> {
    return $api.put(`/event/${id}/participate`);
  }

  //////////// Invitations ////////////

  /**
   * Отправить приглашения пользователям для участия в событии.
   * @param users Массив идентификаторов пользователей
   * @param postId Идентификатор события (поста)
   */
  async sendInvitations(
    users: UserId[],
    postId: PostId
  ): Promise<AxiosResponse<ParticipateResponse>> {
    return $api.post(`/invitations`, { recipientIds: users, postId });
  }

  /**
   * Получить список приглашений для текущего пользователя.
   */
  async getMyInvitations(): Promise<AxiosResponse<any>> {
    return $api.get(`/invitations/my`);
  }

  async getPostByInvitationId(InvitationId: string): Promise<AxiosResponse<any>> {
    return $api.get(`/invitations/${InvitationId}`);
  }

  /**
   * Ответить на приглашение (принять/отклонить).
   * @param invitationId Идентификатор приглашения
   * @param status Новый статус приглашения
   */
  async respondToInvitation(
    invitationId: string,
    status: string
  ): Promise<AxiosResponse<any>> {
    return $api.post(`/invitations/${invitationId}/respond`, { status });
  }

  /**
   * Отозвать приглашение у пользователя.
   * @param postId Идентификатор события (поста)
   * @param userId Идентификатор пользователя
   */
  async revokeInvitation(
    postId: string,
    userId: string
  ): Promise<AxiosResponse<any>> {
    return $api.delete(`/invitations/${postId}/user`, { data: { userId } });
  }

  /**
   * Получить статусы приглашений для события.
   * @param postId Идентификатор события (поста)
   */
  async getInvitationStatuses(postId: string): Promise<AxiosResponse<any>> {
    return $api.get(`/invitations/${postId}/statuses`);
  }

  //////////// Files Handling ////////////

  /**
   * Загрузить файлы для события.
   * @param files Файлы (FormData или другой формат)
   * @param eventId Идентификатор события
   */
  async uploadFiles(
    files: any,
    eventId: string
  ): Promise<AxiosResponse<StatusSuccess, StatusError>> {
    return $api.post(`/event/${eventId}/upload`, files, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Удалить файлы, прикреплённые к событию.
   * @param files Массив данных файлов
   * @param eventId Идентификатор события
   */
  async removeFiles(
    files: PostFilesDTO[],
    eventId: string
  ): Promise<AxiosResponse<StatusSuccess, StatusError>> {
    return $api.delete(`/event/${eventId}/upload`, { data: files });
  }

  //////////// Participants ////////////

  /**
   * Получить список участников события.
   * @param eventId Идентификатор события
   */
  async getParticipants(
    eventId: string
  ): Promise<AxiosResponse<EventParticipateResponse>> {
    return $api.get(`/event/${eventId}/participants`);
  }

  /**
   * Удалить участника из события.
   * @param eventId Идентификатор события
   * @param userId Идентификатор пользователя
   */
  async removeParticipant(
    eventId: string,
    userId: string
  ): Promise<AxiosResponse<EventParticipateResponse>> {
    return $api.put(`/event/${eventId}/participant/${userId}`);
  }

  /**
   * Экспортировать участников события в файл формата XLSX.
   * @param eventId Идентификатор события
   */
  async exportParticipants(
    eventId: string
  ): Promise<AxiosResponse<ArrayBuffer>> {
    return $api.get(`/event/${eventId}/participants/export`, {
      responseType: 'arraybuffer',
    });
  }

  /**
   * Отправить запрос на участие в модерируемом событии
   */
  async requestToJoin(
    postId: string
  ): Promise<AxiosResponse<ParticipateResponse>> {
    return $api.post(`/post-participants/${postId}/request`);
  }

  /**
   * Подтвердить участника в модерируемом событии
   */
  async confirmParticipant(
    postId: string,
    userId: string
  ): Promise<AxiosResponse<any>> {
    return $api.put(`/post-participants/${postId}/confirm/${userId}`);
  }

  async confirmParticipantViaQr(postId: string): Promise<AxiosResponse<any>> {
    return $api.put(`/post-participants/${postId}/confirm-via-qr`);
  }

  /**
   * Отклонить участника в модерируемом событии
   */
  async rejectParticipant(
    postId: string,
    userId: string
  ): Promise<AxiosResponse<any>> {
    return $api.put(`/post-participants/${postId}/reject/${userId}`);
  }

  /**
   * Получить участников по статусу
   */
  async getParticipantsByStatus(
    postId: string,
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED'
  ): Promise<AxiosResponse<EventParticipateResponse>> {
    return $api.get(`/post-participants/${postId}/${status}`);
  }


  async reportPost(
    data: {reason?: string, details?: string, targetId: string }
  ): Promise<AxiosResponse<boolean>> {
    return $api.post(`/reports`, {targetType: 'post', ...data});
  }
}
