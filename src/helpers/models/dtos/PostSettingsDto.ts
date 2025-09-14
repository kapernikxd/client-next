import { PostId } from "./PostDto";

export interface PostSettingsDTO {
  post?: PostId;
  showQr: boolean;
  reminderTimes: number[];
  addToCalendar: boolean;
  admins: string[];
  allowImages: boolean;
}
