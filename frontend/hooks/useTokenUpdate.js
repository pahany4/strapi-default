import {useDispatch, useSelector} from "react-redux";
import {useDidUpdate} from "react-hooks-lib";
import useFetch from "./useFetch";
import {setUser} from "../reducers/user";
import {setAuth} from "../reducers/auth";
import {decrypt, encrypt} from "../utils/crypto";
import {set_access, set_refresh, set_tokens} from "../reducers/token";
import {timeoutRefresh, userAPI} from "../utils/tokens";


/** При монтировании app (Старте приложения) проверяем наличие access токена в localStorage.
 * Если access токен не просрочен, то устанавливаем setAuth(true), синхронизируем токены из localStorage с redux,
 * получаем личные данные и список профилей.
 * Если access токен просрочен или в localStorage нет токенов, то редирект на /login и setAuth(false) */

export const useTokenUpdate = () => {
    const dispatch = useDispatch();

    /** Токены */
    const tokens = useSelector(state => state.token.tokens)
    const visitorId = useSelector(state => state.token.visitorId)

    /** Запрос личных данных */
    const [me, , , getMe] = useFetch(`/users/me/`)
    useDidUpdate(() => {
        me && dispatch(setUser(me))
    }, [me])

    /** Проверка истечения срока годности access токена.
     * Если нет токена в localStorage - редирект на логин */
    const [verify, , , sendVerify] = useFetch(`/users/jwt/verify/`)
    useDidUpdate(() => {
        if (!localStorage.getItem('access')) {
            dispatch(setAuth(false))
        }
        if (localStorage.getItem('access') && visitorId) {
            sendVerify({
                method: 'post',
                data: {
                    token: decrypt(localStorage.getItem('access'), visitorId)
                }
            })
        }
    },[visitorId])
    useDidUpdate(() => {
        if (verify !== null) {
            dispatch(set_tokens({
                access: decrypt(localStorage.getItem('access'), visitorId),
                refresh: decrypt(localStorage.getItem('refresh'), visitorId)
            }))
            getMe({method: 'get'})
        }
    }, [verify])

    /** Запись токенов в localStorage при авторизации.
     * (Сначала токены записываются в redux, затем шифруются в localStorage) */
    useDidUpdate(() => {
        if (tokens.access && tokens.refresh && visitorId) {
            localStorage.setItem('access', encrypt(tokens.access, visitorId))
            localStorage.setItem('refresh', encrypt(tokens.refresh, visitorId))
        }
    }, [tokens.access, tokens.refresh, visitorId])

    /** Обновление токенов */
    useDidUpdate(() => {
        decrypt(localStorage.getItem('access'), visitorId) &&
        decrypt(localStorage.getItem('access'), visitorId) &&
        setTimeout(() => {
            userAPI.refreshToken(
                decrypt(localStorage.getItem('refresh'), visitorId),
                decrypt(localStorage.getItem('access'), visitorId)
            ).then(r => {
                localStorage.setItem('access', encrypt(r.data.access, visitorId))
                localStorage.setItem('refresh', encrypt(r.data.refresh, visitorId))
                dispatch(set_access(r.data.access))
                dispatch(set_refresh(r.data.refresh))
            })
        }, timeoutRefresh(decrypt(localStorage.getItem('access'), visitorId)))
    }, [tokens.access && tokens.refresh])
}
