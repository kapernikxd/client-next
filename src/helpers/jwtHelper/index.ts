/**
 * @typedef {Object} token
 * @property {string} access - access token
 * @property {string} user - user id
 * @property {number} expires - access token expires time
 * @property {string} refresh - refresh token
 * @property {number} refresh_expires - refresh token expires time
 * @property {number} now - current time
 *
 */

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function setAccessToken(token: string) {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(token));
}

export function getAccessToken() {
  const strToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  return strToken ? JSON.parse(strToken) : null;
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function setRefreshToken(token: string) {
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(token));
}

export function getRefreshToken() {
  const strToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  return strToken ? JSON.parse(strToken) : null;
}

export function removeRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function saveToken(token: string) {
  setAccessToken(token);
}

export function getToken() {
  return getAccessToken();
}

export function removeToken() {
  removeAccessToken();
}

export function setToken(token: string) {
  setAccessToken(token);
}

export function setLocalUserId(id: string) {
  if (id) localStorage.setItem("userId", JSON.stringify(id));
}

export function removeLocalUserId() {
  localStorage.removeItem("userId");
}

export function getLocalUserId() {
  const user = localStorage.getItem("userId");
  return user ? JSON.parse(user) : null;
}
