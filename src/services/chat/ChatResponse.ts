import { PostDTO, PostFilesDTO, UserDTO } from "../../helpers";

export interface ChatById {
  _id: string;
  isGroupChat: boolean;
  latestMessage?: string; // ID последнего сообщения
  postId: string; // ID связанного поста
  post: PostDTO<UserDTO, PostFilesDTO[]>; // Полный объект поста
  users: UserDTO[]; // Список пользователей в чате
  chatName?: string;
}

export type ReadedMessageResponse = {
  senderId: string,
  chatId: string,
  lastReadedMessageId: string,
}