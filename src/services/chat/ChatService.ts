import { AxiosResponse } from "axios";
import { $api } from "../../helpers";
import * as ImagePicker from 'expo-image-picker';
import { ChatById, ReadedMessageResponse } from "./ChatResponse";
import { ChatDTO } from "../../helpers";

export interface FetchChatsOptions {
  typeChat?: 'private' | 'group' | 'bot';
  limit?: number;
  page?: number;
  search?: string;
}

export interface FetchChatsResponse {
  chats: ChatDTO[];
  hasMore: boolean;
}

export type UnreadStatus = {
  hasUnread: boolean;
  group: boolean;
  private: boolean;
  bot: boolean;
};

export default class ChatService {
  async fetchChats(
    options?: FetchChatsOptions
  ): Promise<AxiosResponse<FetchChatsResponse>> {
    const { typeChat, ...params } = options || {};
    if(typeChat === 'bot'){
      return this.fetchBotChats(params)
    }
    return $api.get("/chat/all", { params: options });
  }

  async fetchBotChats(
    options?: FetchChatsOptions
  ): Promise<AxiosResponse<FetchChatsResponse>> {
    const { typeChat, ...params } = options || {};
    return $api.get("/chat/bot/all", { params });
  }

  async fetchChatById(id: string): Promise<AxiosResponse<ChatById>> {
    return $api.get(`/chat/${id}`);
  }

  async markChatAsRead(chatId: string, messageId: string): Promise<AxiosResponse<any>> {
    return $api.post(`/chat/${chatId}/read`, { messageId });
  }

  async hasUnreadMessages(): Promise<AxiosResponse<UnreadStatus>> {
    return $api.get(`/chat/has-unread`);
  }

  async fetchChatMessages(id: string, skip: number): Promise<AxiosResponse<any>> {
    return $api.get(`/messages/${id}/messages?skip=${skip}`);
  }

  async markAllMessagesAsRead(chatId: string): Promise<AxiosResponse<any>> {
    return $api.put(`/messages/${chatId}/messages/markAsRead`);
  }

  async sendMessage(
    message: string,
    chatId: string,
    replyToMessageId?: string,
    images?: ImagePicker.ImagePickerAsset[]
  ): Promise<AxiosResponse<any>> {
    const formData = new FormData();
    formData.append('content', message);
    formData.append('chatId', chatId);
    if (replyToMessageId) formData.append('replyTo', replyToMessageId);

    images?.forEach((img, index) => {
      formData.append('images', {
        uri: img.uri,
        name: img.fileName || `image_${index}.jpg`,
        type: img.mimeType || 'image/jpeg',
      } as any);
    });

    return $api.post(`/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async editMessage(messageId: string, content: string): Promise<AxiosResponse<any>> {
    return $api.patch(`/messages/${messageId}`, { content });
  }

  async messageByIdRequest(userId: string): Promise<AxiosResponse<any>> {
    return $api.get(`/messages/${userId}`).then((res) => res.data);
  }

  async fetchLastReadedMessageRequest({ userId, chatId }: { userId: string, chatId: string }): Promise<AxiosResponse<ReadedMessageResponse>> {
    return $api.get(`/messages/lastReadedId/${userId}/${chatId}`);
  }

  async reportMessage(
    messageId: string,
  ): Promise<AxiosResponse<boolean>> {
    return $api.post(`/reports`, { targetType: 'message', targetId: messageId });
  }

  async fetchPinnedMessages(chatId: string): Promise<AxiosResponse<any>> {
    return $api.get(`/messages/${chatId}/pins`);
  }

  async pinMessage(messageId: string): Promise<AxiosResponse<any>> {
    return $api.post(`/messages/${messageId}/pin`);
  }

  async unpinMessage(messageId: string): Promise<AxiosResponse<any>> {
    return $api.delete(`/messages/${messageId}/pin`);
  }
}
