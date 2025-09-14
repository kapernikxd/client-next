import axios from "axios";
import { 
  getRefreshToken, 
  getAccessToken, 
  setRefreshToken, 
  setAccessToken, 
  removeRefreshToken, 
  removeAccessToken, 
  setLocalUserId, 
  removeLocalUserId 
} from "../storageHelper";
import authStore from "../../store/mobx/auth";


export const isDev = process.env.NODE_ENV === "development";

export const EMAIL = "pllace.support@gmail.com";


export const BASE_URL = isDev
  ? "http://192.168.0.19:5001/"
  : "https://pllace.su/";

export const TELEGRAM_URL = 'https://t.me/pllacesupport';
export const DOMAIN = "https://pllace.su"
export const API_URL = `${BASE_URL}api/`;

// Создаем экземпляр Axios
const $api = axios.create({
  baseURL: API_URL,
});

// **Interceptor для запросов**
$api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken(); // Получаем accessToken из AsyncStorage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// **Interceptor для ответов**
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("error", error)

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("Refresh token not found");

        const response = await axios.post(
          `${API_URL}auth/refresh`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = response.data;

        await setAccessToken(newAccessToken);
        await setRefreshToken(newRefreshToken);
        await setLocalUserId(user.id);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return $api.request(originalRequest);
      } catch (e) {
        await removeAccessToken();
        await removeRefreshToken();
        await removeLocalUserId();

        authStore.setAuth(false);
        authStore.user = null;
        authStore.accessToken = null;
        // delete $api.defaults.headers.common['Authorization'];

        console.log("НЕ АВТОРИЗОВАН");
      }
    }

    return Promise.reject(error);
  }
);

export default $api;
