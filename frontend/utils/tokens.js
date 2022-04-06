import axios from 'axios';
//import {BASE_URL} from '';

/*const BASE_URL =
    process.env.NODE_ENV === 'development'
        ? process.env.NX_HTTPS_LINK_DEV
        : process.env.NX_HTTPS_LINK_PROD;*/
const BASE_URL = 'https://api.ke22.ru';

/** Таймаут для обновления токенов */
export const timeoutRefresh = (tokenAccess) => {
    /** Получаем время жизни access токена для установки в последующем интервала refresh */
    const jwtToken = JSON.parse(atob(tokenAccess.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() - Date.now() - 2 * 60 * 1000;
};
/** Обновление токенов */

const instance = axios.create({
    // baseURL: process.env.REACT_APP_DEV_MODE_HTTPS_LINK,
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

export const userAPI = {
    /** refresh токена */
    refreshToken(refreshToken, accessToken) {
        return instance.post('/users/jwt/refresh/', {refresh: refreshToken, access: accessToken});
    }
};
