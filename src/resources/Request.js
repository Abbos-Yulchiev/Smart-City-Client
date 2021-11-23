import axios from "axios";
import {BASE_URL, TOKEN} from "./Const";

export const postRequest = (url, data) => {
    return axios.post(BASE_URL + url, data, {
        headers: {
            'Authorization': localStorage.getItem(TOKEN),
            'Access-Control-Allow-Origin': '*',
        }
    })
}

export const getRequest = (url) => {
    return axios.get(BASE_URL + url, {
        headers: {
            'Authorization': localStorage.getItem(TOKEN),
            'Accept': '*/*',
            'Allow-Origin': '*',
            'Access-Control-Allow-Origin': '*',
        }
    })

}
export const loginRequest = (url, data) => {
    return axios.get(BASE_URL + url, data)
}

export const putRequest = (url, data) => {
    return axios.put(BASE_URL + url, data, {
        headers: {
            'Authorization': localStorage.getItem(TOKEN),
            'Access-Control-Allow-Origin': '*'
        }
    })
}

export const deleteRequest = (url) => {
    console.log(url);
    return axios.delete(BASE_URL + url, {
        headers: {
            'Authorization': localStorage.getItem(TOKEN),
            'Access-Control-Allow-Origin': '*'
        }
    })
}

export const postRequestWithoutToken = (url, data) => {
    return axios.post(BASE_URL + url, data);
}