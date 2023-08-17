import axios from "axios";
import moment from 'moment-timezone';


const API_KEY = 'f14a23ef4a1e47e79cb60228231708';

export const toFetchForecastBySearchAndDate = async (search, date) => {
    try {
        let endPoint = `https://api.weatherapi.com/v1/forecast.json?days=14&key=${API_KEY}`;
        if (search) {
            endPoint = `${endPoint}&q=${search}`;
        } else {
            endPoint = `${endPoint}&q=${moment.tz.guess()}`;
        }

        if (date) {
            endPoint = `${endPoint}&dt=${date}`;
        }
        const result = await axios.get(endPoint);

        return result.data;
    } catch (e) {
        console.error(e);
    }
}