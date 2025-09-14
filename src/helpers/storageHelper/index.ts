// utils/storage.ts
import { v4 as uuid } from "uuid";

const REFRESH_TOKEN = "refreshToken";
const ACCESS_TOKEN = "accessToken";
const USER_ID = "userId";
const VIEWED_EVENTS = "viewedEvents";

const setItem = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const getItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const removeItem = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// --- токены ---
export const setRefreshToken = (token: string) => setItem(REFRESH_TOKEN, token);
export const getRefreshToken = () => getItem(REFRESH_TOKEN);
export const removeRefreshToken = () => removeItem(REFRESH_TOKEN);

export const setAccessToken = (token: string) => setItem(ACCESS_TOKEN, token);
export const getAccessToken = () => getItem(ACCESS_TOKEN);
export const removeAccessToken = () => removeItem(ACCESS_TOKEN);

// --- userId ---
export const setLocalUserId = (userId: string) => setItem(USER_ID, userId);

export const getLocalUserId = (): string => {
  const stored = getItem(USER_ID);
  if (stored) return stored;

  const newId = `app-${uuid()}`;
  setItem(USER_ID, newId);
  return newId;
};

export const removeLocalUserId = () => removeItem(USER_ID);

// --- просмотренные события ---
export const addViewedEvent = (eventId: string) => {
  try {
    const raw = getItem(VIEWED_EVENTS);
    const arr: string[] = raw ? JSON.parse(raw) : [];

    if (!arr.includes(eventId)) {
      arr.push(eventId);
      setItem(VIEWED_EVENTS, JSON.stringify(arr));
    }
  } catch (e) {
    console.error("Error adding viewed event:", e);
  }
};

export const hasViewedEvent = (eventId: string): boolean => {
  try {
    const raw = getItem(VIEWED_EVENTS);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    return arr.includes(eventId);
  } catch {
    return false;
  }
};
