import { EventPriceType, LatLngTuple } from "../models";

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const textRefactor = (text: string, size: number) => {
  if (text && text.length > size) return text.substr(0, size) + "...";
  return text;
};

export const isMessageReaded = ({ readBy, userId }: { readBy?: string[], userId?: string }): boolean => {
  if (!userId) return false
  return readBy?.includes(userId) ?? false
}

export type WeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ParsedHours = Record<WeekDay, string>;

export const weekDaysOrder: WeekDay[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];


export const convertHoursFromApi = (
  hours: { day: string; open: string; close: string }[]
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const day of weekDaysOrder) {
    const entry = hours?.find((h) => h.day === day);
    if (entry) {
      result[day] = `${entry.open || '—'}–${entry.close || '—'}`;
    } else {
      result[day] = '—–—';
    }
  }
  return result;
};

export function isPlaceOpenOnDay(
  hoursArray: { day: string; open: string; close: string }[] = [],
  day: WeekDay
): boolean {
  const hours = convertHoursFromApi(hoursArray);
  const schedule = hours[day];
  return schedule !== undefined && schedule !== '—–—';
}

export function capitalizeFirstLetter(text?: string): string {
  if (!text) return ""
  const trimmed = text.trim();
  if (trimmed.length === 0) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function getCombinedModerationStatus(
  status?: 'PENDING' | 'APPROVED' | 'REJECTED',
  imageStatus?: 'PENDING' | 'APPROVED' | 'REJECTED',
): 'PENDING' | 'APPROVED' | 'REJECTED' {
  if (status === 'PENDING' || imageStatus === 'PENDING') {
    return 'PENDING';
  }

  if (status === 'REJECTED' || imageStatus === 'REJECTED') {
    return 'REJECTED';
  }

  return 'APPROVED';
}

export function convertCoordinatesFromMongoToGoogle(coordinates?: [number, number]): LatLngTuple | undefined {
  if (!coordinates) return undefined

  return [coordinates[1], coordinates[0]]
}

export const getPriceValue = (price: EventPriceType) => price?.donation ? 'Donation' : `${price?.range ? price.range === "FROM" ? 'from' : 'up to' : ""} ${price?.amount} ${price?.currency}`;
