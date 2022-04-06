import {useEffect, useState} from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";
import {useDidMount, useDidUpdate} from "react-hooks-lib";
import {useDispatch, useSelector} from "react-redux";
import {setVisitorId} from "../reducers/token";
import useFetch from "./useFetch";

export const useFingerprint = () => {
    const visitorId = useSelector(state => state.token.visitorId)
    const isAuth = useSelector(state => state.auth.isAuth)
    const dispatch = useDispatch()

    /** Последнее посещение */
    const [visitorHistory, setVisitorHistory] = useState(null);

    function getVisits(visitorId) {
        // NOTE: EU region has a different base url: https://eu.api.fpjs.io.
        return fetch(
            `https://api.fpjs.io/visitors/${visitorId}?limit=1&token=`
        )
            .then((response) => {
                return response.json();
            })
    }

    /** Получение id посещения FingerprintJS */
    useDidMount(() => {
        FingerprintJS.load({
            token: 'yN6JVSKzBNHVXg8yXWLh',
        })
            .then((fp) => {
                fp.get()
                    .then((result) => {
                        /** Запись id посещения в redux, для дальнейшего шифрования токенов */
                        dispatch(setVisitorId(result.visitorId));
                    });
            })
    }, []);

    /** Получение данных о последнем посещении */
    useEffect(() => {
        if (visitorId && isAuth) {
            getVisits(visitorId).then(response => {
                setVisitorHistory({
                    browserName: response?.visits[0].browserDetails.browserName,
                    os: response?.visits[0].browserDetails.os,
                    ip: response?.visits[0].ip,
                    city: response?.visits[0].ipLocation.city.name,
                    latitude: response?.visits[0].ipLocation.latitude,
                    longitude: response?.visits[0].ipLocation.longitude,
                    timezone: response?.visits[0].ipLocation.timezone,
                    time: response?.visits[0].time,
                    device: response?.visits[0].browserDetails.device,
                    country: response?.visits[0].ipLocation.country.name,
                })
            })
        }
    }, [visitorId, isAuth])

    /** Отправка данных устройства на бэкенд сразу после авторизации */
    const [,,,sendFingerData] = useFetch('/users/device/')
    useDidUpdate(() => {
        if (visitorHistory) {
            sendFingerData({
                method: 'post',
                data : {
                    fingerprint: visitorId,
                    name: visitorHistory.device,
                    browser: visitorHistory.browserName,
                    os: visitorHistory.os,
                    ip: visitorHistory.ip,
                    latitude: visitorHistory.latitude,
                    longitude: visitorHistory.longitude,
                    country: visitorHistory.country,
                    city: visitorHistory.city,
                    time_zone: visitorHistory.timezone,
                }
            })
        }
    }, [visitorHistory])
}
