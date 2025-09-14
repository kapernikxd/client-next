import { makeAutoObservable, runInAction } from "mobx";
import AuthService from "../../services/auth/AuthService";
import { getRefreshToken, removeAccessToken, removeLocalUserId, removeRefreshToken, setAccessToken, setLocalUserId, setRefreshToken } from "../../helpers/storageHelper";
import { NewPasswordParams, ParamsVerificateEmail } from "../../services/auth/AuthResponse";
import { $api } from "../../helpers";


export type LoginParams = {
    email: string;
    password: string;
};

export type RegistrationParams = {
    name: string;
    lastname: string;
    email: string;
    password: string;
};

export type User = {
    email: string;
    id: string;
    isActivated: boolean;
    fullName: string;
};

class Auth {
    user: User | null = null;
    isAuth: boolean = false;
    loading: boolean = false;
    accessToken: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setLoading(value: boolean) {
        this.loading = value;
    }

    setAuth(value: boolean) {
        this.isAuth = value;
    }

    getAuthUserEmail = () => this.user?.email;

    getMyId = () => this.user?.id ?? ''

    get myId() {
        return this.user?.id ?? null;
    }

    getUserInfo = () => {
        _id: this.user?.id
    }

    async loginByGoogle(credential: string, expoPushToken?: string) {
        try {
            const { data } = await AuthService.loginByGoogle(credential);

            runInAction(() => {
                this.user = data.user;
                this.isAuth = true;
                this.accessToken = data.accessToken
            });

            await setRefreshToken(data.refreshToken);
            await setAccessToken(data.accessToken);
            await setLocalUserId(data.user.id);

            $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

            if (expoPushToken) {
                await this.sendPushToken(expoPushToken);
            }

            return data
        } catch (e: any) {
            throw e;
        }
    }

    async loginByApple(identityToken: string, expoPushToken?: string) {
        try {
            const { data } = await AuthService.loginByApple(identityToken);

            runInAction(() => {
                this.user = data.user;
                this.isAuth = true;
                this.accessToken = data.accessToken;
            });

            await setRefreshToken(data.refreshToken);
            await setAccessToken(data.accessToken);
            await setLocalUserId(data.user.id);

            $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

            if (expoPushToken) {
                await this.sendPushToken(expoPushToken);
            }

            return data;
        } catch (e: any) {
            throw e;
        }
    }

    async login(props: LoginParams, expoPushToken?: string) {
        try {
            this.setLoading(true);
            const { data } = await AuthService.login(props);

            runInAction(() => {
                this.user = data.user;
                this.isAuth = true;
                this.accessToken = data.accessToken
            });

            await setRefreshToken(data.refreshToken);
            await setAccessToken(data.accessToken);
            await setLocalUserId(data.user.id);

            $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

            if (expoPushToken) {
                await this.sendPushToken(expoPushToken);
            }

            this.setLoading(false);

            return data
        } catch (e: any) {
            // Преобразуем ошибки в формат react-hook-form
            if (e.response?.data?.errors) {
                const formattedErrors = e.response.data.errors.reduce(
                    (acc: Record<string, string>, error: { field: string; message: string }) => {
                        acc[error.field] = error.message;
                        return acc;
                    },
                    {}
                );
                throw formattedErrors; // Бросаем обработанные ошибки
            }
            throw e;
        }
    }

    async logout() {
        await AuthService.logout();

        runInAction(() => {
            this.user = null;
            this.isAuth = false;
            this.accessToken = null;
        });
        await removeRefreshToken();
        await removeAccessToken();
        await removeLocalUserId();

    }

    async registration(props: RegistrationParams, expoPushToken?: string) {
        try {
            this.setLoading(true);
            const { data } = await AuthService.registration(props);

            runInAction(() => {
                this.user = data.user;
                this.isAuth = true;
                this.accessToken = data.accessToken
            });

            await setAccessToken(data.accessToken);
            await setRefreshToken(data.refreshToken);
            await setLocalUserId(data.user.id);

            $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

            if (expoPushToken) {
                await this.sendPushToken(expoPushToken);
            }

            this.setLoading(false);
        } catch (e: any) {
            // Преобразуем ошибки в формат react-hook-form
            if (e.response?.data?.errors) {
                const formattedErrors = e.response.data.errors.reduce(
                    (acc: Record<string, string>, error: { field: string; message: string }) => {
                        acc[error.field] = error.message;
                        return acc;
                    },
                    {}
                );
                throw formattedErrors; // Бросаем обработанные ошибки
            }
            throw e;
        }
    }

    async otp(props: ParamsVerificateEmail) {
        try {
            this.setLoading(true);
            const { data } = await AuthService.verificateEmail(props);

            runInAction(() => {
                this.user = data.user;
                this.isAuth = true;
            })

            return data

        } catch (e: any) {
            // Преобразуем ошибки в формат react-hook-form
            if (e.response?.data?.errors) {
                const formattedErrors = e.response.data.errors.reduce(
                    (acc: Record<string, string>, error: { field: string; message: string }) => {
                        acc[error.field] = error.message;
                        return acc;
                    },
                    {}
                );
                throw formattedErrors; // Бросаем обработанные ошибки
            }
            throw e;
        }
    }

    async activateEmail(email: string) {
        try {
            const { data } = await AuthService.activateEmail(email);
            return data;

        } catch (e: any) {
            // Преобразуем ошибки в формат react-hook-form
            if (e.response?.data?.errors) {
                const formattedErrors = e.response.data.errors.reduce(
                    (acc: Record<string, string>, error: { field: string; message: string }) => {
                        acc[error.field] = error.message;
                        return acc;
                    },
                    {}
                );
                throw formattedErrors; // Бросаем обработанные ошибки
            }
            throw e;
        }
    }

    //флоу когда сбрасываем пароль
    async resetPassword(props: ParamsVerificateEmail) {
        try {
            this.setLoading(true);
            const { data } = await AuthService.resetPassword(props);
            return data

        } catch (e: any) {
            // Преобразуем ошибки в формат react-hook-form
            if (e.response?.data?.errors) {
                const formattedErrors = e.response.data.errors.reduce(
                    (acc: Record<string, string>, error: { field: string; message: string }) => {
                        acc[error.field] = error.message;
                        return acc;
                    },
                    {}
                );
                throw formattedErrors; // Бросаем обработанные ошибки
            }
            throw e;
        }
    }

    async newPassword(props: NewPasswordParams) {
        try {
            const { data } = await AuthService.newPassword(props);
            return data;

        } catch (e: any) {
            // Преобразуем ошибки в формат react-hook-form
            if (e.response?.data?.errors) {
                const formattedErrors = e.response.data.errors.reduce(
                    (acc: Record<string, string>, error: { field: string; message: string }) => {
                        acc[error.field] = error.message;
                        return acc;
                    },
                    {}
                );
                throw formattedErrors; // Бросаем обработанные ошибки
            }
            throw e;
        }
    }

    async refreshAccessToken() {
        try {
            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
                throw new Error();
            }
            const { data } = await AuthService.refreshAccessTokenRequest(refreshToken);
            runInAction(() => {
                this.user = data.user;
                this.accessToken = data.accessToken;
                this.isAuth = true;
            });

            // Persist обновленные токены для последующих запросов
            await setAccessToken(data.accessToken);
            await setRefreshToken(data.refreshToken);
            await setLocalUserId(data.user.id);

            // Обновляем заголовок авторизации для axios
            $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

            return data;
        } catch (e: any) {
            await removeRefreshToken();
            await removeAccessToken();
            console.log(e)
        }
    }

    async sendPushToken(token: string) {
        try {
            await AuthService.sendPushToken(token);
        } catch (e) {
            console.warn("Ошибка при отправке пуш-токена", e);
        }
    }
}

export default new Auth();
