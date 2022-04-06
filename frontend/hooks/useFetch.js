import axios from 'axios';
import {useCallback, useState} from 'react';
import {useDidUpdate} from 'react-hooks-lib';
import {/*useDispatch,*/ useSelector} from 'react-redux';
import {decrypt} from "../utils/crypto";
/*import {
    set_error_data,
    set_error_message,
    set_error_status
} from './reducers/errors-server';*/

const useFetch = url => {
    //const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState({status: null, data: null});
    const [options, setOptions] = useState({});
    const visitorId = useSelector(state => state.token.visitorId)
/*    const BASE_URL =
        process.env.NODE_ENV === 'development'
            ? process.env.NX_HTTPS_LINK_DEV
            : process.env.NX_HTTPS_LINK_PROD;*/
    const BASE_URL = 'https://api.ke22.ru';
    const doFetch = useCallback(
        (options = {}) => {
            setOptions(options);
            setIsLoading(true);
      /*      dispatch(set_error_status(null));
            dispatch(set_error_message(null));
            dispatch(set_error_data(null));*/
        },
        []
    );

    useDidUpdate(() => {
        let skipGetResponseAfterDestroy = false;
        const requestOptions = {
            ...options,
            ...{
                headers: {
                    authorization: localStorage.getItem('access') ? `JWT ${decrypt(localStorage.getItem('access'), visitorId)}` : ''
                }
            }
        };
        if (!isLoading) {
            return;
        }
        if (!isLoading) {
            return;
        }
        setError({status: null, data: null});
        axios(`${BASE_URL}${url}`, requestOptions)
            .then(res => {
                if (!skipGetResponseAfterDestroy) {
                    setResponse(res.data);
                    setIsLoading(false);
                }
            })
            .catch(error => {
                if (!skipGetResponseAfterDestroy) {
                    setIsLoading(false);
                    setResponse(null);
                    if (!error.response) {
                        setError(prev => {
                            prev.status = 0;
                            prev.data = null;
                            return prev;
                        });
                      /*  dispatch(set_error_status('noWeb'));
                        dispatch(set_error_message('Проверьте подключение к Интернету'));*/
                    }

                    if (error.response && error.response.status === 401) {
                        /** Редирект на "login", если пользователь не авторизован.
                         * Дополнительная проверка на адресную строку нужна для подсказки пользователю,
                         что логин или пароль не верен. */
                        localStorage.setItem("access", '');
                        localStorage.setItem("refresh", '');
                   /*     if (history?.location.pathname !== '/login') {
                            if (url !== '/users/jwt/verify/') {
                                document.location.href = '/';
                            } else {
                                history?.push('/login')
                            }
                        }*/
                    }

                    if (error.response) {
                        setError({
                            ...error,
                            status: error.response.status,
                            data: error.response.data
                        });
                    /*    dispatch(set_error_status(error.response.status));
                        dispatch(set_error_data(error.response.data));*/
                        setError(prev => {
                            prev.status = error.response.status;
                            prev.data = error.response.data;
                            return prev;
                        });
                    }
                }
            });

        return () => {
            skipGetResponseAfterDestroy = true;
        };
    }, [isLoading, options, url]);

    return [response, isLoading, error, doFetch];
};

export default useFetch;
